import React, { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000";

const STATUS_OPTIONS = ["Active", "In Repair", "Unassigned", "Retired"];
const TYPE_OPTIONS = [
  "Desktop",
  "Laptop",
  "Printer",
  "Router",
  "Switch",
  "Monitor",
  "Access Point",
  "Server",
];

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
    status: "Active",
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");

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

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      serialNumber: "",
      assignedTo: "",
      status: "Active",
    });
    setEditingId(null);
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
        resetForm();
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
      status: asset.status || "Active",
    });

    setEditingId(asset._id);
    setMessage("Editing asset");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setTypeFilter("All");
    setSortBy("name-asc");
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

    if (value === "retired") {
      return {
        background: "rgba(239, 68, 68, 0.18)",
        color: "#fca5a5",
        border: "1px solid rgba(239, 68, 68, 0.35)",
      };
    }

    return {
      background: "rgba(99, 102, 241, 0.18)",
      color: "#c7d2fe",
      border: "1px solid rgba(99, 102, 241, 0.35)",
    };
  };

  const filteredAssets = useMemo(() => {
    let result = assets.filter((asset) => {
      const query = searchTerm.toLowerCase();

      const matchesSearch =
        asset.name?.toLowerCase().includes(query) ||
        asset.type?.toLowerCase().includes(query) ||
        asset.serialNumber?.toLowerCase().includes(query) ||
        asset.assignedTo?.toLowerCase().includes(query) ||
        asset.status?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || asset.status === statusFilter;

      const matchesType = typeFilter === "All" || asset.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        case "type":
          return (a.type || "").localeCompare(b.type || "");
        default:
          return 0;
      }
    });

    return result;
  }, [assets, searchTerm, statusFilter, typeFilter, sortBy]);

  const totalAssets = assets.length;
  const activeAssets = assets.filter(
    (asset) => asset.status?.toLowerCase() === "active"
  ).length;
  const repairAssets = assets.filter(
    (asset) => asset.status?.toLowerCase() === "in repair"
  ).length;
  const unassignedAssets = assets.filter(
    (asset) => asset.status?.toLowerCase() === "unassigned"
  ).length;
  const retiredAssets = assets.filter(
    (asset) => asset.status?.toLowerCase() === "retired"
  ).length;

  const utilizationRate =
    totalAssets > 0 ? Math.round((activeAssets / totalAssets) * 100) : 0;

  const pageStyle = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #1e293b 0%, #0f172a 35%, #020617 100%)",
    color: "#e5e7eb",
    padding: "32px 20px",
    fontFamily: "Inter, Arial, sans-serif",
  };

  const shellStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const cardStyle = {
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "22px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
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
    fontSize: "14px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: "600",
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
    fontWeight: "600",
  };

  const subtleButtonStyle = {
    background: "rgba(255,255,255,0.04)",
    color: "#cbd5e1",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "14px 18px",
    cursor: "pointer",
    fontWeight: "600",
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
        <div style={{ maxWidth: "430px", margin: "90px auto" }}>
          <div style={{ ...cardStyle, padding: "34px" }}>
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  letterSpacing: "1.6px",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                  fontWeight: "700",
                }}
              >
                Enterprise Access
              </div>
              <h1 style={{ margin: 0, fontSize: "32px", color: "#f8fafc" }}>
                Asset Control Portal
              </h1>
              <p
                style={{
                  color: "#94a3b8",
                  marginTop: "10px",
                  marginBottom: 0,
                  lineHeight: "1.6",
                }}
              >
                Sign in to access the internal asset operations dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "14px" }}>
                <input
                  type="email"
                  placeholder="Email address"
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

              <button
                type="submit"
                style={{ ...primaryButtonStyle, width: "100%" }}
              >
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
            ...cardStyle,
            padding: "24px 28px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "18px",
          }}
        >
          <div>
            <div
              style={{
                color: "#94a3b8",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "1.4px",
                marginBottom: "10px",
                fontWeight: "700",
              }}
            >
              Enterprise IT Operations
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: "38px",
                color: "#f8fafc",
                lineHeight: "1.1",
              }}
            >
              Asset Management Console
            </h1>
            <p
              style={{
                color: "#94a3b8",
                marginTop: "10px",
                marginBottom: 0,
              }}
            >
              Logged in as{" "}
              <strong style={{ color: "#fff" }}>{user?.email}</strong> (
              {user?.role})
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "12px",
                background: "rgba(34, 197, 94, 0.12)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
                color: "#86efac",
                fontWeight: "700",
                fontSize: "13px",
              }}
            >
              System Online
            </div>
            <button onClick={handleLogout} style={secondaryButtonStyle}>
              Logout
            </button>
          </div>
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

        {editingId && (
          <div
            style={{
              ...cardStyle,
              padding: "16px 18px",
              marginBottom: "22px",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              color: "#fde68a",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <strong>Edit Mode Active</strong> — You are updating an existing
              asset record.
            </div>
            <button onClick={resetForm} style={secondaryButtonStyle}>
              Cancel Edit
            </button>
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
            { label: "Total Assets", value: totalAssets, sub: "Full inventory" },
            { label: "Active", value: activeAssets, sub: "Operational units" },
            { label: "In Repair", value: repairAssets, sub: "Maintenance queue" },
            { label: "Unassigned", value: unassignedAssets, sub: "Available stock" },
            { label: "Retired", value: retiredAssets, sub: "Decommissioned" },
            { label: "Utilization", value: `${utilizationRate}%`, sub: "Currently active" },
          ].map((item) => (
            <div key={item.label} style={{ ...cardStyle, padding: "22px" }}>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "13px",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#f8fafc",
                  lineHeight: "1",
                  marginBottom: "8px",
                }}
              >
                {item.value}
              </div>
              <div style={{ color: "#64748b", fontSize: "13px" }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 1.1fr) minmax(340px, 1.9fr)",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <div style={{ ...cardStyle, padding: "24px" }}>
            <div style={{ marginBottom: "18px" }}>
              <h2 style={{ margin: 0, color: "#f8fafc" }}>
                {editingId ? "Update Asset Record" : "Register New Asset"}
              </h2>
              <p style={{ margin: "8px 0 0", color: "#94a3b8" }}>
                Capture asset identity, ownership, and operational status.
              </p>
            </div>

            <form
              onSubmit={handleAddAsset}
              style={{ display: "grid", gap: "14px" }}
            >
              <div>
                <label style={labelStyle}>Asset Name</label>
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
                <label style={labelStyle}>Asset Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Select type</option>
                  {TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Serial Number</label>
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
                <label style={labelStyle}>Assigned To</label>
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
                <label style={labelStyle}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginTop: "6px",
                }}
              >
                <button type="submit" style={primaryButtonStyle}>
                  {editingId ? "Update Asset" : "Add Asset"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={subtleButtonStyle}
                >
                  Clear Form
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
                <h2 style={{ margin: 0, color: "#f8fafc" }}>Asset Directory</h2>
                <p style={{ margin: "8px 0 0", color: "#94a3b8" }}>
                  Search, filter, and review all registered assets.
                </p>
              </div>
              <button onClick={clearFilters} style={secondaryButtonStyle}>
                Reset Filters
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                gap: "12px",
                marginBottom: "18px",
              }}
            >
              <input
                type="text"
                placeholder="Search name, type, serial, owner, status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={inputStyle}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={inputStyle}
              >
                <option value="All">All Status</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={inputStyle}
              >
                <option value="All">All Types</option>
                {TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={inputStyle}
              >
                <option value="name-asc">Sort: Name A-Z</option>
                <option value="name-desc">Sort: Name Z-A</option>
                <option value="status">Sort: Status</option>
                <option value="type">Sort: Type</option>
              </select>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "18px",
              }}
            >
              <FilterPill label={`Showing: ${filteredAssets.length}`} />
              <FilterPill label={`Status: ${statusFilter}`} />
              <FilterPill label={`Type: ${typeFilter}`} />
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
                        <td style={tableCellStyle}>
                          <div style={{ fontWeight: "700", color: "#f8fafc" }}>
                            {asset.name}
                          </div>
                        </td>
                        <td style={tableCellStyle}>{asset.type}</td>
                        <td style={tableCellStyle}>
                          {asset.serialNumber || "—"}
                        </td>
                        <td style={tableCellStyle}>
                          {asset.assignedTo || "—"}
                        </td>
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
                          <button
                            onClick={() => handleEdit(asset)}
                            style={editButtonStyle}
                          >
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
                        <div
                          style={{
                            padding: "28px 0",
                            textAlign: "center",
                            color: "#94a3b8",
                          }}
                        >
                          No matching assets found.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterPill({ label }) {
  return (
    <div
      style={{
        padding: "8px 12px",
        borderRadius: "999px",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#cbd5e1",
        fontSize: "13px",
        fontWeight: "600",
      }}
    >
      {label}
    </div>
  );
}

const tableHeadStyle = {
  textAlign: "left",
  padding: "16px",
  background: "rgba(255,255,255,0.06)",
  color: "#cbd5e1",
  fontSize: "13px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  textTransform: "uppercase",
  letterSpacing: "0.8px",
};

const tableCellStyle = {
  padding: "16px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  fontSize: "14px",
};

export default App;