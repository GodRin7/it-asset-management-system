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
  const [editId, setEditId] = useState(null);

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

  const resetForm = () => {
    setForm({
      name: "",
      type: "",
      serialNumber: "",
      assignedTo: "",
      status: ""
    });
    setEditId(null);
  };

  const addOrUpdateAsset = async () => {
    if (!form.name.trim()) {
      alert("Asset name is required");
      return;
    }

    const url = editId
      ? `http://localhost:5000/assets/${editId}`
      : "http://localhost:5000/assets";

    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    resetForm();
    fetchAssets();
  };

  const deleteAsset = async (id) => {
    await fetch(`http://localhost:5000/assets/${id}`, {
      method: "DELETE"
    });
    fetchAssets();
  };

  const editAsset = (asset) => {
    setForm({
      name: asset.name || "",
      type: asset.type || "",
      serialNumber: asset.serialNumber || "",
      assignedTo: asset.assignedTo || "",
      status: asset.status || ""
    });
    setEditId(asset._id);
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
          <button onClick={addOrUpdateAsset}>
            {editId ? "Update Asset" : "Add Asset"}
          </button>
        </div>

        {editId && (
          <button className="cancel-btn" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
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
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => editAsset(asset)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteAsset(asset._id)}
                        >
                          Delete
                        </button>
                      </div>
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