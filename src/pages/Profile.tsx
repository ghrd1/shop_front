import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { usersAPI } from "../api";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await usersAPI.updateProfile({
        first_name: firstName,
        last_name: lastName,
      });
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>My Profile</h2>

      {error && <p className="error-text">{error}</p>}
      {success && (
        <p className="muted-text" style={{ color: "#16a34a" }}>
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="input"
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="input"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="input"
            style={{ backgroundColor: "#f3f4f6" }}
          />
          <small className="muted-text">Email cannot be changed</small>
        </div>

        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            value={user?.role || ""}
            disabled
            className="input"
            style={{ backgroundColor: "#f3f4f6" }}
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
