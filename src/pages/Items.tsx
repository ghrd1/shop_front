import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { itemsAPI } from "../api";

interface Item {
  id: number;
  name: string;
  description: string;
  price: string;
}

interface CartItem extends Item {
  quantity: number;
}

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await itemsAPI.getAll();
      setItems(response.data);
    } catch (err) {
      setError("Failed to load items");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await itemsAPI.search(searchQuery);
      setItems(response.data);
    } catch (err) {
      setError("Search failed");
    }
  };

  const addToCart = (item: Item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
    );
  };

  const getTotal = () => {
    return cart.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0,
    );
  };

  const goToCheckout = () => {
    if (cart.length === 0) return;

    const orderItems = cart.map((item) => ({
      item_id: item.id,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
      description: item.description,
    }));

    localStorage.setItem("checkout_items", JSON.stringify(orderItems));
    navigate("/checkout");
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Items</h2>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        style={{ marginBottom: "20px", display: "flex", gap: "8px" }}
      >
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input"
          style={{ maxWidth: 320 }}
        />
        <button type="submit" className="btn btn-secondary">
          Search
        </button>
        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            loadItems();
          }}
          className="btn btn-secondary"
        >
          Reset
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <div className="items-layout">
        <div className="items-layout-main">
          {/* Items Grid */}
          <div className="items-grid">
            {items.map((item) => (
              <div key={item.id} className="card">
                <h3 className="card-title">{item.name}</h3>
                <p className="card-description">{item.description}</p>
                <p className="card-price">Price: ${item.price}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="btn btn-primary"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="items-layout-cart">
          <div className="sticky-cart">
            <div className="cart-section">
              <h3>Shopping Cart</h3>
              {cart.length === 0 ? (
                <p className="muted-text">Your cart is empty</p>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item.id} className="cart-card">
                        <h4>{item.name}</h4>
                        <p>Price: ${item.price}</p>
                        <div className="cart-row">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="btn btn-secondary"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="btn btn-secondary"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="btn btn-danger"
                            style={{ marginLeft: "4px" }}
                          >
                            Remove
                          </button>
                        </div>
                        <p>
                          Subtotal: $
                          {(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <h3 className="cart-total">
                    Total: ${getTotal().toFixed(2)}
                  </h3>
                  <button
                    onClick={goToCheckout}
                    className="btn btn-primary"
                    style={{ marginTop: "10px" }}
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Items;
