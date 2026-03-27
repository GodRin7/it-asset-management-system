import { useState, useEffect, useMemo } from "react";
import "./App.css";

function App() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    type: "Desktop",
    serialNumber: "",
    assignedTo: "",
    status: "Active"
  });
  const [editId, setEditId] = useState(null);

  const assetTypes = [
    "Desktop",
    "Laptop",
    "Router",
    "Switch",
    "Printer",
    "Access Point"
  ];

  const assetStatuses = [
    "Active",
    "In Repair",
    "Retired",
    "Lost",
    "Unassigned"
  ];

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
      type: "Desktop",
      serialNumber: "",
      assignedTo: "",
      status: "Active"
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
      type: asset.type || "Desktop",
      serialNumber: asset.serialNumber || "",
      assignedTo: asset.assignedTo || "",
      status: asset.status || "Active"
    });
    setEditId(asset._id);
  };

  const filteredAssets = useMemo(() => {
    const keyword = search.toLowerCase();

    return assets.filter((asset) =>
      [asset.name, asset.type, asset.serialNumber, asset.assignedTo, asset.status]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [assets, search]);

  const stats = useMemo(() => {
    const total = assets.length;
    const active = assets.filter((a) => a.status === "Active").length;
    const inRepair = assets.filter((a) => a.status === "In Repair").length;
    const unassigned = assets.filter(
      (a) =>
        a.status === "Unassigned" ||
        !a.assignedTo ||
        !a.assignedTo.trim()
    ).length;

    return { total, active, inRepair, unassigned };
  }, [assets]);

  return (
    <div className="app-container">
      <div className="header-block">
        <h1>IT Asset Management</h1>
        <p className="subtitle">
          Track, update, and manage organizational IT equipment.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Assets</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Active</h3>
          <p>{stats.active}</p>
        </div>
        <div className="stat-card">
          <h3>In Repair</h3>
          <p>{stats.inRepair}</p>
        </div>
        <div className="stat-card">
          <h3>Unassigned</h3>
          <p>{stats.unassigned}</p>
        </div>
      </div>

      <div className="card">
        <h2>{editId ? "Edit Asset" : "Add New Asset"}</h2>

        <div className="form-grid">
          <input
            name="name"
            placeholder="Asset Name"
            value={form.name}
            onChange={handleChange}
          />

          <select name="type" value={form.type} onChange={handleChange}>
            {assetTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

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

          <select name="status" value={form.status} onChange={handleChange}>
            {assetStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

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
        <div className="inventory-header">
          <h2>Asset Inventory</h2>
          <input
            className="search-input"
            type="text"
            placeholder="Search by name, serial number, type, assigned to, status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset._id}>
                    <td>{asset.name}</td>
                    <td>{asset.type}</td>
                    <td>{asset.serialNumber}</td>
                    <td>{asset.assignedTo || "—"}</td>
                    <td>
                      <span className={`status-badge status-${asset.status.toLowerCase().replace(/\s+/g, "-")}`}>
                        {asset.status}
                      </span>
                    </td>
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
                    No matching assets found.
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