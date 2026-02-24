import React, { useState, useEffect } from "react";
import { ordersAPI } from "../api";

interface OrderItem {
  id: number;
  item_id: number;
  quantity: number;
  item: {
    id: number;
    name: string;
    price: string;
    description: string;
  };
}

interface Order {
  id: number;
  user_id: number;
  amount: string;
  created_at: string;
  order_descriptions: OrderItem[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data);
      if (response.data.length > 0 && !selectedOrderId) {
        setSelectedOrderId(response.data[0].id);
      }
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const totalAmount = orders.reduce((sum, order) => {
    const value = parseFloat(order.amount);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  const lastOrderDate =
    orders.length > 0
      ? orders
          .map((o) => o.created_at)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
      : null;

  if (loading) {
    return <div className="muted-text">Loading...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">My Orders</h2>
        {orders.length > 0 && (
          <div className="orders-summary">
            <div className="orders-summary-pill">
              Orders: {orders.length}
            </div>
            <div className="orders-summary-pill">
              Spent: ${totalAmount.toFixed(2)}
            </div>
            {lastOrderDate && (
              <div className="orders-summary-pill">
                Last: {formatDate(lastOrderDate)}
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      {orders.length === 0 ? (
        <p className="muted-text">No orders yet</p>
      ) : (
        <div className="orders-layout">
          <div className="orders-list">
            {orders.map((order) => {
              const isSelected = order.id === selectedOrderId;
              return (
                <div
                  key={order.id}
                  className={`card orders-card${
                    isSelected ? " orders-card-selected" : ""
                  }`}
                  onClick={() => handleSelectOrder(order.id)}
                >
                  <h3 className="card-title">Order #{order.id}</h3>
                  <p className="card-description">
                    <strong>Date:</strong> {formatDate(order.created_at)}
                  </p>
                  <p className="card-description">
                    <strong>Total:</strong> ${order.amount}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="orders-detail">
            {selectedOrderId && (
              <div className="card">
                {(() => {
                  const order = orders.find((o) => o.id === selectedOrderId);
                  if (!order) {
                    return (
                      <p className="muted-text">
                        Select an order to see details.
                      </p>
                    );
                  }

                  return (
                    <>
                      <h3 className="card-title">
                        Order #{order.id} details
                      </h3>
                      <p className="card-description">
                        <strong>Date:</strong> {formatDate(order.created_at)}
                      </p>
                      <p className="card-description">
                        <strong>Amount:</strong> ${order.amount}
                      </p>
                      <div
                        style={{
                          marginTop: "14px",
                          paddingTop: "10px",
                          borderTop: "1px solid #e5e7eb",
                        }}
                      >
                        {order.order_descriptions &&
                          order.order_descriptions.map((desc) => (
                            <div
                              key={desc.id}
                              className="cart-card"
                              style={{ marginBottom: "10px" }}
                            >
                              <p>
                                <strong>Item:</strong>{" "}
                                {desc.item?.name || `Item #${desc.item_id}`}
                              </p>
                              <p>
                                <strong>Price:</strong>{" "}
                                ${desc.item?.price || "N/A"}
                              </p>
                              <p>
                                <strong>Quantity:</strong> {desc.quantity}
                              </p>
                              <p>
                                <strong>Subtotal:</strong> $
                                {desc.item
                                  ? (
                                      parseFloat(desc.item.price) *
                                      desc.quantity
                                    ).toFixed(2)
                                  : "N/A"}
                              </p>
                            </div>
                          ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
