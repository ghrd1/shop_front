import React, { useState, useEffect } from "react";
import { usersAPI, itemsAPI } from "../api";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface Item {
  id: number;
  name: string;
  description: string;
  price: string;
}

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"users" | "items">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // User form state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "user",
  });

  // Item form state
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "users") {
        const response = await usersAPI.getAll();
        setUsers(response.data);
      } else {
        const response = await itemsAPI.getAll();
        setItems(response.data);
      }
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // User operations
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    try {
      await usersAPI.update(editingUser.id, userForm);
      loadData();
      setEditingUser(null);
    } catch (err) {
      setError("Failed to update user");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await usersAPI.delete(id);
      loadData();
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  // Item operations
  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price,
    });
  };

  const handleSaveItem = async () => {
    if (!editingItem) return;
    try {
      await itemsAPI.update(editingItem.id, {
        name: itemForm.name,
        description: itemForm.description,
        price: parseFloat(itemForm.price),
      });
      loadData();
      setEditingItem(null);
    } catch (err) {
      setError("Failed to update item");
    }
  };

  const handleCreateItem = async () => {
    try {
      await itemsAPI.create({
        name: itemForm.name,
        description: itemForm.description,
        price: parseFloat(itemForm.price),
      });
      loadData();
      setEditingItem(null);
      setItemForm({ name: "", description: "", price: "" });
    } catch (err) {
      setError("Failed to create item");
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await itemsAPI.delete(id);
      loadData();
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Admin Panel</h2>
      </div>

      {error && <p className="error-text">{error}</p>}

      {/* Tabs */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "8px" }}>
        <button
          onClick={() => setActiveTab("users")}
          className="btn btn-secondary"
          style={
            activeTab === "users"
              ? { backgroundColor: "#2563eb", color: "#f9fafb" }
              : {}
          }
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("items")}
          className="btn btn-secondary"
          style={
            activeTab === "items"
              ? { backgroundColor: "#2563eb", color: "#f9fafb" }
              : {}
          }
        >
          Items
        </button>
      </div>

      {loading ? (
        <p className="muted-text">Loading...</p>
      ) : (
        <>
          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="card">
              <h3 className="card-title">Users Management</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f3f4f6" }}>
                    <th style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                      ID
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                      Email
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                      First Name
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                      Last Name
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                      Role
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                        {user.id}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                        {user.email}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                        {user.first_name}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                        {user.last_name}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                        {user.role}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="btn btn-secondary"
                          style={{ marginRight: "6px" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* User Edit Modal */}
              {editingUser && (
                <div style={{ marginTop: "20px" }} className="form-card">
                  <h4>Edit User</h4>
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={userForm.first_name}
                      onChange={(e) =>
                        setUserForm({ ...userForm, first_name: e.target.value })
                      }
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={userForm.last_name}
                      onChange={(e) =>
                        setUserForm({ ...userForm, last_name: e.target.value })
                      }
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={userForm.role}
                      onChange={(e) =>
                        setUserForm({ ...userForm, role: e.target.value })
                      }
                      className="input"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </div>
                  <button
                    onClick={handleSaveUser}
                    className="btn btn-primary"
                    style={{ marginRight: "10px" }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Items Tab */}
          {activeTab === "items" && (
            <div className="card">
              <h3 className="card-title">Items Management</h3>

              {/* Create Item Form */}
              <div className="cart-card" style={{ margin: "16px 0" }}>
                <h4 style={{ marginBottom: "10px" }}>Create New Item</h4>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Name"
                    value={itemForm.name}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, name: e.target.value })
                    }
                    className="input"
                    style={{ maxWidth: "200px" }}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={itemForm.description}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, description: e.target.value })
                    }
                    className="input"
                    style={{ flex: 1, minWidth: "200px" }}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={itemForm.price}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, price: e.target.value })
                    }
                    className="input"
                    style={{ maxWidth: "140px" }}
                  />
                  <button
                    onClick={handleCreateItem}
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f3f4f6" }}>
                    <th style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                      ID
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                      Name
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                      Description
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                      Price
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                        {item.id}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                        {item.name}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                        {item.description}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                        ${item.price}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #e5e7eb" }}>
                        <button
                          onClick={() => handleEditItem(item)}
                          className="btn btn-secondary"
                          style={{ marginRight: "6px" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Item Edit Modal */}
              {editingItem && (
                <div style={{ marginTop: "20px" }} className="form-card">
                  <h4>Edit Item</h4>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={itemForm.name}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, name: e.target.value })
                      }
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input
                      type="text"
                      value={itemForm.description}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          description: e.target.value,
                        })
                      }
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      value={itemForm.price}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, price: e.target.value })
                      }
                      className="input"
                    />
                  </div>
                  <button
                    onClick={handleSaveItem}
                    className="btn btn-primary"
                    style={{ marginRight: "10px" }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;
