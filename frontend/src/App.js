import { useState, useEffect } from "react";

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
    await fetch("http://localhost:5000/assets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    fetchAssets();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>IT Asset Management</h1>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="type" placeholder="Type" onChange={handleChange} />
      <input name="serialNumber" placeholder="Serial Number" onChange={handleChange} />
      <input name="assignedTo" placeholder="Assigned To" onChange={handleChange} />
      <input name="status" placeholder="Status" onChange={handleChange} />

      <button onClick={addAsset}>Add Asset</button>

      <h2>Assets</h2>
      <ul>
        {assets.map((a) => (
          <li key={a._id}>
            {a.name} - {a.type} - {a.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;