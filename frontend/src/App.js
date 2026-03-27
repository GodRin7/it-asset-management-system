import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    serialNumber: "",
    assignedTo: "",
    status: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAssets = async () => {
    try {
      const res = await fetch(`${API_URL}/assets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setAssets(data);
      } else {
        setMessage(data.message || "Failed to fetch assets");
      }
    } catch (error) {
      setMessage("Error fetching assets");
    }
  };

  useEffect(() => {
    if (token) {
      fetchAssets();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setMessage("Login successful");
        setEmail("");
        setPassword("");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Server error during login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setAssets([]);
    setMessage("Logged out");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (editingId) {
        res = await fetch(`${API_URL}/assets/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch(`${API_URL}/assets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();

      if (res.ok) {
        setFormData({
          name: "",
          type: "",
          serialNumber: "",
          assignedTo: "",
          status: "",
        });
        setEditingId(null);
        fetchAssets();
        setMessage(
          editingId ? "Asset updated successfully" : "Asset added successfully"
        );
      } else {
        setMessage(data.message || "Operation failed");
      }
    } catch (error) {
      setMessage("Error saving asset");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    try {
      const res = await fetch(`${API_URL}/assets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Asset deleted successfully");
        fetchAssets();
      } else {
        setMessage(data.message || "Delete failed");
      }
    } catch (error) {
      setMessage("Error deleting asset");
    }
  };

  const handleEdit = (asset) => {
    setFormData({
      name: asset.name || "",
      type: asset.type || "",
      serialNumber: asset.serialNumber || "",
      assignedTo: asset.assignedTo || "",
      status: asset.status || "",
    });

    setEditingId(asset._id);
    setMessage("Editing asset");
  };

  const getStatusStyle = (status) => {
    const value = status?.toLowerCase();

    if (value === "active") {
      return {
        background: "rgba(34, 197, 94, 0.18)",
        color: "#86efac",
        border: "1px solid rgba(34, 197, 94, 0.35)",
      };
    }

    if (value === "in repair") {
      return {
        background: "rgba(245, 158, 11, 0.18)",
        color: "#fcd34d",
        border: "1px solid rgba(245, 158, 11, 0.35)",
      };
    }

    if (value === "unassigned") {
      return {
        background: "rgba(148, 163, 184, 0.18)",
        color: "#cbd5e1",
        border: "1px solid rgba(148, 163, 184, 0.35)",
      };
    }

    return {
      background: "rgba(99, 102, 241, 0.18)",
      color: "#c7d2fe",
      border: "1px solid rgba(99, 102, 241, 0.35)",
    };
  };

  const filteredAssets = assets.filter((asset) => {
    const query = searchTerm.toLowerCase();

    return (
      asset.name?.toLowerCase().includes(query) ||
      asset.type?.toLowerCase().includes(query) ||
      asset.serialNumber?.toLowerCase().includes(query) ||
      asset.assignedTo?.toLowerCase().includes(query) ||
      asset.status?.toLowerCase().includes(query)
    );
  });

  const totalAssets = filteredAssets.length;
  const activeAssets = assets.filter(
    (asset) => asset.status?.toLowerCase() === "active"
  ).length;
  const repairAssets = assets.filter(
    (asset) => asset.status?.toLowerCase() === "in repair"
  ).length;
  const unassignedAssets = assets.filter(
    (asset) => asset.status?.toLowerCase() === "unassigned"
  ).length;

  const pageStyle = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #1e293b 0%, #0f172a 35%, #020617 100%)",
    color: "#e5e7eb",
    padding: "32px 20px",
    fontFamily: "Arial, sans-serif",
  };

  const shellStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const cardStyle = {
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(148, 163, 184, 0.22)",
    background: "rgba(15, 23, 42, 0.9)",
    color: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
  };

  const primaryButtonStyle = {
    background: editingId
      ? "linear-gradient(135deg, #f59e0b, #d97706)"
      : "linear-gradient(135deg, #2563eb, #7c3aed)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 18px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(37, 99, 235, 0.28)",
  };

  const secondaryButtonStyle = {
    background: "rgba(255,255,255,0.08)",
    color: "#e5e7eb",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    padding: "10px 14px",
    cursor: "pointer",
  };

  const dangerButtonStyle = {
    background: "rgba(239, 68, 68, 0.15)",
    color: "#fca5a5",
    border: "1px solid rgba(239, 68, 68, 0.28)",
    borderRadius: "10px",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: "600",
  };

  const editButtonStyle = {
    background: "rgba(59, 130, 246, 0.15)",
    color: "#93c5fd",
    border: "1px solid rgba(59, 130, 246, 0.28)",
    borderRadius: "10px",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: "600",
    marginRight: "8px",
  };

  if (!token) {
    return (
      <div style={pageStyle}>
        <div style={{ maxWidth: "420px", margin: "80px auto" }}>
          <div style={{ ...cardStyle, padding: "32px" }}>
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#94a3b8",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Secure Access
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "32px",
                  color: "#f8fafc",
                }}
              >
                Admin Login
              </h1>
              <p style={{ color: "#94a3b8", marginTop: "10px", marginBottom: 0 }}>
                Sign in to manage assets, status, and inventory records.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "14px" }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              <button type="submit" style={{ ...primaryButtonStyle, width: "100%" }}>
                Login
              </button>
            </form>

            {message && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: "rgba(59, 130, 246, 0.12)",
                  border: "1px solid rgba(59, 130, 246, 0.22)",
                  color: "#bfdbfe",
                  fontSize: "14px",
                }}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={shellStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                color: "#94a3b8",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "10px",
              }}
            >
              Asset Operations Dashboard
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: "40px",
                color: "#f8fafc",
              }}
            >
              IT Asset Management System
            </h1>
            <p style={{ color: "#94a3b8", marginTop: "10px", marginBottom: 0 }}>
              Logged in as <strong style={{ color: "#fff" }}>{user?.email}</strong> ({user?.role})
            </p>
          </div>

          <button onClick={handleLogout} style={secondaryButtonStyle}>
            Logout
          </button>
        </div>

        {message && (
          <div
            style={{
              ...cardStyle,
              padding: "14px 18px",
              marginBottom: "22px",
              color: "#cbd5e1",
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[
            { label: "Total Assets", value: totalAssets },
            { label: "Active", value: activeAssets },
            { label: "In Repair", value: repairAssets },
            { label: "Unassigned", value: unassignedAssets },
          ].map((item) => (
            <div key={item.label} style={{ ...cardStyle, padding: "22px" }}>
              <div style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "10px" }}>
                {item.label}
              </div>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#f8fafc" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...cardStyle, padding: "24px", marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <h2 style={{ margin: 0, color: "#f8fafc" }}>
                {editingId ? "Edit Asset" : "Add Asset"}
              </h2>
              <p style={{ margin: "8px 0 0", color: "#94a3b8" }}>
                Maintain inventory records with status tracking.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleAddAsset}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
              alignItems: "end",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#cbd5e1" }}>
                Asset Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Dell OptiPlex 7090"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#cbd5e1" }}>
                Type
              </label>
              <input
                type="text"
                name="type"
                placeholder="e.g. Desktop"
                value={formData.type}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#cbd5e1" }}>
                Serial Number
              </label>
              <input
                type="text"
                name="serialNumber"
                placeholder="e.g. SN-2026-001"
                value={formData.serialNumber}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#cbd5e1" }}>
                Assigned To
              </label>
              <input
                type="text"
                name="assignedTo"
                placeholder="e.g. Juan Dela Cruz"
                value={formData.assignedTo}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#cbd5e1" }}>
                Status
              </label>
              <input
                type="text"
                name="status"
                placeholder="e.g. Active"
                value={formData.status}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <button type="submit" style={{ ...primaryButtonStyle, width: "100%" }}>
                {editingId ? "Update Asset" : "Add Asset"}
              </button>
            </div>
          </form>
        </div>

        <div style={{ ...cardStyle, padding: "24px" }}>
          <div
            style={{
              marginBottom: "18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ margin: 0, color: "#f8fafc" }}>Assets</h2>
              <p style={{ margin: "8px 0 0", color: "#94a3b8" }}>
                View and manage current inventory records.
              </p>
            </div>

            <div style={{ minWidth: "280px", flex: "1", maxWidth: "360px" }}>
              <input
                type="text"
                placeholder="Search by name, type, serial, assigned user, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                color: "#e5e7eb",
              }}
            >
              <thead>
                <tr>
                  <th style={tableHeadStyle}>Name</th>
                  <th style={tableHeadStyle}>Type</th>
                  <th style={tableHeadStyle}>Serial Number</th>
                  <th style={tableHeadStyle}>Assigned To</th>
                  <th style={tableHeadStyle}>Status</th>
                  <th style={tableHeadStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset, index) => (
                    <tr
                      key={asset._id}
                      style={{
                        background:
                          index % 2 === 0
                            ? "rgba(15, 23, 42, 0.55)"
                            : "rgba(30, 41, 59, 0.4)",
                      }}
                    >
                      <td style={tableCellStyle}>{asset.name}</td>
                      <td style={tableCellStyle}>{asset.type}</td>
                      <td style={tableCellStyle}>{asset.serialNumber || "—"}</td>
                      <td style={tableCellStyle}>{asset.assignedTo || "—"}</td>
                      <td style={tableCellStyle}>
                        <span
                          style={{
                            ...getStatusStyle(asset.status),
                            display: "inline-block",
                            padding: "6px 12px",
                            borderRadius: "999px",
                            fontSize: "13px",
                            fontWeight: "700",
                          }}
                        >
                          {asset.status}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        <button onClick={() => handleEdit(asset)} style={editButtonStyle}>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(asset._id)}
                          style={dangerButtonStyle}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={tableCellStyle} colSpan="6">
                      No assets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const tableHeadStyle = {
  textAlign: "left",
  padding: "16px",
  background: "rgba(255,255,255,0.06)",
  color: "#cbd5e1",
  fontSize: "14px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const tableCellStyle = {
  padding: "16px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

export default App;