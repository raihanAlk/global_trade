"use client";

import { useMemo, useState } from "react";

type Section = "overview" | "users" | "businesses" | "verification";
type User = { id: number; name: string; email: string; country: string; role: string; status: "Active" | "Inactive" | "Suspended"; joined: string };
type Business = { id: number; name: string; country: string; type: string; registration: string; email: string; status: string };
type Submission = { id: number; business: string; country: string; submitted: string; status: "Pending" | "In Review" | "Needs Information" | "Approved" | "Rejected" | "Suspended"; documents: string[]; note: string };

const initialUsers: User[] = [
  { id: 1, name: "Olivia Rhye", email: "olivia@acmecorp.com", country: "United States", role: "Importer", status: "Active", joined: "12 Nov 2026" },
  { id: 2, name: "Phoenix Baker", email: "phoenix@globalparts.de", country: "Germany", role: "Exporter", status: "Active", joined: "10 Nov 2026" },
  { id: 3, name: "Lana Steiner", email: "lana@nusantara.co.id", country: "Indonesia", role: "Importer", status: "Inactive", joined: "08 Nov 2026" },
  { id: 4, name: "Demi Wilkinson", email: "demi@tradehub.jp", country: "Japan", role: "Exporter", status: "Active", joined: "05 Nov 2026" },
  { id: 5, name: "Candice Wu", email: "candice@oceanic.sg", country: "Singapore", role: "Importer", status: "Suspended", joined: "02 Nov 2026" },
];
const initialBusinesses: Business[] = [
  { id: 1, name: "Acme Corporation", country: "United States", type: "Manufacturer", registration: "US-8291042", email: "legal@acmecorp.com", status: "Approved" },
  { id: 2, name: "Global Parts GmbH", country: "Germany", type: "Wholesaler", registration: "DE-HRB-44192", email: "office@globalparts.de", status: "Pending" },
  { id: 3, name: "Nusantara Trading", country: "Indonesia", type: "Trading Company", registration: "AHU-009182", email: "hello@nusantara.co.id", status: "Needs Information" },
  { id: 4, name: "Oceanic Supplies Pte Ltd", country: "Singapore", type: "Distributor", registration: "202611830K", email: "ops@oceanic.sg", status: "In Review" },
];
const initialSubmissions: Submission[] = [
  { id: 1, business: "Global Parts GmbH", country: "Germany", submitted: "20 Nov 2026", status: "Pending", documents: ["Business registration certificate", "Tax certificate", "Director identity"], note: "" },
  { id: 2, business: "Nusantara Trading", country: "Indonesia", submitted: "18 Nov 2026", status: "Needs Information", documents: ["NIB / Business license", "Director identity"], note: "Please upload a clearer copy of the business license." },
  { id: 3, business: "Oceanic Supplies Pte Ltd", country: "Singapore", submitted: "17 Nov 2026", status: "In Review", documents: ["ACRA profile", "Tax certificate"], note: "" },
  { id: 4, business: "Acme Corporation", country: "United States", submitted: "12 Nov 2026", status: "Approved", documents: ["Certificate of incorporation", "Tax certificate"], note: "All documents verified." },
];

const navItems: { key: Section; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "▦" },
  { key: "users", label: "User management", icon: "♙" },
  { key: "businesses", label: "Business management", icon: "▤" },
  { key: "verification", label: "Company verification", icon: "✓" },
];

function Pill({ children }: { children: string }) {
  const value = children.toLowerCase().replaceAll(" ", "-");
  return <span className={`pill pill-${value}`}>{children}</span>;
}

export default function Home() {
  const [section, setSection] = useState<Section>("overview");
  const [users, setUsers] = useState(initialUsers);
  const [businesses] = useState(initialBusinesses);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [confirmUser, setConfirmUser] = useState<User | null>(null);
  const [toast, setToast] = useState("");

  const filteredUsers = useMemo(() => users.filter((u) => (u.name + u.email + u.country).toLowerCase().includes(search.toLowerCase()) && (filter === "All" || u.role === filter || u.status === filter || u.country === filter)), [users, search, filter]);
  const filteredBusinesses = useMemo(() => businesses.filter((b) => (b.name + b.country + b.registration).toLowerCase().includes(search.toLowerCase()) && (filter === "All" || b.status === filter || b.country === filter)), [businesses, search, filter]);
  const filteredSubmissions = useMemo(() => submissions.filter((s) => (s.business + s.country).toLowerCase().includes(search.toLowerCase()) && (filter === "All" || s.status === filter)), [submissions, search, filter]);

  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(""), 2600); }
  function changeSubmissionStatus(id: number, status: Submission["status"]) {
    setSubmissions((items) => items.map((item) => item.id === id ? { ...item, status, note: adminNote || item.note } : item));
    setSelectedSubmission((item) => item && item.id === id ? { ...item, status, note: adminNote || item.note } : item);
    notify(`Submission ${status.toLowerCase()} successfully (demo).`);
  }

  const pageTitle = navItems.find((item) => item.key === section)?.label ?? "Overview";
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">G</div><div><b>GlobalTrade</b><small>HUB ADMIN</small></div></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>{navItems.map((item) => <button key={item.key} className={`nav-item ${section === item.key ? "active" : ""}`} onClick={() => { setSection(item.key); setSearch(""); setFilter("All"); }}><span className="nav-icon">{item.icon}</span>{item.label}{item.key === "verification" && <span className="nav-count">2</span>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="help-card"><div className="help-icon">?</div><b>Need help?</b><p>Visit the admin guide for tips and documentation.</p><button onClick={() => notify("Admin guide will be available soon.")}>View guide ↗</button></div><div className="admin-profile"><div className="avatar">AD</div><div><b>Admin Demo</b><small>Administrator</small></div><button className="more-button" aria-label="Profile menu" onClick={() => notify("Profile settings are not connected yet.")}>•••</button></div></div>
      </aside>

      <section className="main-area">
        <header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> <b>{pageTitle}</b></div><div className="top-actions"><span className="environment"><i /> Demo workspace</span><button className="icon-button" aria-label="Notifications" onClick={() => notify("You are all caught up.")}>♧</button><div className="avatar small-avatar">AD</div></div></header>
        <div className="content">
          <div className="page-heading"><div><div className="eyebrow">ADMINISTRATION / {section.toUpperCase()}</div><h1>{section === "overview" ? "Good morning, Admin" : pageTitle}</h1><p>{section === "overview" ? "Here’s what’s happening across your GlobalTrade Hub workspace." : section === "users" ? "Manage platform users, account access and user information." : section === "businesses" ? "Review registered businesses and their company profiles." : "Review submitted company documents and manage verification decisions."}</p></div>{section !== "overview" && <button className="secondary-button" onClick={() => { setSearch(""); setFilter("All"); }}>↻ Reset filters</button>}</div>

          {section === "overview" && <>
            <div className="stat-grid"><Stat label="Total users" value="2,840" delta="12.8%" icon="♙" tone="blue" /><Stat label="Registered businesses" value="1,264" delta="8.2%" icon="▤" tone="purple" /><Stat label="Pending verification" value="24" delta="Needs attention" icon="◷" tone="orange" /><Stat label="Verified companies" value="892" delta="70.6% of total" icon="✓" tone="green" /></div>
            <div className="overview-grid"><section className="panel"><div className="panel-heading"><div><h2>Verification queue</h2><p>Latest company submissions that need attention.</p></div><button className="text-button" onClick={() => setSection("verification")}>View all →</button></div><div className="table-wrap"><table><thead><tr><th>COMPANY</th><th>COUNTRY</th><th>SUBMITTED</th><th>STATUS</th></tr></thead><tbody>{submissions.slice(0, 4).map((s) => <tr key={s.id} onClick={() => setSelectedSubmission(s)} className="click-row"><td><b>{s.business}</b><small>Submission #{String(s.id).padStart(4, "0")}</small></td><td>{s.country}</td><td>{s.submitted}</td><td><Pill>{s.status}</Pill></td></tr>)}</tbody></table></div></section><section className="panel activity-panel"><div className="panel-heading"><div><h2>Quick actions</h2><p>Common administration tasks.</p></div></div><button className="quick-action" onClick={() => setSection("users")}><span className="quick-icon blue-bg">♙</span><span><b>Manage users</b><small>Review accounts and access</small></span><span className="arrow">→</span></button><button className="quick-action" onClick={() => setSection("businesses")}><span className="quick-icon purple-bg">▤</span><span><b>Browse businesses</b><small>View company profiles</small></span><span className="arrow">→</span></button><button className="quick-action" onClick={() => setSection("verification")}><span className="quick-icon orange-bg">✓</span><span><b>Review submissions</b><small>Process verification requests</small></span><span className="arrow">→</span></button><div className="tip-box"><b>Admin workspace tip</b><p>Always review company documents before approving a verification submission.</p></div></section></div>
          </>}

          {section !== "overview" && <section className="panel data-panel"><div className="toolbar"><div className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={section === "users" ? "Search name, email or country..." : section === "businesses" ? "Search company, country or registration..." : "Search company or country..."} /></div><select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter records"><option>All</option>{(section === "users" ? ["Importer", "Exporter", "Active", "Inactive", "Suspended"] : section === "businesses" ? ["Pending", "In Review", "Needs Information", "Approved", "Rejected", "Suspended"] : ["Pending", "In Review", "Needs Information", "Approved", "Rejected", "Suspended"]).map((v) => <option key={v}>{v}</option>)}</select><span className="result-count">{section === "users" ? filteredUsers.length : section === "businesses" ? filteredBusinesses.length : filteredSubmissions.length} results</span></div>
            <div className="table-wrap"><table><thead>{section === "users" ? <tr><th>USER</th><th>COUNTRY</th><th>ROLE</th><th>DATE JOINED</th><th>ACCOUNT STATUS</th><th></th></tr> : section === "businesses" ? <tr><th>BUSINESS</th><th>COUNTRY</th><th>BUSINESS TYPE</th><th>REGISTRATION NO.</th><th>VERIFICATION</th><th></th></tr> : <tr><th>COMPANY / SUBMISSION</th><th>COUNTRY</th><th>SUBMITTED</th><th>DOCUMENTS</th><th>STATUS</th><th></th></tr>}</thead><tbody>
              {section === "users" && filteredUsers.map((u) => <tr key={u.id}><td><div className="person-cell"><div className="avatar table-avatar">{u.name.split(" ").map((x) => x[0]).join("")}</div><span><b>{u.name}</b><small>{u.email}</small></span></div></td><td>{u.country}</td><td><span className="role-tag">{u.role}</span></td><td>{u.joined}</td><td><Pill>{u.status}</Pill></td><td><button className="row-action" onClick={() => setSelectedUser(u)}>View details ↗</button></td></tr>)}
              {section === "businesses" && filteredBusinesses.map((b) => <tr key={b.id}><td><b>{b.name}</b><small>Business ID #{String(b.id).padStart(5, "0")}</small></td><td>{b.country}</td><td>{b.type}</td><td className="mono">{b.registration}</td><td><Pill>{b.status}</Pill></td><td><button className="row-action" onClick={() => setSelectedBusiness(b)}>View details ↗</button></td></tr>)}
              {section === "verification" && filteredSubmissions.map((s) => <tr key={s.id}><td><b>{s.business}</b><small>Submission #{String(s.id).padStart(4, "0")}</small></td><td>{s.country}</td><td>{s.submitted}</td><td>{s.documents.length} files</td><td><Pill>{s.status}</Pill></td><td><button className="row-action" onClick={() => { setSelectedSubmission(s); setAdminNote(s.note); }}>Review ↗</button></td></tr>)}
              {((section === "users" && filteredUsers.length === 0) || (section === "businesses" && filteredBusinesses.length === 0) || (section === "verification" && filteredSubmissions.length === 0)) && <tr><td colSpan={6} className="empty-state">No records match your search.</td></tr>}
            </tbody></table></div><div className="table-footer"><span>Showing {section === "users" ? filteredUsers.length : section === "businesses" ? filteredBusinesses.length : filteredSubmissions.length} records</span><div><button disabled>← Previous</button><button className="current-page">1</button><button disabled>Next →</button></div></div>
          </section>}
          <footer className="footer">© 2026 GlobalTrade Hub <span>Admin workspace · Internal use only</span></footer>
        </div>
      </section>

      {(selectedUser || selectedBusiness || selectedSubmission) && <div className="modal-backdrop" onClick={() => { setSelectedUser(null); setSelectedBusiness(null); setSelectedSubmission(null); }}><section className="detail-modal" onClick={(e) => e.stopPropagation()}><div className="modal-top"><div><div className="eyebrow">RECORD DETAILS</div><h2>{selectedUser?.name || selectedBusiness?.name || selectedSubmission?.business}</h2><p>{selectedUser ? "User account information" : selectedBusiness ? "Registered business profile" : `Verification submission #${String(selectedSubmission?.id).padStart(4, "0")}`}</p></div><button className="close-button" onClick={() => { setSelectedUser(null); setSelectedBusiness(null); setSelectedSubmission(null); }}>×</button></div>
        {selectedUser && <><div className="detail-grid"><Detail label="Full name" value={selectedUser.name} /><Detail label="Email address" value={selectedUser.email} /><Detail label="Country" value={selectedUser.country} /><Detail label="Platform role" value={selectedUser.role} /><Detail label="Date joined" value={selectedUser.joined} /><Detail label="Account status" value={selectedUser.status} /></div><div className="modal-actions"><button className="secondary-button" onClick={() => setSelectedUser(null)}>Close</button><button className="primary-button" onClick={() => setConfirmUser(selectedUser)}>{selectedUser.status === "Active" ? "Deactivate account" : "Activate account"}</button></div></>}
        {selectedBusiness && <><div className="detail-grid"><Detail label="Legal business name" value={selectedBusiness.name} /><Detail label="Country" value={selectedBusiness.country} /><Detail label="Business type" value={selectedBusiness.type} /><Detail label="Registration number" value={selectedBusiness.registration} /><Detail label="Business contact" value={selectedBusiness.email} /><Detail label="Verification status" value={selectedBusiness.status} /></div><div className="modal-actions"><button className="secondary-button" onClick={() => setSelectedBusiness(null)}>Close</button></div></>}
        {selectedSubmission && <><div className="submission-status"><span>Current status</span><Pill>{selectedSubmission.status}</Pill></div><h3 className="section-subtitle">Submitted documents</h3><div className="document-list">{selectedSubmission.documents.map((doc) => <div className="document-row" key={doc}><span className="document-icon">▧</span><span><b>{doc}</b><small>Document preview is awaiting file upload integration</small></span><button onClick={() => notify("No document file is attached in this demo record.")}>Preview ↗</button></div>)}</div><h3 className="section-subtitle">Review checklist</h3><div className="checklist"><label><input type="checkbox" /> Legal business name matches the document</label><label><input type="checkbox" /> Registration number is valid</label><label><input type="checkbox" /> Documents are clear and readable</label><label><input type="checkbox" /> Business contact details are consistent</label></div><label className="field-label" htmlFor="admin-note">Admin notes / request message</label><textarea id="admin-note" value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Write review notes or additional information required..." /><div className="history-box"><b>Submission history</b><p>{selectedSubmission.submitted} · Submitted by business representative</p><p>Current status: {selectedSubmission.status}</p></div><div className="modal-actions wrap-actions"><button className="secondary-button" onClick={() => changeSubmissionStatus(selectedSubmission.id, "Needs Information")}>Request more information</button><button className="danger-button" onClick={() => changeSubmissionStatus(selectedSubmission.id, "Rejected")}>Reject</button><button className="primary-button" onClick={() => changeSubmissionStatus(selectedSubmission.id, "Approved")}>Approve company</button></div></>}
      </section></div>}
      {confirmUser && <div className="modal-backdrop" onClick={() => setConfirmUser(null)}><section className="confirm-modal" onClick={(e) => e.stopPropagation()}><div className="confirm-symbol">!</div><h2>Confirm account status change</h2><p>Are you sure you want to {confirmUser.status === "Active" ? "deactivate" : "activate"} <b>{confirmUser.name}</b>?</p><div className="modal-actions"><button className="secondary-button" onClick={() => setConfirmUser(null)}>Cancel</button><button className="primary-button" onClick={() => { const next = confirmUser.status === "Active" ? "Inactive" : "Active"; setUsers((items) => items.map((u) => u.id === confirmUser.id ? { ...u, status: next } : u)); setSelectedUser({ ...confirmUser, status: next }); setConfirmUser(null); notify(`Account ${next.toLowerCase()} (demo).`); }}>Confirm</button></div></section></div>}
      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}

function Stat({ label, value, delta, icon, tone }: { label: string; value: string; delta: string; icon: string; tone: string }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-delta">↗ {delta}</div></div>; }
function Detail({ label, value }: { label: string; value: string }) { return <div className="detail-item"><span>{label}</span><b>{value}</b></div>; }
