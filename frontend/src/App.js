import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    serialNumber: "",
    assignedTo: "",
    status: ""
  });

  const fetchAssets = async () => {
    const res = await fetch("http://localhost:5000/assets");
    const data = await res.json();
    setAssets(data);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addAsset = async () => {
    if (!form.name.trim()) {
      alert("Asset name is required");
      return;
    }

    await fetch("http://localhost:5000/assets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    setForm({
      name: "",
      type: "",
      serialNumber: "",
      assignedTo: "",
      status: ""
    });

    fetchAssets();
  };

  const deleteAsset = async (id) => {
    await fetch(`http://localhost:5000/assets/${id}`, {
      method: "DELETE"
    });
    fetchAssets();
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>IT Asset Management</h1>
        <p className="subtitle">Track and manage IT equipment efficiently.</p>

        <div className="form-grid">
          <input
            name="name"
            placeholder="Asset Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="type"
            placeholder="Type"
            value={form.type}
            onChange={handleChange}
          />
          <input
            name="serialNumber"
            placeholder="Serial Number"
            value={form.serialNumber}
            onChange={handleChange}
          />
          <input
            name="assignedTo"
            placeholder="Assigned To"
            value={form.assignedTo}
            onChange={handleChange}
          />
          <input
            name="status"
            placeholder="Status"
            value={form.status}
            onChange={handleChange}
          />
          <button onClick={addAsset}>Add Asset</button>
        </div>
      </div>

      <div className="card">
        <h2>Asset Inventory</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Serial Number</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <tr key={asset._id}>
                    <td>{asset.name}</td>
                    <td>{asset.type}</td>
                    <td>{asset.serialNumber}</td>
                    <td>{asset.assignedTo}</td>
                    <td>{asset.status}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteAsset(asset._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No assets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;