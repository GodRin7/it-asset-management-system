import React, { useCallback, useEffect, useMemo, useState } from "react";



const API_URL = process.env.REACT_APP_API_URL;

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
const DEPARTMENT_OPTIONS = [
  "ICT Office",
  "Network Operations",
  "Cybersecurity",
  "Systems Administration",
  "Technical Support",
  "HR",
  "Finance",
  "Procurement",
];

const STATUS_META = {
  active: {
    color: "#00E5A0",
    bg: "rgba(0,229,160,0.08)",
    border: "rgba(0,229,160,0.22)",
    dot: "#00E5A0",
  },
  "in repair": {
    color: "#FFB547",
    bg: "rgba(255,181,71,0.08)",
    border: "rgba(255,181,71,0.22)",
    dot: "#FFB547",
  },
  unassigned: {
    color: "#8B9FC0",
    bg: "rgba(139,159,192,0.08)",
    border: "rgba(139,159,192,0.22)",
    dot: "#8B9FC0",
  },
  retired: {
    color: "#FF5C7A",
    bg: "rgba(255,92,122,0.08)",
    border: "rgba(255,92,122,0.22)",
    dot: "#FF5C7A",
  },
};

const TYPE_ICONS = {
  Desktop: "🖥",
  Laptop: "💻",
  Printer: "🖨",
  Router: "📡",
  Switch: "🔀",
  Monitor: "🖵",
  "Access Point": "📶",
  Server: "🗄",
};

const PAGE_SIZE = 5;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-void: #040507;
    --bg-base: #080B10;
    --bg-surface: #0D1117;
    --bg-raised: #131A24;
    --bg-overlay: #1A2333;
    --border-dim: rgba(255,255,255,0.05);
    --border-mid: rgba(255,255,255,0.09);
    --border-strong: rgba(255,255,255,0.14);
    --accent-blue: #0078FF;
    --accent-cyan: #00C8FF;
    --accent-green: #00E5A0;
    --text-primary: #EDF2FF;
    --text-secondary: #A7B6D1;
    --text-muted: #72829D;
    --text-soft: #51627D;
    --font-display: 'Inter', sans-serif;
    --font-body: 'Inter', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;
    --radius-xl: 22px;
    --shadow-card: 0 1px 3px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.4);
    --shadow-glow: 0 0 40px rgba(0,120,255,0.08);
    --transition: 0.18s cubic-bezier(0.4,0,0.2,1);
}

.theme-light {
    --bg-void: #F4F7FB;
    --bg-base: #EEF3F9;
    --bg-surface: #FFFFFF;
    --bg-raised: #F8FAFD;
    --bg-overlay: #E8EEF7;
    --border-dim: rgba(15,23,42,0.08);
    --border-mid: rgba(15,23,42,0.12);
    --border-strong: rgba(15,23,42,0.18);
    --accent-blue: #0078FF;
    --accent-cyan: #00AEEF;
    --accent-green: #00B67A;
    --text-primary: #0F172A;
    --text-secondary: #334155;
    --text-muted: #64748B;
    --text-soft: #94A3B8;
    --shadow-card: 0 1px 3px rgba(15,23,42,0.08), 0 8px 24px rgba(15,23,42,0.08);
    --shadow-glow: 0 0 30px rgba(0,120,255,0.08);
  }
  }

  html, body { height: 100%; background: var(--bg-void); }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.14); border-radius: 999px; }

  .ams-root {
  transition: background 0.3s ease, color 0.3s ease;
    min-height: 100vh;
    background: var(--bg-void);
    background-image:
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,120,255,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 40% 30% at 85% 75%, rgba(0,200,255,0.035) 0%, transparent 50%);
    font-family: var(--font-body);
    color: var(--text-primary);
    padding: 0 0 60px;
  }

  .topnav {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 58px;
    background: rgba(4,5,7,0.88);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border-dim);
  }

  .topnav-brand,
  .topnav-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-icon {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .brand-name {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.01em;
    color: var(--text-primary);
  }

  .brand-name span { color: var(--accent-blue); }

  .topnav-center {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-soft);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .nav-badge {
    display: flex;
    align-items: center;
    gap: 6px;
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
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-green);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .nav-user {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 10px;
    border-radius: var(--radius-sm);
    background: var(--bg-raised);
    border: 1px solid var(--border-mid);
    font-size: 12px;
    color: var(--text-secondary);
  }

  .nav-user strong { color: var(--text-primary); font-weight: 600; }

  .btn-logout, .tab-btn, .btn-reset, .btn-pagination, .btn-light, .btn-user {
    transition: all var(--transition);
  }

  .btn-logout {
    padding: 6px 14px;
    border-radius: var(--radius-sm);
    background: transparent;
    border: 1px solid var(--border-mid);
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
  }
      .btn-theme {
    padding: 6px 14px;
    border-radius: var(--radius-sm);
    background: transparent;
    border: 1px solid var(--border-mid);
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition);
  }

  .btn-theme:hover {
    border-color: var(--border-strong);
    color: var(--text-primary);
    background: rgba(255,255,255,0.04);
  }

  .btn-logout:hover {
    border-color: rgba(255,92,122,0.4);
    color: #FF5C7A;
    background: rgba(255,92,122,0.05);
  }

  .page-shell {
    max-width: 1480px;
    margin: 0 auto;
    padding: 28px 28px 0;
  }

  .page-header {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 22px;
    flex-wrap: wrap;
  }

  .page-eyebrow {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--accent-blue);
    margin-bottom: 8px;
  }

  .page-title {
    font-family: var(--font-display);
    font-size: 30px;
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1.05;
    letter-spacing: -0.015em;
  }

  .page-title span {
    background: linear-gradient(90deg, var(--accent-blue), var(--accent-cyan));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .page-sub {
    color: var(--text-secondary);
    font-size: 13px;
    margin-top: 10px;
  }

  .page-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 9px 14px;
    border-radius: 999px;
    background: transparent;
    border: 1px solid var(--border-mid);
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }

  .tab-btn.active {
    background: rgba(0,120,255,0.1);
    border-color: rgba(0,120,255,0.22);
    color: #93C5FD;
  }

  .toast-stack {
    display: grid;
    gap: 10px;
    margin-bottom: 18px;
  }

  .toast {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 14px;
    border-radius: var(--radius-md);
    background: var(--bg-raised);
    border: 1px solid var(--border-mid);
    border-left: 3px solid var(--accent-blue);
    font-size: 13px;
    color: var(--text-secondary);
    animation: slideIn 0.2s ease;
  }

  .toast.success { border-left-color: var(--accent-green); }
  .toast.warning { border-left-color: #FFB547; }
  .toast.danger { border-left-color: #FF5C7A; }

  .toast-close {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 16px;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  @media (max-width: 1150px) {
    .stat-grid { grid-template-columns: repeat(3, 1fr); }
  }

  @media (max-width: 700px) {
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
  }

  .stat-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-dim);
    border-radius: var(--radius-lg);
    padding: 18px;
    position: relative;
    overflow: hidden;
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
    color: var(--text-secondary);
  }

  .stat-accent { color: var(--accent-blue); }
  .stat-accent-green { color: var(--accent-green); }

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

  .content-grid {
    display: grid;
    grid-template-columns: 1.15fr 2.1fr 0.95fr;
    gap: 18px;
    align-items: start;
  }

  @media (max-width: 1250px) {
    .content-grid {
      grid-template-columns: 1fr;
    }
  }

  .panel {
    background: var(--bg-surface);
    border: 1px solid var(--border-dim);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-card);
    overflow: hidden;
  }

  .panel-header {
    padding: 18px 20px 14px;
    border-bottom: 1px solid var(--border-dim);
    background: var(--bg-raised);
  }

  .panel-title {
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .panel-sub {
    font-size: 12px;
    color: var(--text-secondary);
  }

  .panel-body { padding: 18px 20px; }

  .form-grid {
    display: grid;
    gap: 12px;
  }

  .form-group { margin-bottom: 2px; }

  .form-label {
    display: block;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 6px;
  }

  .form-input, .search-input, .filter-select, .text-area {
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
  }

  .form-input::placeholder,
  .search-input::placeholder,
  .text-area::placeholder {
    color: var(--text-muted);
  }

  .form-input:focus,
  .search-input:focus,
  .filter-select:focus,
  .text-area:focus {
    border-color: rgba(0,120,255,0.45);
    box-shadow: 0 0 0 3px rgba(0,120,255,0.08);
  }

  .text-area {
    min-height: 90px;
    resize: vertical;
  }

  .form-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .form-divider {
    height: 1px;
    background: var(--border-dim);
    margin: 10px 0 6px;
  }

  .btn-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .btn-primary, .btn-light, .btn-user {
    padding: 11px 14px;
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    border: none;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--accent-blue), #005CC5);
    color: #fff;
    box-shadow: 0 4px 20px rgba(0,120,255,0.28);
  }

  .btn-primary.update {
    background: linear-gradient(135deg, #FFB547, #E09020);
    box-shadow: 0 4px 20px rgba(255,181,71,0.2);
  }

  .btn-light {
    background: transparent;
    border: 1px solid var(--border-mid);
    color: var(--text-secondary);
  }

  .btn-light:hover,
  .btn-user:hover,
  .btn-pagination:hover,
  .btn-reset:hover {
    border-color: var(--border-strong);
    color: var(--text-primary);
    background: rgba(255,255,255,0.03);
  }

  .inline-note {
    padding: 10px 12px;
    border-radius: var(--radius-md);
    background: rgba(255,181,71,0.05);
    border: 1px solid rgba(255,181,71,0.22);
    color: #FFD47E;
    font-size: 12px;
    margin-bottom: 12px;
  }

  .directory-toolbar {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-dim);
    background: var(--bg-raised);
    display: grid;
    gap: 12px;
  }

  .toolbar-row {
    display: grid;
    grid-template-columns: 1.5fr auto auto auto auto;
    gap: 10px;
    align-items: center;
  }

  @media (max-width: 900px) {
    .toolbar-row {
      grid-template-columns: 1fr;
    }
  }

  .search-wrap {
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    color: var(--text-muted);
    pointer-events: none;
  }

  .search-input {
    padding-left: 32px;
    background: var(--bg-surface);
  }

  .pills-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }

  .pill {
    padding: 4px 10px;
    border-radius: 999px;
    background: var(--bg-overlay);
    border: 1px solid var(--border-dim);
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-secondary);
    letter-spacing: 0.06em;
  }

  .pill-blue {
    border-color: rgba(0,120,255,0.25);
    color: var(--accent-blue);
    background: rgba(0,120,255,0.06);
  }

  .btn-reset, .btn-pagination, .btn-user {
    padding: 8px 12px;
    border-radius: var(--radius-md);
    background: transparent;
    border: 1px solid var(--border-dim);
    color: var(--text-secondary);
    font-size: 12px;
    cursor: pointer;
  }

  .table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead tr {
    border-bottom: 1px solid var(--border-dim);
  }

  th {
    padding: 11px 14px;
    text-align: left;
    font-family: var(--font-mono);
    font-size: 9.5px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-secondary);
    white-space: nowrap;
    background: var(--bg-raised);
  }

  td {
    padding: 13px 14px;
    font-size: 13px;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border-dim);
    vertical-align: middle;
  }

  tbody tr:hover td {
    background: rgba(255,255,255,0.018);
  }

  .td-name {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .type-icon {
    font-size: 15px;
    opacity: 0.8;
  }

  .td-mono {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--text-secondary);
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
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

  .status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .td-actions {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .btn-edit, .btn-del, .btn-view {
    padding: 5px 10px;
    border-radius: var(--radius-sm);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition);
  }

  .btn-view {
    background: rgba(148,163,184,0.08);
    border: 1px solid rgba(148,163,184,0.22);
    color: #CBD5E1;
  }

  .btn-edit {
    background: rgba(0,120,255,0.08);
    border: 1px solid rgba(0,120,255,0.22);
    color: var(--accent-blue);
  }

  .btn-del {
    background: rgba(255,92,122,0.06);
    border: 1px solid rgba(255,92,122,0.2);
    color: #FF5C7A;
  }

  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    border-top: 1px solid var(--border-dim);
    background: var(--bg-raised);
    flex-wrap: wrap;
  }

  .pagination-info {
    color: var(--text-secondary);
    font-size: 12px;
  }

  .pagination-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .btn-pagination:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .empty-state {
    padding: 52px 0;
    text-align: center;
    color: var(--text-secondary);
    font-size: 13px;
  }

  .empty-icon {
    font-size: 28px;
    margin-bottom: 12px;
    opacity: 0.5;
  }

  .chart-grid {
    display: grid;
    gap: 14px;
  }

  .mini-chart-card {
    background: var(--bg-raised);
    border: 1px solid var(--border-dim);
    border-radius: var(--radius-lg);
    padding: 14px;
  }

  .mini-chart-title {
    font-size: 12px;
    color: var(--text-primary);
    font-weight: 700;
    margin-bottom: 12px;
  }

  .chart-bars {
    display: grid;
    gap: 10px;
  }

  .chart-row {
    display: grid;
    gap: 6px;
  }

  .chart-label-line {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--text-secondary);
  }

  .chart-bar-bg {
    height: 8px;
    border-radius: 999px;
    background: var(--bg-overlay);
    overflow: hidden;
  }

  .chart-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--accent-blue), var(--accent-cyan));
  }

  .activity-list {
    display: grid;
    gap: 12px;
  }

  .activity-item {
    display: grid;
    gap: 4px;
    padding: 12px;
    background: var(--bg-raised);
    border: 1px solid var(--border-dim);
    border-radius: var(--radius-md);
  }

  .activity-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .activity-meta {
    font-size: 11px;
    color: var(--text-secondary);
  }

  .activity-time {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
  }

  .drawer-backdrop, .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.56);
    backdrop-filter: blur(5px);
    z-index: 200;
  }

  .details-drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: 420px;
    max-width: 100%;
    height: 100vh;
    background: var(--bg-surface);
    border-left: 1px solid var(--border-mid);
    box-shadow: -10px 0 40px rgba(0,0,0,0.45);
    z-index: 210;
    display: flex;
    flex-direction: column;
  }

  .drawer-header {
    padding: 18px 20px;
    border-bottom: 1px solid var(--border-dim);
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: start;
    background: var(--bg-raised);
  }

  .drawer-title {
    font-size: 18px;
    font-weight: 800;
    color: var(--text-primary);
  }

  .drawer-sub {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 6px;
  }

  .drawer-close {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 20px;
    cursor: pointer;
  }

  .drawer-body {
    padding: 18px 20px 28px;
    overflow-y: auto;
    display: grid;
    gap: 16px;
  }

  .detail-grid {
    display: grid;
    gap: 12px;
  }

  .detail-item {
    padding: 12px;
    border-radius: var(--radius-md);
    background: var(--bg-raised);
    border: 1px solid var(--border-dim);
  }

  .detail-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 6px;
  }

  .detail-value {
    color: var(--text-primary);
    font-size: 13px;
    font-weight: 600;
    word-break: break-word;
  }

  .modal-shell {
    position: fixed;
    inset: 0;
    z-index: 220;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .modal-card {
    width: 100%;
    max-width: 420px;
    background: var(--bg-surface);
    border: 1px solid var(--border-mid);
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-card);
  }

  .modal-header {
    padding: 16px 18px;
    background: var(--bg-raised);
    border-bottom: 1px solid var(--border-dim);
  }

  .modal-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .modal-body {
    padding: 18px;
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 1.6;
  }

  .modal-actions {
    padding: 0 18px 18px;
    display: flex;
    gap: 10px;
    justify-content: end;
  }

  .login-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-void);
    background-image: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,120,255,0.09) 0%, transparent 60%);
    padding: 20px;
    font-family: var(--font-body);
    color: var(--text-primary);
  }

  .login-card {
    width: 100%;
    max-width: 410px;
    background: var(--bg-surface);
    border: 1px solid var(--border-mid);
    border-radius: var(--radius-xl);
    padding: 34px 30px;
    box-shadow: var(--shadow-card), var(--shadow-glow);
  }

  .login-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 26px;
  }

  .login-logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
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
  }

  .login-desc {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 24px;
    line-height: 1.5;
  }

  .login-btn {
    width: 100%;
    padding: 12px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--accent-blue), #005CC5);
    border: none;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 24px rgba(0,120,255,0.35);
    margin-top: 8px;
  }

  .login-msg {
    margin-top: 14px;
    padding: 10px 13px;
    border-radius: var(--radius-md);
    background: rgba(0,120,255,0.06);
    border: 1px solid rgba(0,120,255,0.18);
    color: #93C5FD;
    font-size: 12.5px;
  }

  @media (max-width: 900px) {
    .topnav-center { display: none; }
    .page-shell { padding: 20px 16px 0; }
    .topnav { padding: 0 14px; }
  }
    @media (max-width: 768px) {
  .topnav {
    height: auto;
    padding: 10px 12px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .topnav-right {
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .page-title {
    font-size: 24px;
  }

  .content-grid {
    grid-template-columns: 1fr !important;
  }

  .form-two-col,
  .btn-row {
    grid-template-columns: 1fr;
  }

  .toolbar-row {
    grid-template-columns: 1fr;
  }

  .stat-grid {
    grid-template-columns: 1fr 1fr;
  }

  .details-drawer {
    width: 100%;
  }

  th, td {
    font-size: 12px;
    padding: 10px;
  }

  .td-actions {
    flex-wrap: wrap;
  }

  .btn-edit, .btn-del, .btn-view {
    width: 100%;
    text-align: center;
  }
}
  @media (max-width: 480px) {
  .brand-name,
  .topnav-center {
    display: none;
  }

  .page-title {
    font-size: 20px;
  }

  .stat-grid {
    grid-template-columns: 1fr;
  }

  .login-card {
    padding: 24px 18px;
  }
}
`;

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
const [user, setUser] = useState(
  JSON.parse(localStorage.getItem("user")) || null
);


const [loginLoading, setLoginLoading] = useState(false);
const [assetLoading, setAssetLoading] = useState(false);
const [userLoading, setUserLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
  localStorage.setItem("theme", theme);
}, [theme]);

  const [assets, setAssets] = useState([]);
  const [activeView, setActiveView] = useState("assets");
const [activityLogs, setActivityLogs] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    serialNumber: "",
    assignedTo: "",
    department: "",
    assetTag: "",
    status: "Active",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    text: "",
    onConfirm: null,
  });

  const [toasts, setToasts] = useState([]);
  

 const [users, setUsers] = useState([]);

  const [userForm, setUserForm] = useState({
  name: "",
  email: "",
  password: "",
  role: "staff",
  department: "ICT Office",
  status: "active",
});

  const pushToast = (text, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };


  const generateAssetTag = useCallback(() => {
  const next = assets.length + 1;
  return `NXS-${String(next).padStart(4, "0")}`;
}, [assets.length]);
  const formatActivityTitle = (action) => {
  switch (action) {
    case "CREATE_ASSET":
      return "Asset registered";
    case "UPDATE_ASSET":
      return "Asset updated";
    case "DELETE_ASSET":
      return "Asset removed";
    default:
      return action;
      
  }
};
const fetchActivityLogs = useCallback(async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/activity-logs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
if (res.status === 401) {
  handleUnauthorized();
  return;
}
    if (!res.ok) {
      throw new Error("Failed to fetch activity logs");
    }

    const data = await res.json();
    setActivityLogs(data);
  } catch (error) {
    console.error("Failed to fetch activity logs:", error);
  }
}, []);
  const fetchAssets = useCallback(async () => {
  try {
    const res = await fetch(`${API_URL}/assets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
if (res.status === 401) {
  handleUnauthorized();
  return;
}
    const data = await res.json();

    if (res.ok) {
      setAssets(
        data.map((asset, index) => ({
          ...asset,
          assetTag: asset.assetTag || `NXS-${String(index + 1).padStart(4, "0")}`,
          department: asset.department || "ICT Office",
          notes: asset.notes || "",
        }))
      );
    } else {
      pushToast(data.message || "Failed to fetch assets", "danger");
    }
  } catch {
    pushToast("Error fetching assets", "danger");
  }
}, [token]);
  const fetchUsers = useCallback(async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
if (res.status === 401) {
  handleUnauthorized();
  return;
}
    if (!res.ok) throw new Error("Failed to fetch users");

    const data = await res.json();
    setUsers(data);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}, []);

useEffect(() => {
  fetchAssets();
  fetchActivityLogs();
  fetchUsers();
}, [fetchAssets, fetchActivityLogs, fetchUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, departmentFilter, sortBy, activeView]);

  const handleLogin = async (e) => {
    e.preventDefault();
setLoginLoading(true);

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
        setToken(data.token);
        setUser(data.user);
        setEmail("");
        setPassword("");
        pushToast("Authentication successful", "success");
      } else {
        pushToast(data.message || "Login failed", "danger");
      }
    } catch {
  pushToast("Server error during login", "danger");
} finally {
  setLoginLoading(false);
}
  };

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setToken("");
  setUser(null);
  setAssets([]);
  setSelectedAsset(null);
};

const handleUnauthorized = () => {
  pushToast("Session expired. Please sign in again.", "warning");
  handleLogout();
};

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      serialNumber: "",
      assignedTo: "",
      department: "",
      assetTag: generateAssetTag(),
      status: "Active",
      notes: "",
    });
    setEditingId(null);
  };

useEffect(() => {
  if (token && !editingId && !formData.assetTag) {
    setFormData((prev) => ({ ...prev, assetTag: generateAssetTag() }));
  }
}, [assets.length, token, editingId, formData.assetTag, generateAssetTag]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
setAssetLoading(true);
    try {
      const payload = {
        ...formData,
        assetTag: formData.assetTag || generateAssetTag(),
      };

      const url = editingId
        ? `${API_URL}/assets/${editingId}`
        : `${API_URL}/assets`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
if (res.status === 401) {
  handleUnauthorized();
  return;
}
      const data = await res.json();

      if (res.ok) {
        
        pushToast(
          editingId
            ? "Asset record updated successfully"
            : "Asset registered successfully",
          "success"
        );
       
        resetForm();
        fetchAssets();
        fetchActivityLogs();
      } else {
        pushToast(data.message || "Operation failed", "danger");
      }
    } catch (error) {
  console.error("Error saving asset:", error);
  pushToast("Error saving asset", "danger");
} finally {
  setAssetLoading(false);
}
  };

  const openDeleteConfirm = (asset) => {
    setConfirmState({
      open: true,
      title: "Remove asset record",
      text: `Permanently remove ${asset.name} (${asset.assetTag || "no tag"}) from the registry?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/assets/${asset._id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
if (res.status === 401) {
  handleUnauthorized();
  return;
}
          const data = await res.json();

          if (res.ok) {
            pushToast("Asset removed from registry", "warning");
            setSelectedAsset((prev) =>
              prev?._id === asset._id ? null : prev
            );
            fetchAssets();
            fetchActivityLogs();
          } else {
            pushToast(data.message || "Delete failed", "danger");
          }
        } catch {
          pushToast("Error deleting asset", "danger");
        } finally {
          setConfirmState({ open: false, title: "", text: "", onConfirm: null });
        }
      },
    });
  };

  const handleEdit = (asset) => {
    setActiveView("assets");
    setFormData({
      name: asset.name || "",
      type: asset.type || "",
      serialNumber: asset.serialNumber || "",
      assignedTo: asset.assignedTo || "",
      department: asset.department || "",
      assetTag: asset.assetTag || "",
      status: asset.status || "Active",
      notes: asset.notes || "",
    });
    setEditingId(asset._id);
    pushToast("Edit mode active", "warning");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUserChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

   const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role,
        department: userForm.department,
        status: userForm.status,
      }),
    });
if (res.status === 401) {
  handleUnauthorized();
  return;
}
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to create user");
    }

    pushToast("User created successfully", "success");

    setUserForm({
      name: "",
      email: "",
      password: "",
      role: "staff",
      department: "ICT Office",
      status: "active",
    });

    fetchUsers();
  } catch (error) {
    console.error(error);
    pushToast(error.message, "danger");
  }
};

  const filteredAssets = useMemo(() => {
    let result = assets.filter((a) => {
      const q = searchTerm.toLowerCase();

      const matchesSearch =
        a.name?.toLowerCase().includes(q) ||
        a.type?.toLowerCase().includes(q) ||
        a.serialNumber?.toLowerCase().includes(q) ||
        a.assignedTo?.toLowerCase().includes(q) ||
        a.status?.toLowerCase().includes(q) ||
        a.department?.toLowerCase().includes(q) ||
        a.assetTag?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" || a.status === statusFilter;

      const matchesType = typeFilter === "All" || a.type === typeFilter;

      const matchesDept =
        departmentFilter === "All" || a.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesType && matchesDept;
    });

    result.sort((a, b) => {
      if (sortBy === "name-asc")
        return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name-desc")
        return (b.name || "").localeCompare(a.name || "");
      if (sortBy === "status")
        return (a.status || "").localeCompare(b.status || "");
      if (sortBy === "type")
        return (a.type || "").localeCompare(b.type || "");
      if (sortBy === "department")
        return (a.department || "").localeCompare(b.department || "");
      return 0;
    });

    return result;
  }, [assets, searchTerm, statusFilter, typeFilter, departmentFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / PAGE_SIZE));
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalAssets = assets.length;
  const activeAssets = assets.filter(
    (a) => a.status?.toLowerCase() === "active"
  ).length;
  const repairAssets = assets.filter(
    (a) => a.status?.toLowerCase() === "in repair"
  ).length;
  const unassignedAssets = assets.filter(
    (a) => a.status?.toLowerCase() === "unassigned"
  ).length;
  const retiredAssets = assets.filter(
    (a) => a.status?.toLowerCase() === "retired"
  ).length;
  const utilizationRate =
    totalAssets > 0 ? Math.round((activeAssets / totalAssets) * 100) : 0;

  const departmentBreakdown = DEPARTMENT_OPTIONS.map((dept) => ({
    label: dept,
    value: assets.filter((a) => a.department === dept).length,
  })).filter((item) => item.value > 0);

  const statusBreakdown = STATUS_OPTIONS.map((status) => ({
    label: status,
    value: assets.filter((a) => a.status === status).length,
  }));

  const maxDeptValue = Math.max(...departmentBreakdown.map((d) => d.value), 1);
  const maxStatusValue = Math.max(...statusBreakdown.map((d) => d.value), 1);

  const getStatusStyle = (status) => {
    const meta = STATUS_META[status?.toLowerCase()] || STATUS_META.unassigned;
    return {
      color: meta.color,
      background: meta.bg,
      borderColor: meta.border,
      dotColor: meta.dot,
    };
  };

  if (!token) {
    return (
      <>
        <style>{css}</style>
        <div className="login-root">
          <div className="login-card">
            <div className="login-logo">
              <div className="login-logo-icon">⬡</div>
              <div className="login-logo-text">
                NEXUS<span>IT</span>
              </div>
            </div>
            <div className="login-eyebrow">Secure Access Portal</div>
            <div className="login-title">Asset Control</div>
            <div className="login-desc">
              Authenticate to access the enterprise IT asset operations platform.
            </div>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  disabled={loginLoading}
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  type="password"
                  disabled={loginLoading}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
  type="submit"
  className="login-btn"
  disabled={loginLoading}
>
  {loginLoading ? "Signing in..." : "Sign In"}
</button>
                
            </form>
            {toasts.length > 0 && (
              <div className="login-msg">{toasts[toasts.length - 1].text}</div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className={`ams-root ${theme === "light" ? "theme-light" : "theme-dark"}`}>
        <nav className="topnav">
          <div className="topnav-brand">
            <div className="brand-icon">⬡</div>
            <div className="brand-name">
              NEXUS<span>IT</span>
            </div>
          </div>

          <div className="topnav-center">Asset Management Console · v3.1</div>

          <div className="topnav-right">
            <div className="nav-badge">
              <div className="nav-badge-dot"></div>
              SYSTEM ONLINE
            </div>
            <div className="nav-user">
              <span>👤</span>
              <strong>{user?.email}</strong>
              <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                / {user?.role}
              </span>
              </div>
              
              <button
           className="btn-theme"
  onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
>
  {theme === "dark" ? "☀ Light" : "🌙 Dark"}
</button>
            <button className="btn-logout" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </nav>

        <div className="page-shell">
          <div className="page-header">
            <div>
              <div className="page-eyebrow">Enterprise IT Operations</div>
              <div className="page-title">
                Asset <span>Registry</span>
              </div>
              <div className="page-sub">
                Manage lifecycle, ownership, and operational state across your enterprise inventory.
              </div>
            </div>

            <div className="page-tabs">
              <button
                className={`tab-btn ${activeView === "assets" ? "active" : ""}`}
                onClick={() => setActiveView("assets")}
              >
                Asset Operations
              </button>
              <button
                className={`tab-btn ${activeView === "users" ? "active" : ""}`}
                onClick={() => setActiveView("users")}
              >
                User Management
              </button>
            </div>
          </div>

          {toasts.length > 0 && (
            <div className="toast-stack">
              {toasts.slice(-2).map((toast) => (
                <div key={toast.id} className={`toast ${toast.type}`}>
                  <span>{toast.text}</span>
                  <button
                    className="toast-close"
                    onClick={() =>
                      setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="stat-grid">
            {[
              { label: "Total Assets", value: totalAssets, sub: "Full inventory" },
              {
                label: "Active",
                value: activeAssets,
                sub: "Operational",
                accent: "accent-green",
              },
              { label: "In Repair", value: repairAssets, sub: "Maintenance" },
              { label: "Unassigned", value: unassignedAssets, sub: "Available stock" },
              { label: "Retired", value: retiredAssets, sub: "Decommissioned" },
              {
                label: "Utilization",
                value: `${utilizationRate}%`,
                sub: "Currently active",
                bar: utilizationRate,
                accent: "accent",
              },
            ].map((item) => (
              <div className="stat-card" key={item.label}>
                <div className="stat-label">{item.label}</div>
                <div
                  className={`stat-value ${
                    item.accent === "accent-green"
                      ? "stat-accent-green"
                      : item.accent === "accent"
                      ? "stat-accent"
                      : ""
                  }`}
                >
                  {item.value}
                </div>
                <div className="stat-sub">{item.sub}</div>
                {item.bar !== undefined && (
                  <div className="util-bar-wrap">
                    <div className="util-bar-bg">
                      <div
                        className="util-bar-fill"
                        style={{ width: `${item.bar}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {activeView === "assets" ? (
            <div className="content-grid">
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">
                    {editingId ? "Update Asset Record" : "Register New Asset"}
                  </div>
                  <div className="panel-sub">
                    {editingId
                      ? "Modify the selected asset and confirm changes."
                      : "Capture identity, ownership, classification, and status."}
                  </div>
                </div>

                <div className="panel-body">
                  {editingId && (
                    <div className="inline-note">
                      Edit mode is active. Updating an existing asset record.
                    </div>
                  )}

                  <form onSubmit={handleAddAsset} className="form-grid">
                    <div className="form-two-col">
                      <div className="form-group">
                        <label className="form-label">Asset Tag</label>
                        <input
                          className="form-input"
                          type="text"
                          name="assetTag"
                          placeholder="e.g. NXS-0001"
                          value={formData.assetTag}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                          className="form-input"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          required
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Asset Name</label>
                      <input
                        className="form-input"
                        type="text"
                        name="name"
                        placeholder="e.g. Dell OptiPlex 7090"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-two-col">
                      <div className="form-group">
                        <label className="form-label">Asset Type</label>
                        <select
                          className="form-input"
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select type</option>
                          {TYPE_OPTIONS.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Department</label>
                        <select
                          className="form-input"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                        >
                          <option value="">Select department</option>
                          {DEPARTMENT_OPTIONS.map((d) => (
                            <option key={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-two-col">
                      <div className="form-group">
                        <label className="form-label">Serial Number</label>
                        <input
                          className="form-input"
                          type="text"
                          name="serialNumber"
                          placeholder="e.g. SN-2026-001"
                          value={formData.serialNumber}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Assigned To</label>
                        <input
                          className="form-input"
                          type="text"
                          name="assignedTo"
                          placeholder="e.g. Juan Dela Cruz"
                          value={formData.assignedTo}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Notes</label>
                      <textarea
                        className="text-area"
                        name="notes"
                        placeholder="Optional operational notes, maintenance notes, or handover remarks..."
                        value={formData.notes}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-divider"></div>

                    <div className="btn-row">
                      <button
  type="submit"
  className={`btn-primary ${editingId ? "update" : ""}`}
  disabled={assetLoading}
>
  {assetLoading
    ? "Saving..."
    : editingId
    ? "Update Asset"
    : "Register Asset"}
</button>
                      <button
                        type="button"
                        className="btn-light"
                        onClick={resetForm}
                      >
                        Clear
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">Asset Directory</div>
                  <div className="panel-sub">
                    Search, filter, review, and manage registered assets.
                  </div>
                </div>

                <div className="directory-toolbar">
                  <div className="toolbar-row">
                    <div className="search-wrap">
                      <span className="search-icon">⌕</span>
                      <input
                        className="search-input"
                        type="text"
                        placeholder="Search asset tag, name, serial, owner, department, type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <select
                      className="filter-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Status</option>
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>

                    <select
                      className="filter-select"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="All">All Types</option>
                      {TYPE_OPTIONS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>

                    <select
                      className="filter-select"
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                      <option value="All">All Departments</option>
                      {DEPARTMENT_OPTIONS.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>

                    <select
                      className="filter-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name-asc">Name A-Z</option>
                      <option value="name-desc">Name Z-A</option>
                      <option value="status">By Status</option>
                      <option value="type">By Type</option>
                      <option value="department">By Department</option>
                    </select>
                  </div>

                  <div className="pills-row">
                    <div className="pill pill-blue">
                      Showing {filteredAssets.length} of {totalAssets}
                    </div>
                    <div className="pill">Status: {statusFilter}</div>
                    <div className="pill">Type: {typeFilter}</div>
                    <div className="pill">Dept: {departmentFilter}</div>
                    <button
                      className="btn-reset"
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("All");
                        setTypeFilter("All");
                        setDepartmentFilter("All");
                        setSortBy("name-asc");
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Asset Tag</th>
                        <th>Type</th>
                        <th>Serial No.</th>
                        <th>Assigned To</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAssets.length > 0 ? (
                        paginatedAssets.map((asset) => {
                          const s = getStatusStyle(asset.status);
                          return (
                            <tr key={asset._id}>
                              <td>
                                <div className="td-name">
                                  <span className="type-icon">
                                    {TYPE_ICONS[asset.type] || "📦"}
                                  </span>
                                  {asset.name}
                                </div>
                              </td>
                              <td>
                                <span className="td-mono">
                                  {asset.assetTag || "—"}
                                </span>
                              </td>
                              <td>{asset.type}</td>
                              <td>
                                <span className="td-mono">
                                  {asset.serialNumber || "—"}
                                </span>
                              </td>
                              <td>{asset.assignedTo || "—"}</td>
                              <td>{asset.department || "—"}</td>
                              <td>
                                <span
                                  className="status-badge"
                                  style={{
                                    color: s.color,
                                    background: s.background,
                                    borderColor: s.borderColor,
                                  }}
                                >
                                  <span
                                    className="status-dot"
                                    style={{ background: s.dotColor }}
                                  ></span>
                                  {asset.status}
                                </span>
                              </td>
                              <td>
                                <div className="td-actions">
                                  <button
                                    className="btn-view"
                                    onClick={() => setSelectedAsset(asset)}
                                  >
                                    View
                                  </button>
                                  <button
                                    className="btn-edit"
                                    onClick={() => handleEdit(asset)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn-del"
                                    onClick={() => openDeleteConfirm(asset)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="8">
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

                <div className="pagination">
                  <div className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="pagination-actions">
                    <button
                      className="btn-pagination"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>
                    <button
                      className="btn-pagination"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gap: "18px" }}>
                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">Dashboard Analytics</div>
                    <div className="panel-sub">
                      Quick operational visibility across asset groups.
                    </div>
                  </div>
                  <div className="panel-body">
                    <div className="chart-grid">
                      <div className="mini-chart-card">
                        <div className="mini-chart-title">Status Distribution</div>
                        <div className="chart-bars">
                          {statusBreakdown.map((item) => (
                            <div className="chart-row" key={item.label}>
                              <div className="chart-label-line">
                                <span>{item.label}</span>
                                <span>{item.value}</span>
                              </div>
                              <div className="chart-bar-bg">
                                <div
                                  className="chart-bar-fill"
                                  style={{
                                    width: `${(item.value / maxStatusValue) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mini-chart-card">
                        <div className="mini-chart-title">Department Allocation</div>
                        <div className="chart-bars">
                          {departmentBreakdown.length > 0 ? (
                            departmentBreakdown.map((item) => (
                              <div className="chart-row" key={item.label}>
                                <div className="chart-label-line">
                                  <span>{item.label}</span>
                                  <span>{item.value}</span>
                                </div>
                                <div className="chart-bar-bg">
                                  <div
                                    className="chart-bar-fill"
                                    style={{
                                      width: `${(item.value / maxDeptValue) * 100}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="empty-state" style={{ padding: "10px 0 0" }}>
                              No department data yet.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">Recent Activity</div>
                    <div className="panel-sub">
                      Latest asset actions recorded by the system.
                    </div>
                  </div>
                  <div className="panel-body">
                    <div className="activity-list">
                      {activityLogs.length > 0 ? (
                        activityLogs.slice(0, 5).map((item) => (
                          <div className="activity-item" key={item._id}>
                            <div className="activity-title">{formatActivityTitle(item.action)}</div>
                            <div className="activity-meta">{item.details}</div>
                            <div className="activity-time">
                             {new Date(item.createdAt).toLocaleString()}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-state" style={{ padding: "10px 0 0" }}>
                          No recent activity yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="content-grid" style={{ gridTemplateColumns: "1fr 2fr 1fr" }}>
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">Create User Profile</div>
                  <div className="panel-sub">
                    Admin-side user panel preview.
                  </div>
                </div>
                <div className="panel-body">
                  <form onSubmit={handleCreateUser} className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        className="form-input"
                        name="name"
                        value={userForm.name}
                        onChange={handleUserChange}
                        placeholder="e.g. Juan Dela Cruz"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <div className="form-group">
  <label className="form-label">Password</label>
  <input
    className="form-input"
    name="password"
    type="password"
    value={userForm.password}
    onChange={handleUserChange}
    placeholder="Enter temporary password"
    required
  />
</div>
                      <input
                        className="form-input"
                        name="email"
                        type="email"
                        value={userForm.email}
                        onChange={handleUserChange}
                        placeholder="e.g. staff@nexusit.local"
                        required
                      />
                    </div>
                    <div className="form-two-col">
                      <div className="form-group">
                        <label className="form-label">Role</label>
                        <select
                          className="form-input"
                          name="role"
                          value={userForm.role}
                          onChange={handleUserChange}
                        >
                          <option value="staff">staff</option>
                          <option value="admin">admin</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                          className="form-input"
                          name="status"
                          value={userForm.status}
                          onChange={handleUserChange}
                        >
                          <option value="active">Active</option>
<option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <select
                        className="form-input"
                        name="department"
                        value={userForm.department}
                        onChange={handleUserChange}
                      >
                        {DEPARTMENT_OPTIONS.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div className="btn-row">
                      <button className="btn-primary" type="submit">
                        Add User
                      </button>
                      <button
                        className="btn-light"
                        type="button"
                        onClick={() =>
                          setUserForm({
  name: "",
  email: "",
  password: "",
  role: "staff",
  department: "ICT Office",
  status: "active",
})
                        }
                      >
                        Clear
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">User Directory</div>
                  <div className="panel-sub">
                    Internal access profiles currently shown in the admin panel.
                  </div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td>
                            <div className="td-name">👤 {u.name}</div>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <span className="td-mono">{u.role}</span>
                          </td>
                          <td>{u.department}</td>
                          <td>
                            <span
                              className="status-badge"
                              style={{
                                color: u.status === "Active" ? "#00E5A0" : "#FFB547",
                                background:
                                  u.status === "Active"
                                    ? "rgba(0,229,160,0.08)"
                                    : "rgba(255,181,71,0.08)",
                                borderColor:
                                  u.status === "Active"
                                    ? "rgba(0,229,160,0.22)"
                                    : "rgba(255,181,71,0.22)",
                              }}
                            >
                              <span
                                className="status-dot"
                                style={{
                                  background:
                                    u.status === "Active" ? "#00E5A0" : "#FFB547",
                                }}
                              ></span>
                              {u.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">Access Notes</div>
                  <div className="panel-sub">
                    Preview section for future role-based administration.
                  </div>
                </div>
                <div className="panel-body">
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-title">Admin capabilities</div>
                      <div className="activity-meta">
                        Can create, edit, remove assets and manage users.
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-title">Staff capabilities</div>
                      <div className="activity-meta">
                        Intended for restricted operational access in future RBAC flow.
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-title">Current note</div>
                      <div className="activity-meta">
                        User management in this screen is UI-level preview until backend user routes are added.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedAsset && (
          <>
            <div
              className="drawer-backdrop"
              onClick={() => setSelectedAsset(null)}
            ></div>
            <aside className="details-drawer">
              <div className="drawer-header">
                <div>
                  <div className="drawer-title">{selectedAsset.name}</div>
                  <div className="drawer-sub">
                    {selectedAsset.assetTag || "No asset tag"} • {selectedAsset.type}
                  </div>
                </div>
                <button
                  className="drawer-close"
                  onClick={() => setSelectedAsset(null)}
                >
                  ×
                </button>
              </div>

              <div className="drawer-body">
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">Status</div>
                    <div className="detail-value">{selectedAsset.status || "—"}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Serial Number</div>
                    <div className="detail-value">
                      {selectedAsset.serialNumber || "—"}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Assigned To</div>
                    <div className="detail-value">
                      {selectedAsset.assignedTo || "—"}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Department</div>
                    <div className="detail-value">
                      {selectedAsset.department || "—"}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Asset Tag</div>
                    <div className="detail-value">
                      {selectedAsset.assetTag || "—"}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Notes</div>
                    <div className="detail-value">
                      {selectedAsset.notes || "No notes available."}
                    </div>
                  </div>
                </div>

                <div className="btn-row">
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setSelectedAsset(null);
                      handleEdit(selectedAsset);
                    }}
                  >
                    Edit Asset
                  </button>
                  <button
                    className="btn-light"
                    onClick={() => openDeleteConfirm(selectedAsset)}
                  >
                    Remove Asset
                  </button>
                </div>
              </div>
            </aside>
          </>
        )}

        {confirmState.open && (
          <>
            <div
              className="modal-backdrop"
              onClick={() =>
                setConfirmState({
                  open: false,
                  title: "",
                  text: "",
                  onConfirm: null,
                })
              }
            ></div>
            <div className="modal-shell">
              <div className="modal-card">
                <div className="modal-header">
                  <div className="modal-title">{confirmState.title}</div>
                </div>
                <div className="modal-body">{confirmState.text}</div>
                <div className="modal-actions">
                  <button
                    className="btn-light"
                    onClick={() =>
                      setConfirmState({
                        open: false,
                        title: "",
                        text: "",
                        onConfirm: null,
                      })
                    }
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary update"
                    onClick={() => confirmState.onConfirm && confirmState.onConfirm()}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;