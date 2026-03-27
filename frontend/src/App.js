import React, { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000";

const STATUS_OPTIONS = ["Active", "In Repair", "Unassigned", "Retired"];
const TYPE_OPTIONS = [
  "Desktop", "Laptop", "Printer", "Router",
  "Switch", "Monitor", "Access Point", "Server",
];

const STATUS_META = {
  active:     { color: "#00E5A0", bg: "rgba(0,229,160,0.08)",   border: "rgba(0,229,160,0.22)",   dot: "#00E5A0" },
  "in repair":{ color: "#FFB547", bg: "rgba(255,181,71,0.08)",  border: "rgba(255,181,71,0.22)",  dot: "#FFB547" },
  unassigned: { color: "#8B9FC0", bg: "rgba(139,159,192,0.08)", border: "rgba(139,159,192,0.22)", dot: "#8B9FC0" },
  retired:    { color: "#FF5C7A", bg: "rgba(255,92,122,0.08)",  border: "rgba(255,92,122,0.22)",  dot: "#FF5C7A" },
};

const TYPE_ICONS = {
  Desktop: "🖥", Laptop: "💻", Printer: "🖨", Router: "📡",
  Switch: "🔀", Monitor: "🖵", "Access Point": "📶", Server: "🗄",
};

const css = `
  
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-void:      #040507;
    --bg-base:      #080B10;
    --bg-surface:   #0D1117;
    --bg-raised:    #131A24;
    --bg-overlay:   #1A2333;
    --border-dim:   rgba(255,255,255,0.05);
    --border-mid:   rgba(255,255,255,0.09);
    --border-glow:  rgba(0,120,255,0.28);
    --accent-blue:  #0078FF;
    --accent-cyan:  #00C8FF;
    --accent-green: #00E5A0;
    --text-primary: #EDF2FF;
    --text-secondary:#8B9FC0;
    --text-muted:   #4A5568;
    --font-display: 'Inter', sans-serif;
--font-body:    'Inter', sans-serif;
--font-mono:    'JetBrains Mono', monospace;
    --radius-sm:    6px;
    --radius-md:    10px;
    --radius-lg:    16px;
    --radius-xl:    22px;
    --shadow-card:  0 1px 3px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.4);
    --shadow-glow:  0 0 40px rgba(0,120,255,0.12);
    --transition:   0.18s cubic-bezier(0.4,0,0.2,1);
  }

  html, body { height: 100%; background: var(--bg-void); }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

  .ams-root {
    min-height: 100vh;
    background: var(--bg-void);
    background-image:
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,120,255,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 40% 30% at 90% 80%, rgba(0,200,255,0.04) 0%, transparent 50%);
    font-family: var(--font-body);
    color: var(--text-primary);
    padding: 0 0 60px;
  }

  /* TOP NAV */
  .topnav {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    height: 58px;
    background: rgba(4,5,7,0.88);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border-dim);
  }
  .topnav-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .brand-icon {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
  }
  .brand-name {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--text-primary);
  }
  .brand-name span { color: var(--accent-blue); }
  .topnav-center {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .topnav-right {
    display: flex; align-items: center; gap: 12px;
  }
  .nav-badge {
    display: flex; align-items: center; gap: 6px;
    padding: 5px 10px;
    border-radius: var(--radius-sm);
    background: rgba(0,229,160,0.07);
    border: 1px solid rgba(0,229,160,0.18);
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--accent-green);
    letter-spacing: 0.08em;
  }
  .nav-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent-green);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  .nav-user {
    display: flex; align-items: center; gap: 8px;
    padding: 5px 10px;
    border-radius: var(--radius-sm);
    background: var(--bg-raised);
    border: 1px solid var(--border-mid);
    font-size: 12px;
    color: var(--text-secondary);
  }
  .nav-user strong { color: var(--text-primary); font-weight: 600; }
  .btn-logout {
    padding: 6px 14px;
    border-radius: var(--radius-sm);
    background: transparent;
    border: 1px solid var(--border-mid);
    color: var(--text-secondary);
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition);
    letter-spacing: 0.02em;
  }
  .btn-logout:hover {
    border-color: rgba(255,92,122,0.4);
    color: #FF5C7A;
    background: rgba(255,92,122,0.05);
  }

  /* PAGE SHELL */
  .page-shell {
    max-width: 1440px;
    margin: 0 auto;
    padding: 32px 32px 0;
  }

  /* PAGE HEADER */
  .page-header {
    margin-bottom: 28px;
  }
  .page-eyebrow {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent-blue);
    margin-bottom: 10px;
  }
  .page-title {
    font-family: var(--font-display);
    font-size: 36px;
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .page-title span {
    background: linear-gradient(90deg, var(--accent-blue), var(--accent-cyan));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* TOAST */
  .toast {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px;
    border-radius: var(--radius-md);
    background: var(--bg-raised);
    border: 1px solid var(--border-mid);
    border-left: 3px solid var(--accent-blue);
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 20px;
    animation: slideIn 0.2s ease;
  }
  @keyframes slideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
  .toast-edit {
    border-left-color: #FFB547;
    background: rgba(255,181,71,0.04);
  }

  /* STAT GRID */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }
  @media (max-width: 1100px) { .stat-grid { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 600px) { .stat-grid { grid-template-columns: repeat(2,1fr); } }
  .stat-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-dim);
    border-radius: var(--radius-lg);
    padding: 18px 18px 16px;
    position: relative;
    overflow: hidden;
    transition: border-color var(--transition), box-shadow var(--transition);
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
  }
  .stat-card:hover {
    border-color: var(--border-mid);
    box-shadow: var(--shadow-card);
  }
  .stat-label {
    font-family: var(--font-mono);
    font-size: 9.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 10px;
  }
  .stat-value {
    font-family: var(--font-display);
    font-size: 30px;
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1;
    margin-bottom: 6px;
  }
  .stat-sub {
    font-size: 11px;
    color: var(--text-muted);
  }
  .stat-accent { color: var(--accent-blue); }
  .stat-accent-green { color: var(--accent-green); }

  /* MAIN GRID */
  .main-grid {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 20px;
    align-items: start;
  }
  @media (max-width: 960px) { .main-grid { grid-template-columns: 1fr; } }

  /* PANEL */
  .panel {
    background: var(--bg-surface);
    border: 1px solid var(--border-dim);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-card);
    overflow: hidden;
  }
  .panel-header {
    padding: 20px 22px 16px;
    border-bottom: 1px solid var(--border-dim);
    background: var(--bg-raised);
  }
  .panel-title {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 3px;
  }
  .panel-sub {
    font-size: 12px;
    color: var(--text-muted);
  }
  .panel-body { padding: 20px 22px; }

  /* FORM */
  .form-group { margin-bottom: 14px; }
  .form-label {
    display: block;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 6px;
  }
  .form-input {
    width: 100%;
    padding: 10px 13px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-mid);
    background: var(--bg-raised);
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 13px;
    outline: none;
    transition: border-color var(--transition), box-shadow var(--transition);
    appearance: none;
    -webkit-appearance: none;
  }
  .form-input::placeholder { color: var(--text-muted); }
  .form-input:focus {
    border-color: rgba(0,120,255,0.5);
    box-shadow: 0 0 0 3px rgba(0,120,255,0.1);
  }
  .form-input option { background: var(--bg-overlay); color: var(--text-primary); }

  .btn-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 18px;
  }
  .btn-primary {
    padding: 11px 16px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--accent-blue), #005CC5);
    border: none;
    color: #fff;
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: opacity var(--transition), transform var(--transition);
    box-shadow: 0 4px 20px rgba(0,120,255,0.3);
  }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary.update {
    background: linear-gradient(135deg, #FFB547, #E09020);
    box-shadow: 0 4px 20px rgba(255,181,71,0.25);
  }
  .btn-ghost {
    padding: 11px 16px;
    border-radius: var(--radius-md);
    background: transparent;
    border: 1px solid var(--border-mid);
    color: var(--text-secondary);
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition);
  }
  .btn-ghost:hover { background: var(--bg-raised); color: var(--text-primary); }

  /* DIRECTORY PANEL */
  .dir-toolbar {
    padding: 16px 22px;
    border-bottom: 1px solid var(--border-dim);
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: var(--bg-raised);
  }
  .dir-search-row {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: 10px;
    align-items: center;
  }
  .search-wrap {
    position: relative;
  }
  .search-icon {
    position: absolute;
    left: 11px; top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    color: var(--text-muted);
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    padding: 9px 13px 9px 32px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-mid);
    background: var(--bg-surface);
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 13px;
    outline: none;
    transition: border-color var(--transition);
  }
  .search-input::placeholder { color: var(--text-muted); }
  .search-input:focus { border-color: rgba(0,120,255,0.4); }

  .filter-select {
    padding: 8px 12px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-mid);
    background: var(--bg-surface);
    color: var(--text-secondary);
    font-family: var(--font-body);
    font-size: 12px;
    outline: none;
    cursor: pointer;
    transition: border-color var(--transition);
    min-width: 110px;
    appearance: none; -webkit-appearance: none;
  }
  .filter-select:focus { border-color: rgba(0,120,255,0.4); }
  .filter-select option { background: var(--bg-overlay); }

  .btn-reset {
    padding: 8px 14px;
    border-radius: var(--radius-md);
    background: transparent;
    border: 1px solid var(--border-dim);
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all var(--transition);
    white-space: nowrap;
  }
  .btn-reset:hover { border-color: var(--border-mid); color: var(--text-secondary); }

  .pills-row {
    display: flex; gap: 8px; flex-wrap: wrap;
  }
  .pill {
    padding: 4px 10px;
    border-radius: 999px;
    background: var(--bg-overlay);
    border: 1px solid var(--border-dim);
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 0.06em;
  }
  .pill-blue { border-color: rgba(0,120,255,0.25); color: var(--accent-blue); background: rgba(0,120,255,0.06); }

  /* TABLE */
  .table-wrap { overflow-x: auto; }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  thead tr {
    border-bottom: 1px solid var(--border-dim);
  }
  th {
    padding: 11px 16px;
    text-align: left;
    font-family: var(--font-mono);
    font-size: 9.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
    white-space: nowrap;
    background: var(--bg-raised);
  }
  td {
    padding: 13px 16px;
    font-size: 13px;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border-dim);
    vertical-align: middle;
  }
  tr:last-child td { border-bottom: none; }
  tbody tr { transition: background var(--transition); }
  tbody tr:hover td { background: rgba(255,255,255,0.018); }
  .td-name {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 13px;
    display: flex; align-items: center; gap: 8px;
  }
  .type-icon {
    font-size: 15px;
    opacity: 0.75;
  }
  .td-mono {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--text-muted);
  }
  .status-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid;
    white-space: nowrap;
  }
  .status-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .td-actions { display: flex; gap: 6px; align-items: center; }
  .btn-edit {
    padding: 5px 12px;
    border-radius: var(--radius-sm);
    background: rgba(0,120,255,0.08);
    border: 1px solid rgba(0,120,255,0.22);
    color: var(--accent-blue);
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition);
  }
  .btn-edit:hover { background: rgba(0,120,255,0.15); }
  .btn-del {
    padding: 5px 12px;
    border-radius: var(--radius-sm);
    background: rgba(255,92,122,0.06);
    border: 1px solid rgba(255,92,122,0.2);
    color: #FF5C7A;
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition);
  }
  .btn-del:hover { background: rgba(255,92,122,0.14); }

  .empty-state {
    padding: 52px 0;
    text-align: center;
    color: var(--text-muted);
    font-size: 13px;
  }
  .empty-icon { font-size: 28px; margin-bottom: 12px; opacity: 0.4; }

  /* LOGIN */
  .login-root {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: var(--bg-void);
    background-image: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,120,255,0.09) 0%, transparent 60%);
    padding: 20px;
    font-family: var(--font-body);
    color: var(--text-primary);
  }
  .login-card {
    width: 100%;
    max-width: 400px;
    background: var(--bg-surface);
    border: 1px solid var(--border-mid);
    border-radius: var(--radius-xl);
    padding: 36px 32px;
    box-shadow: var(--shadow-card), var(--shadow-glow);
    position: relative;
    overflow: hidden;
  }
  .login-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,120,255,0.4), var(--accent-cyan), rgba(0,120,255,0.4), transparent);
  }
  .login-logo {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 28px;
  }
  .login-logo-icon {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .login-logo-text {
    font-family: var(--font-display);
    font-size: 17px;
    font-weight: 800;
    color: var(--text-primary);
  }
  .login-logo-text span { color: var(--accent-blue); }
  .login-eyebrow {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent-blue);
    margin-bottom: 8px;
  }
  .login-title {
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 6px;
    letter-spacing: -0.01em;
  }
  .login-desc {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 26px;
    line-height: 1.5;
  }
  .login-btn {
    width: 100%;
    padding: 12px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--accent-blue), #005CC5);
    border: none;
    color: #fff;
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 24px rgba(0,120,255,0.35);
    transition: opacity var(--transition), transform var(--transition);
    margin-top: 8px;
  }
  .login-btn:hover { opacity: 0.92; transform: translateY(-1px); }
  .login-msg {
    margin-top: 14px;
    padding: 10px 13px;
    border-radius: var(--radius-md);
    background: rgba(0,120,255,0.06);
    border: 1px solid rgba(0,120,255,0.18);
    color: #93C5FD;
    font-size: 12.5px;
  }

  /* EDIT MODE ALERT */
  .edit-alert {
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    flex-wrap: wrap;
    padding: 12px 16px;
    border-radius: var(--radius-md);
    background: rgba(255,181,71,0.05);
    border: 1px solid rgba(255,181,71,0.22);
    margin-bottom: 18px;
    font-size: 12.5px;
    color: #FFB547;
  }
  .edit-alert strong { font-weight: 700; color: #FFD47E; }
  .btn-cancel-edit {
    padding: 5px 12px;
    border-radius: var(--radius-sm);
    background: rgba(255,181,71,0.1);
    border: 1px solid rgba(255,181,71,0.25);
    color: #FFB547;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all var(--transition);
  }
  .btn-cancel-edit:hover { background: rgba(255,181,71,0.18); }

  /* DIVIDER IN FORM */
  .form-divider {
    height: 1px;
    background: var(--border-dim);
    margin: 16px 0;
  }

  /* UTILIZATION BAR */
  .util-bar-wrap { margin-top: 8px; }
  .util-bar-bg {
    height: 3px;
    background: var(--bg-overlay);
    border-radius: 2px;
    overflow: hidden;
  }
  .util-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-blue), var(--accent-cyan));
    border-radius: 2px;
    transition: width 0.6s ease;
  }
`;

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({ name: "", type: "", serialNumber: "", assignedTo: "", status: "Active" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");

  const fetchAssets = async () => {
    try {
      const res = await fetch(`${API_URL}/assets`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setAssets(data);
      else setMessage(data.message || "Failed to fetch assets");
    } catch { setMessage("Error fetching assets"); }
  };

  useEffect(() => { if (token) fetchAssets(); }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token); setUser(data.user);
        setMessage("Authentication successful"); setEmail(""); setPassword("");
      } else setMessage(data.message || "Login failed");
    } catch { setMessage("Server error during login"); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("user");
    setToken(""); setUser(null); setAssets([]); setMessage("Session terminated");
  };

  const resetForm = () => {
    setFormData({ name: "", type: "", serialNumber: "", assignedTo: "", status: "Active" });
    setEditingId(null);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/assets/${editingId}` : `${API_URL}/assets`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) { resetForm(); fetchAssets(); setMessage(editingId ? "Asset record updated" : "Asset registered successfully"); }
      else setMessage(data.message || "Operation failed");
    } catch { setMessage("Error saving asset"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently remove this asset from the registry?")) return;
    try {
      const res = await fetch(`${API_URL}/assets/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) { setMessage("Asset removed from registry"); fetchAssets(); }
      else setMessage(data.message || "Delete failed");
    } catch { setMessage("Error deleting asset"); }
  };

  const handleEdit = (asset) => {
    setFormData({ name: asset.name || "", type: asset.type || "", serialNumber: asset.serialNumber || "", assignedTo: asset.assignedTo || "", status: asset.status || "Active" });
    setEditingId(asset._id);
    setMessage("Edit mode active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredAssets = useMemo(() => {
    let r = assets.filter((a) => {
      const q = searchTerm.toLowerCase();
      const matches = a.name?.toLowerCase().includes(q) || a.type?.toLowerCase().includes(q) ||
        a.serialNumber?.toLowerCase().includes(q) || a.assignedTo?.toLowerCase().includes(q) || a.status?.toLowerCase().includes(q);
      return matches && (statusFilter === "All" || a.status === statusFilter) && (typeFilter === "All" || a.type === typeFilter);
    });
    r.sort((a, b) => {
      if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name-desc") return (b.name || "").localeCompare(a.name || "");
      if (sortBy === "status") return (a.status || "").localeCompare(b.status || "");
      if (sortBy === "type") return (a.type || "").localeCompare(b.type || "");
      return 0;
    });
    return r;
  }, [assets, searchTerm, statusFilter, typeFilter, sortBy]);

  const totalAssets = assets.length;
  const activeAssets = assets.filter(a => a.status?.toLowerCase() === "active").length;
  const repairAssets = assets.filter(a => a.status?.toLowerCase() === "in repair").length;
  const unassignedAssets = assets.filter(a => a.status?.toLowerCase() === "unassigned").length;
  const retiredAssets = assets.filter(a => a.status?.toLowerCase() === "retired").length;
  const utilizationRate = totalAssets > 0 ? Math.round((activeAssets / totalAssets) * 100) : 0;

  const getStatusStyle = (status) => {
    const meta = STATUS_META[status?.toLowerCase()] || STATUS_META.unassigned;
    return { color: meta.color, background: meta.bg, borderColor: meta.border, dotColor: meta.dot };
  };

  if (!token) {
    return (
      <>
        <style>{css}</style>
        <div className="login-root">
          <div className="login-card">
            <div className="login-logo">
              <div className="login-logo-icon">⬡</div>
              <div className="login-logo-text">NEXUS<span>IT</span></div>
            </div>
            <div className="login-eyebrow">Secure Access Portal</div>
            <div className="login-title">Asset Control</div>
            <div className="login-desc">Authenticate to access the enterprise IT asset operations platform.</div>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="login-btn">Sign In</button>
            </form>
            {message && <div className="login-msg">{message}</div>}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="ams-root">
        {/* TOP NAV */}
        <nav className="topnav">
          <div className="topnav-brand">
            <div className="brand-icon">⬡</div>
            <div className="brand-name">NEXUS<span>IT</span></div>
          </div>
          <div className="topnav-center">Asset Management Console · v2.6</div>
          <div className="topnav-right">
            <div className="nav-badge">
              <div className="nav-badge-dot"></div>
              SYSTEM ONLINE
            </div>
            <div className="nav-user">
              <span>👤</span>
              <strong>{user?.email}</strong>
              <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>/ {user?.role}</span>
            </div>
            <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
          </div>
        </nav>

        <div className="page-shell">
          {/* PAGE HEADER */}
          <div className="page-header">
            <div className="page-eyebrow">Enterprise IT Operations</div>
            <div className="page-title">Asset <span>Registry</span></div>
          </div>

          {/* TOAST */}
          {message && (
            <div className={`toast${editingId ? " toast-edit" : ""}`}>
              <span style={{ fontSize: "14px" }}>{editingId ? "✏️" : "ℹ️"}</span>
              {message}
            </div>
          )}

          {/* STATS */}
          <div className="stat-grid">
            {[
              { label: "Total Assets", value: totalAssets, sub: "Full inventory" },
              { label: "Active",        value: activeAssets,     sub: "Operational", accent: "accent-green" },
              { label: "In Repair",     value: repairAssets,     sub: "Maintenance" },
              { label: "Unassigned",    value: unassignedAssets, sub: "Available stock" },
              { label: "Retired",       value: retiredAssets,    sub: "Decommissioned" },
              { label: "Utilization",   value: `${utilizationRate}%`, sub: "Currently active", bar: utilizationRate, accent: "accent" },
            ].map(item => (
              <div className="stat-card" key={item.label}>
                <div className="stat-label">{item.label}</div>
                <div className={`stat-value ${item.accent === "accent-green" ? "stat-accent-green" : item.accent === "accent" ? "stat-accent" : ""}`}>
                  {item.value}
                </div>
                <div className="stat-sub">{item.sub}</div>
                {item.bar !== undefined && (
                  <div className="util-bar-wrap">
                    <div className="util-bar-bg">
                      <div className="util-bar-fill" style={{ width: `${item.bar}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="main-grid">
            {/* FORM PANEL */}
            <div>
              {editingId && (
                <div className="edit-alert">
                  <span><strong>Edit Mode</strong> — Modifying existing record</span>
                  <button className="btn-cancel-edit" onClick={resetForm}>Cancel</button>
                </div>
              )}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">{editingId ? "Update Asset Record" : "Register New Asset"}</div>
                  <div className="panel-sub">{editingId ? "Modify fields and confirm to update." : "Capture identity, ownership and status."}</div>
                </div>
                <div className="panel-body">
                  <form onSubmit={handleAddAsset}>
                    <div className="form-group">
                      <label className="form-label">Asset Name</label>
                      <input className="form-input" type="text" name="name" placeholder="e.g. Dell OptiPlex 7090" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Asset Type</label>
                      <select className="form-input" name="type" value={formData.type} onChange={handleChange} required>
                        <option value="">Select type</option>
                        {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Serial Number</label>
                      <input className="form-input" type="text" name="serialNumber" placeholder="e.g. SN-2026-001" value={formData.serialNumber} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Assigned To</label>
                      <input className="form-input" type="text" name="assignedTo" placeholder="e.g. Juan Dela Cruz" value={formData.assignedTo} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Operational Status</label>
                      <select className="form-input" name="status" value={formData.status} onChange={handleChange} required>
                        {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-divider"></div>
                    <div className="btn-row">
                      <button type="submit" className={`btn-primary${editingId ? " update" : ""}`}>
                        {editingId ? "Update Asset" : "Register Asset"}
                      </button>
                      <button type="button" className="btn-ghost" onClick={resetForm}>Clear</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* DIRECTORY PANEL */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">Asset Directory</div>
                <div className="panel-sub">Search, filter, and manage all registered assets.</div>
              </div>
              <div className="dir-toolbar">
                <div className="dir-search-row">
                  <div className="search-wrap">
                    <span className="search-icon">⌕</span>
                    <input className="search-input" type="text" placeholder="Search name, serial, owner, type…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                  <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="All">All Status</option>
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    <option value="All">All Types</option>
                    {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="name-asc">Name A–Z</option>
                    <option value="name-desc">Name Z–A</option>
                    <option value="status">By Status</option>
                    <option value="type">By Type</option>
                  </select>
                </div>
                <div className="pills-row">
                  <div className="pill pill-blue">Showing {filteredAssets.length} of {totalAssets}</div>
                  <div className="pill">Status: {statusFilter}</div>
                  <div className="pill">Type: {typeFilter}</div>
                  <button className="btn-reset" onClick={() => { setSearchTerm(""); setStatusFilter("All"); setTypeFilter("All"); setSortBy("name-asc"); }}>↺ Reset</button>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Serial No.</th>
                      <th>Assigned To</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.length > 0 ? filteredAssets.map(asset => {
                      const s = getStatusStyle(asset.status);
                      return (
                        <tr key={asset._id}>
                          <td>
                            <div className="td-name">
                              <span className="type-icon">{TYPE_ICONS[asset.type] || "📦"}</span>
                              {asset.name}
                            </div>
                          </td>
                          <td>{asset.type}</td>
                          <td><span className="td-mono">{asset.serialNumber || "—"}</span></td>
                          <td>{asset.assignedTo || <span style={{ color: "var(--text-muted)" }}>—</span>}</td>
                          <td>
                            <span className="status-badge" style={{ color: s.color, background: s.background, borderColor: s.borderColor }}>
                              <span className="status-dot" style={{ background: s.dotColor }}></span>
                              {asset.status}
                            </span>
                          </td>
                          <td>
                            <div className="td-actions">
                              <button className="btn-edit" onClick={() => handleEdit(asset)}>Edit</button>
                              <button className="btn-del" onClick={() => handleDelete(asset._id)}>Remove</button>
                            </div>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan="6">
                          <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            No assets match the current filters.
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
    </>
  );
}

export default App;
