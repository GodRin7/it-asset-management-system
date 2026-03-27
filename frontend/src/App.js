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
    status: "",
  });

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
      const res = await fetch(`${API_URL}/assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setFormData({ name: "", type: "", status: "" });
        fetchAssets();
        setMessage("Asset added successfully");
      } else {
        setMessage(data.message || "Failed to add asset");
      }
    } catch (error) {
      setMessage("Error adding asset");
    }
  };

  if (!token) {
    return (
      <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "10px" }}
            />
          </div>

          <button type="submit" style={{ width: "100%", padding: "10px" }}>
            Login
          </button>
        </form>

        {message && <p>{message}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "30px auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>IT Asset Management System</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <p>
        Logged in as: <strong>{user?.email}</strong> ({user?.role})
      </p>

      {message && <p>{message}</p>}

      <h2>Add Asset</h2>
      <form onSubmit={handleAddAsset} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Asset Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={formData.type}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <input
          type="text"
          name="status"
          placeholder="Status"
          value={formData.status}
          onChange={handleChange}
          required
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <button type="submit">Add</button>
      </form>

      <h2>Assets</h2>
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {assets.length > 0 ? (
            assets.map((asset) => (
              <tr key={asset._id}>
                <td>{asset.name}</td>
                <td>{asset.type}</td>
                <td>{asset.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No assets found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;