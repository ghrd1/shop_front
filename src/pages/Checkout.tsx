import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ordersAPI } from "../api";

interface CartItem {
  item_id: number;
  quantity: number;
  name?: string;
  price?: string;
  description?: string;
}

const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("checkout_items");
    if (stored) {
      const items = JSON.parse(stored);
      setCartItems(items);
    }
  }, []);

  const updateQuantity = (itemId: number, quantity: number) => {
    setCartItems((prev) => {
      let updated = prev;
      if (quantity <= 0) {
        updated = prev.filter((i) => i.item_id !== itemId);
      } else {
        updated = prev.map((i) =>
          i.item_id === itemId ? { ...i, quantity } : i,
        );
      }
      localStorage.setItem("checkout_items", JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (itemId: number) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => i.item_id !== itemId);
      localStorage.setItem("checkout_items", JSON.stringify(updated));
      return updated;
    });
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.price ? parseFloat(item.price) : 0;
      return sum + price * item.quantity;
    }, 0);
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const orderItems = cartItems.map((item) => ({
        item_id: item.item_id,
        quantity: item.quantity,
      }));
      await ordersAPI.create(orderItems);
      localStorage.removeItem("checkout_items");
      setSuccess(true);
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="form-card" style={{ textAlign: "center" }}>
        <h2>Order placed successfully!</h2>
        <p className="muted-text">Redirecting to orders page...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Checkout</h2>
      </div>

      {cartItems.length === 0 ? (
        <p className="muted-text">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-section">
            <h3>Order Summary</h3>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-card" style={{ width: "100%" }}>
                  <div>
                    <p>
                      <strong>Item:</strong>{" "}
                      {item.name || `Item #${item.item_id}`}
                    </p>
                    <p>
                      <strong>Description:</strong> {item.description || "N/A"}
                    </p>
                    <p>
                      <strong>Price:</strong> ${item.price || "0"}
                    </p>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <p>
                      <strong>Quantity:</strong>
                    </p>
                    <div className="cart-row" style={{ justifyContent: "flex-start" }}>
                      <button
                        onClick={() =>
                          updateQuantity(item.item_id, item.quantity - 1)
                        }
                        className="btn btn-secondary"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.item_id, item.quantity + 1)
                        }
                        className="btn btn-secondary"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.item_id)}
                        className="btn btn-danger"
                      >
                        Remove
                      </button>
                    </div>
                    <p style={{ marginTop: "8px" }}>
                      <strong>Subtotal:</strong> $
                      {item.price
                        ? (parseFloat(item.price) * item.quantity).toFixed(2)
                        : "0"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h3 className="cart-total">Total: ${getTotal().toFixed(2)}</h3>

          {error && <p className="error-text">{error}</p>}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn btn-primary"
            style={{ marginTop: "12px" }}
          >
            {loading ? "Processing..." : "Place Order (Pay)"}
          </button>
        </>
      )}

      <button
        onClick={() => navigate("/")}
        className="btn btn-secondary"
        style={{ marginTop: "12px", marginLeft: "8px" }}
      >
        Back to Items
      </button>
    </div>
  );
};

export default Checkout;
