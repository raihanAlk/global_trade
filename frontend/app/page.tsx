"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Section = "overview" | "users" | "businesses" | "verification";
type Admin = { id: number; name: string; email: string; country?: string; role: string };
type UserRecord = { id: number; name: string; email: string; country?: string; role: string; account_status: string; created_at: string };
type Business = { id: number; legal_name: string; display_name?: string; country: string; business_type?: string; registration_number?: string; email?: string; phone?: string; website?: string; address?: string; description?: string; verification_status: string; memberships_count?: number };
type Document = { id: number; document_type: string; original_name: string; review_status: string; review_note?: string };
type History = { id: number; from_status?: string; to_status: string; notes?: string; created_at: string; changed_by?: { name: string } };
type Submission = { id: number; status: string; admin_notes?: string; request_message?: string; created_at: string; business: Business; documents: Document[]; histories: History[]; submitted_by?: { name: string; email: string } };
type Page<T> = { data: T[]; current_page: number; last_page: number; total: number; per_page: number };
type Dashboard = { users: number; active_users: number; businesses: number; pending_verifications: number; approved_businesses: number };

const API = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");
const statusLabel = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

async function request<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, { ...init, headers: { Accept: "application/json", ...(init.body ? { "Content-Type": "application/json" } : {}), Authorization: `Bearer ${token}`, ...init.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || `Request gagal (${response.status})`);
  return body as T;
}

function Badge({ value }: { value: string }) { return <span className={`pill pill-${value.toLowerCase().replaceAll("_", "-").replaceAll(" ", "-")}`}>{statusLabel(value)}</span>; }

export default function Home() {
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [section, setSection] = useState<Section>("overview");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [users, setUsers] = useState<Page<UserRecord> | null>(null);
  const [businesses, setBusinesses] = useState<Page<Business> | null>(null);
  const [submissions, setSubmissions] = useState<Page<Submission> | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 3000); };
  const loadDashboard = useCallback(async (auth: string) => setDashboard(await request<Dashboard>("/admin/dashboard", auth)), []);
  const loadList = useCallback(async (auth: string, target: Section, query: string, selectedFilter: string, currentPage: number) => {
    const params = new URLSearchParams({ page: String(currentPage), per_page: "10" });
    if (query.trim()) params.set("search", query.trim());
    if (selectedFilter !== "All") params.set(target === "users" ? (["active", "inactive", "suspended"].includes(selectedFilter) ? "status" : selectedFilter === "Importer" || selectedFilter === "Exporter" ? "role" : "country") : target === "businesses" ? (["pending", "in_review", "needs_information", "approved", "rejected", "suspended"].includes(selectedFilter) ? "status" : "country") : "status", selectedFilter.toLowerCase().replaceAll(" ", "_"));
    if (target === "users") setUsers(await request<Page<UserRecord>>(`/admin/users?${params}`, auth));
    if (target === "businesses") setBusinesses(await request<Page<Business>>(`/admin/businesses?${params}`, auth));
    if (target === "verification") setSubmissions(await request<Page<Submission>>(`/admin/verifications?${params}`, auth));
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("gth_admin_token");

    if (saved) {
      Promise.resolve().then(() => {
        setToken(saved);
      });
    }
  }, []);
  useEffect(() => { if (!token) return; let cancelled = false; (async () => { try { const me = await request<{ user: Admin }>("/admin/me", token); if (cancelled) return; setAdmin(me.user); await loadDashboard(token); } catch { sessionStorage.removeItem("gth_admin_token"); setToken(""); setAdmin(null); } })(); return () => { cancelled = true; }; }, [token, loadDashboard]);
  useEffect(() => {
    if (!token || !admin || section === "overview") return;

    let cancelled = false;

    Promise.resolve().then(() => {
      if (cancelled) return;

      setBusy(true);
      setError("");

      loadList(token, section, search, filter, page)
        .catch((e: Error) => {
          if (!cancelled) setError(e.message);
        })
        .finally(() => {
          if (!cancelled) setBusy(false);
        });
    });

    return () => {
      cancelled = true;
    };
  }, [token, admin, section, search, filter, page, loadList]);
  async function login(event: FormEvent) { event.preventDefault(); setBusy(true); setLoginError(""); try { const result = await fetch(`${API}/admin/login`, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ email: loginEmail, password: loginPassword }) }); const body = await result.json(); if (!result.ok) throw new Error(body.message || "Login gagal."); sessionStorage.setItem("gth_admin_token", body.token); setAdmin(body.user); setToken(body.token); setLoginPassword(""); } catch (e) { setLoginError(e instanceof Error ? e.message : "Tidak dapat menghubungi server."); } finally { setBusy(false); } }
  async function logout() { try { await request("/admin/logout", token, { method: "POST" }); } catch { /* token may already be expired */ } sessionStorage.removeItem("gth_admin_token"); setToken(""); setAdmin(null); setDashboard(null); }
  async function openUser(user: UserRecord) { try { const detail = await request<UserRecord>(`/admin/users/${user.id}`, token); setSelectedUser(detail); } catch (e) { notify(e instanceof Error ? e.message : "Gagal membuka pengguna."); } }
  async function openBusiness(business: Business) { try { setSelectedBusiness(await request<Business>(`/admin/businesses/${business.id}`, token)); } catch (e) { notify(e instanceof Error ? e.message : "Gagal membuka perusahaan."); } }
  async function openSubmission(item: Submission) { try { const detail = await request<Submission>(`/admin/verifications/${item.id}`, token); setSelectedSubmission(detail); setNote(detail.admin_notes || ""); } catch (e) { notify(e instanceof Error ? e.message : "Gagal membuka pengajuan."); } }
  async function updateUserStatus(user: UserRecord) { const next = user.account_status === "active" ? "inactive" : "active"; if (!window.confirm(`Ubah status akun ${user.name} menjadi ${next}?`)) return; try { await request(`/admin/users/${user.id}/status`, token, { method: "PATCH", body: JSON.stringify({ status: next }) }); setSelectedUser({ ...user, account_status: next }); await loadList(token, "users", search, filter, page); notify("Status akun berhasil diperbarui."); } catch (e) { notify(e instanceof Error ? e.message : "Gagal memperbarui status."); } }
  async function decide(status: string) { if (!selectedSubmission) return; if (!window.confirm(`Simpan keputusan ${statusLabel(status)} untuk ${selectedSubmission.business.legal_name}?`)) return; try { const result = await request<{ submission: Submission }>(`/admin/verifications/${selectedSubmission.id}`, token, { method: "PATCH", body: JSON.stringify({ status, admin_notes: note }) }); setSelectedSubmission(result.submission); await loadList(token, "verification", search, filter, page); await loadDashboard(token); notify("Keputusan verifikasi berhasil disimpan."); } catch (e) { notify(e instanceof Error ? e.message : "Gagal menyimpan keputusan."); } }
  const pageTitle = useMemo(() => ({ overview: "Overview", users: "User management", businesses: "Business management", verification: "Company verification" }[section]), [section]);

  if (!admin) return <main className="login-shell"><form className="login-card" onSubmit={login}><div className="brand login-brand"><div className="brand-mark">G</div><div><b>GlobalTrade</b><small>HUB ADMIN</small></div></div><div className="eyebrow">SECURE ADMINISTRATION</div><h1>Welcome back</h1><p>Sign in using your administrator account to manage GlobalTrade Hub.</p><label className="field-label" htmlFor="email">Email address</label><input id="email" type="email" autoComplete="username" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="admin@example.com" /><label className="field-label" htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Enter your password" />{loginError && <p className="form-error">{loginError}</p>}<button className="primary-button login-submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button><small className="login-hint">Admin access only · API: {API}</small></form></main>;

  const rows = section === "users" ? users?.data || [] : section === "businesses" ? businesses?.data || [] : submissions?.data || [];
  const pagination = section === "users" ? users : section === "businesses" ? businesses : submissions;
  return <main className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-mark">G</div><div><b>GlobalTrade</b><small>HUB ADMIN</small></div></div><div className="workspace-label">WORKSPACE</div><nav>{([["overview", "Overview", "▦"], ["users", "User management", "♙"], ["businesses", "Business management", "▤"], ["verification", "Company verification", "✓"]] as [Section, string, string][]).map(([key, label, icon]) => <button key={key} className={`nav-item ${section === key ? "active" : ""}`} onClick={() => { setSection(key); setSearch(""); setFilter("All"); setPage(1); }}><span className="nav-icon">{icon}</span>{label}</button>)}</nav><div className="sidebar-bottom"><div className="admin-profile"><div className="avatar">{admin.name.split(" ").map(x => x[0]).slice(0, 2).join("")}</div><div><b>{admin.name}</b><small>{admin.email}</small></div><button className="more-button" onClick={logout} title="Logout">↪</button></div></div></aside>
    <section className="main-area"><header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> <b>{pageTitle}</b></div><div className="top-actions"><span className="environment"><i /> Live API</span><button className="secondary-button" onClick={logout}>Logout</button></div></header><div className="content"><div className="page-heading"><div><div className="eyebrow">ADMINISTRATION / {section.toUpperCase()}</div><h1>{section === "overview" ? `Good day, ${admin.name}` : pageTitle}</h1><p>{section === "overview" ? "Monitor users, businesses and company verification across the platform." : "Data ditampilkan langsung dari database GlobalTrade Hub."}</p></div>{section !== "overview" && <button className="secondary-button" onClick={() => { setSearch(""); setFilter("All"); setPage(1); }}>↻ Reset filters</button>}</div>
      {error && <div className="api-error">{error}</div>}
      {section === "overview" && <><div className="stat-grid"><Stat label="Total users" value={dashboard?.users ?? "—"} icon="♙" tone="blue" /><Stat label="Registered businesses" value={dashboard?.businesses ?? "—"} icon="▤" tone="purple" /><Stat label="Pending verification" value={dashboard?.pending_verifications ?? "—"} icon="◷" tone="orange" /><Stat label="Verified companies" value={dashboard?.approved_businesses ?? "—"} icon="✓" tone="green" /></div><section className="panel"><div className="panel-heading"><div><h2>Admin workspace</h2><p>Choose a module from the sidebar to manage live records.</p></div><button className="secondary-button" onClick={() => loadDashboard(token).then(() => notify("Dashboard diperbarui."))}>↻ Refresh</button></div><p>Active user accounts: <b>{dashboard?.active_users ?? "—"}</b></p></section></>}
      {section !== "overview" && <section className="panel"><div className="table-toolbar"><input className="search-input" placeholder={section === "users" ? "Search name, email or country…" : "Search records…"} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /><select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}><option value="All">All filters</option>{(section === "users" ? ["Importer", "Exporter", "active", "inactive", "suspended", "Indonesia", "United States", "Germany", "Japan", "Singapore"] : section === "businesses" ? ["pending", "in_review", "needs_information", "approved", "rejected", "suspended", "Indonesia", "United States", "Germany", "Japan", "Singapore"] : ["pending", "in_review", "needs_information", "approved", "rejected", "suspended"]).map(x => <option key={x} value={x}>{statusLabel(x)}</option>)}</select><span className="result-count">{pagination?.total ?? 0} results</span></div>{busy ? <div className="empty-state">Loading records…</div> : <div className="table-wrap"><table><thead><tr>{section === "users" ? <><th>USER</th><th>COUNTRY</th><th>ROLE</th><th>JOINED</th><th>ACCOUNT STATUS</th></> : section === "businesses" ? <><th>BUSINESS</th><th>COUNTRY</th><th>BUSINESS TYPE</th><th>REGISTRATION NO.</th><th>VERIFICATION</th></> : <><th>COMPANY / SUBMISSION</th><th>COUNTRY</th><th>SUBMITTED</th><th>DOCUMENTS</th><th>STATUS</th></>}</tr></thead><tbody>{section === "users" && (rows as UserRecord[]).map(u => <tr key={u.id}><td><b>{u.name}</b><small>{u.email}</small></td><td>{u.country || "—"}</td><td>{statusLabel(u.role)}</td><td>{new Date(u.created_at).toLocaleDateString()}</td><td><Badge value={u.account_status} /></td><td><button className="row-action" onClick={() => openUser(u)}>View details ↗</button></td></tr>)}{section === "businesses" && (rows as Business[]).map(b => <tr key={b.id}><td><b>{b.legal_name}</b><small>Business #{b.id}</small></td><td>{b.country}</td><td>{b.business_type || "—"}</td><td>{b.registration_number || "—"}</td><td><Badge value={b.verification_status} /></td><td><button className="row-action" onClick={() => openBusiness(b)}>View details ↗</button></td></tr>)}{section === "verification" && (rows as Submission[]).map(s => <tr key={s.id}><td><b>{s.business?.legal_name || "Business"}</b><small>Submission #{s.id}</small></td><td>{s.business?.country || "—"}</td><td>{new Date(s.created_at).toLocaleDateString()}</td><td>{s.documents?.length || 0} files</td><td><Badge value={s.status} /></td><td><button className="row-action" onClick={() => openSubmission(s)}>Review ↗</button></td></tr>)}</tbody></table>{rows.length === 0 && <div className="empty-state">No records found.</div>}</div>}<div className="table-footer"><span>Page {pagination?.current_page ?? 1} of {pagination?.last_page ?? 1} · {pagination?.total ?? 0} records</span><div><button disabled={!pagination || pagination.current_page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>← Previous</button><button className="current-page">{pagination?.current_page ?? 1}</button><button disabled={!pagination || pagination.current_page >= pagination.last_page} onClick={() => setPage(p => p + 1)}>Next →</button></div></div></section>}
      <footer className="footer">© 2026 GlobalTrade Hub <span>Admin workspace · Internal use only</span></footer></div></section>
    {(selectedUser || selectedBusiness || selectedSubmission) && <div className="modal-backdrop" onClick={() => { setSelectedUser(null); setSelectedBusiness(null); setSelectedSubmission(null); }}><section className="detail-modal" onClick={e => e.stopPropagation()}><div className="modal-top"><div><div className="eyebrow">RECORD DETAILS</div><h2>{selectedUser?.name || selectedBusiness?.legal_name || selectedSubmission?.business?.legal_name}</h2></div><button className="close-button" onClick={() => { setSelectedUser(null); setSelectedBusiness(null); setSelectedSubmission(null); }}>×</button></div>
      {selectedUser && <><div className="detail-grid"><Detail label="Name" value={selectedUser.name} /><Detail label="Email" value={selectedUser.email} /><Detail label="Country" value={selectedUser.country || "—"} /><Detail label="Role" value={selectedUser.role} /><Detail label="Account status" value={selectedUser.account_status} /><Detail label="Joined" value={new Date(selectedUser.created_at).toLocaleString()} /></div><div className="modal-actions"><button className="secondary-button" onClick={() => setSelectedUser(null)}>Close</button><button className="primary-button" onClick={() => updateUserStatus(selectedUser)}>{selectedUser.account_status === "active" ? "Deactivate account" : "Activate account"}</button></div></>}
      {selectedBusiness && <><div className="detail-grid">{(
        [
          ["Legal name", selectedBusiness.legal_name],
          ["Display name", selectedBusiness.display_name],
          ["Country", selectedBusiness.country],
          ["Business type", selectedBusiness.business_type],
          ["Registration number", selectedBusiness.registration_number],
          ["Email", selectedBusiness.email],
          ["Phone", selectedBusiness.phone],
          ["Website", selectedBusiness.website],
          ["Address", selectedBusiness.address],
          ["Verification", selectedBusiness.verification_status],
        ] as [string, string | undefined][]
      ).map(([label, value]) => (
        <Detail
          key={label}
          label={label}
          value={value ?? "—"}
        />
      ))}</div><div className="modal-actions"><button className="secondary-button" onClick={() => setSelectedBusiness(null)}>Close</button></div></>}
      {selectedSubmission && <><div className="submission-status"><span>Current status</span><Badge value={selectedSubmission.status} /></div><h3 className="section-subtitle">Submitted documents</h3><div className="document-list">{selectedSubmission.documents?.map(doc => <div className="document-row" key={doc.id}><span><b>{doc.document_type}</b><small>{doc.original_name} · {statusLabel(doc.review_status)}</small></span><a target="_blank" rel="noreferrer" href={`${API}/admin/verifications/${selectedSubmission.id}/documents/${doc.id}`} onClick={e => { e.preventDefault(); fetch(`${API}/admin/verifications/${selectedSubmission.id}/documents/${doc.id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => { if (!r.ok) throw new Error("Dokumen tidak dapat dibuka."); return r.blob(); }).then(blob => { const url = URL.createObjectURL(blob); window.open(url, "_blank", "noopener,noreferrer"); }).catch(err => notify(err.message)); }}>Preview ↗</a></div>)}</div><h3 className="section-subtitle">Submission history</h3><div className="history-box">{selectedSubmission.histories?.length ? selectedSubmission.histories.map(h => <p key={h.id}>{new Date(h.created_at).toLocaleString()} · {h.from_status ? statusLabel(h.from_status) + " → " : ""}<b>{statusLabel(h.to_status)}</b>{h.notes ? ` · ${h.notes}` : ""}</p>) : <p>No status history recorded yet.</p>}</div><label className="field-label" htmlFor="review-note">Admin notes / request message</label><textarea id="review-note" value={note} onChange={e => setNote(e.target.value)} placeholder="Write review notes or additional information required…" /><div className="modal-actions wrap-actions"><button className="secondary-button" onClick={() => decide("needs_information")}>Request more information</button><button className="danger-button" onClick={() => decide("rejected")}>Reject</button><button className="primary-button" onClick={() => decide("approved")}>Approve company</button></div></>}
    </section></div>}{toast && <div className="toast">✓ {toast}</div>}</main>;
}
function Stat({ label, value, icon, tone }: { label: string; value: string | number; icon: string; tone: string }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div></div>; }
function Detail({ label, value }: { label: string; value: string }) { return <div className="detail-item"><span>{label}</span><b>{value}</b></div>; }
