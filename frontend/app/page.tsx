"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");
const ADMIN_HOME = "/admin/admin_management/admin_list";

export default function Home() {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let session_valid = false;
    const savedToken = sessionStorage.getItem("gth_admin_token");

    if (!savedToken) {
      Promise.resolve().then(() => {
        if (!cancelled) setCheckingSession(false);
      });
      return () => {
        cancelled = true;
      };
    }

    fetch(`${API}/v1/auth/me`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${savedToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Sesi admin tidak valid (${response.status}).`);
        }
        if (!cancelled) {
          session_valid = true;
          router.replace(ADMIN_HOME);
        }
      })
      .catch(() => {
        if (!cancelled) sessionStorage.removeItem("gth_admin_token");
      })
      .finally(() => {
        if (!cancelled && !session_valid) setCheckingSession(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setLoginError("");

    try {
      const response = await fetch(`${API}/v1/auth/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });
      const body: { token?: string; message?: string } = await response.json();

      if (!response.ok) {
        throw new Error(body.message || "Login gagal.");
      }
      if (!body.token) {
        throw new Error("Token login tidak ditemukan.");
      }

      sessionStorage.setItem("gth_admin_token", body.token);
      setLoginPassword("");
      setCheckingSession(true);
      router.replace(ADMIN_HOME);
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Tidak dapat menghubungi server."
      );
    } finally {
      setBusy(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="login-shell">
        <p>Memeriksa sesi admin...</p>
      </main>
    );
  }

  return (
    <main className="login-shell">
      <form className="login-card" onSubmit={login}>
        <div className="brand login-brand">
          <div className="brand-mark">G</div>
          <div>
            <b>GlobalTrade</b>
            <small>HUB ADMIN</small>
          </div>
        </div>
        <div className="eyebrow">SECURE ADMINISTRATION</div>
        <h1>Welcome back</h1>
        <p>Sign in using your administrator account to manage GlobalTrade Hub.</p>
        <label className="field-label" htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={loginEmail}
          onChange={(event) => setLoginEmail(event.target.value)}
          placeholder="admin@example.com"
        />
        <label className="field-label" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={loginPassword}
          onChange={(event) => setLoginPassword(event.target.value)}
          placeholder="Enter your password"
        />
        {loginError && <p className="form-error">{loginError}</p>}
        <button className="primary-button login-submit" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <small className="login-hint">Admin access only · API: {API}</small>
      </form>
    </main>
  );
}
