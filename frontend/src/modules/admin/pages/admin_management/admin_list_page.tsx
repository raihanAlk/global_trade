
"use client";

import { useState } from "react";

type staff_member = {
  id: number;
  name: string;
  role: string;
  scope: string;
  mfa: string;
  last_review: string;
  status: "Active" | "Pending invitation";
  country: string;
};

const staff_data: staff_member[] = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Platform Admin",
    scope: "Global",
    mfa: "Enrolled",
    last_review: "Nov 01",
    status: "Active",
    country: "United States",
  },
  {
    id: 2,
    name: "Sarah Wijaya",
    role: "Verification Manager",
    scope: "APAC",
    mfa: "Enrolled",
    last_review: "Nov 01",
    status: "Active",
    country: "Indonesia",
  },
  {
    id: 3,
    name: "Linh Nguyen",
    role: "Verification Officer",
    scope: "Assigned",
    mfa: "Enrolled",
    last_review: "Nov 10",
    status: "Active",
    country: "Vietnam",
  },
  {
    id: 4,
    name: "James Carter",
    role: "Senior Reviewer",
    scope: "Escalated",
    mfa: "Enrolled",
    last_review: "Nov 01",
    status: "Active",
    country: "United States",
  },
  {
    id: 5,
    name: "Rachel Chen",
    role: "Content Editor",
    scope: "EN / ID",
    mfa: "Enrollment required",
    last_review: "-",
    status: "Pending invitation",
    country: "Singapore",
  },
];

export default function admin_list_page() {
  const [search, set_search] = useState("");
  const [status_filter, set_status_filter] = useState("All statuses");
  const [country_filter, set_country_filter] = useState("All countries");
  const [active_tab, set_active_tab] = useState("Active staff");

  // Filter data berdasarkan pencarian, status, dan negara.
  const filtered_staff = staff_data.filter((staff) => {
    const matches_search =
      staff.name.toLowerCase().includes(search.toLowerCase()) ||
      staff.role.toLowerCase().includes(search.toLowerCase());

    const matches_status =
      status_filter === "All statuses" ||
      staff.status === status_filter;

    const matches_country =
      country_filter === "All countries" ||
      staff.country === country_filter;

    const matches_tab =
      active_tab === "Active staff"
        ? staff.status === "Active"
        : active_tab === "Invitations"
          ? staff.status === "Pending invitation"
          : true;

    return (
      matches_search &&
      matches_status &&
      matches_country &&
      matches_tab
    );
  });

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Platform Operations
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Admin Management
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Provision internal staff with scoped roles and mandatory MFA.
        </p>

        <div className="mt-3 flex flex-wrap gap-4 text-xs text-blue-600">
          <span className="cursor-pointer hover:underline">
            Verification Queue
          </span>
          <span className="cursor-pointer hover:underline">
            Reviewer Workload
          </span>
          <span className="cursor-pointer hover:underline">
            Trust & Safety
          </span>
          <span className="cursor-pointer hover:underline">
            Reference Data
          </span>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Internal staff", value: "32" },
          { label: "MFA enrolled", value: "30" },
          { label: "Pending invite", value: "2" },
          { label: "Review due", value: "4" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs text-slate-500">{item.label}</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {item.value}
            </h2>
            <p className="mt-2 text-xs text-green-600">
              Sample data · vs last month
            </p>
          </div>
        ))}
      </section>

      {/* Tabs and Invite button */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          {["Active staff", "Invitations", "Access reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => set_active_tab(tab)}
              className={`text-xs font-medium ${
                active_tab === tab
                  ? "text-blue-600"
                  : "text-slate-400 hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => alert("Invite Admin form akan dibuat pada tahap berikutnya.")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          + Invite Admin
        </button>
      </section>

      {/* Search and filters */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="text-xs font-semibold text-slate-700">
            Search internal staff
          </label>

          <input
            type="text"
            value={search}
            onChange={(event) => set_search(event.target.value)}
            placeholder="Search by name or reference..."
            className="mt-2 w-full text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-700">
            Filter results
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            <select
              value={country_filter}
              onChange={(event) => set_country_filter(event.target.value)}
              className="text-xs text-slate-600 outline-none"
            >
              <option>All countries</option>
              <option>Indonesia</option>
              <option>United States</option>
              <option>Vietnam</option>
              <option>Singapore</option>
            </select>

            <select
              value={status_filter}
              onChange={(event) => set_status_filter(event.target.value)}
              className="text-xs text-slate-600 outline-none"
            >
              <option>All statuses</option>
              <option>Active</option>
              <option>Pending invitation</option>
            </select>
          </div>
        </div>
      </section>

      {/* Staff table */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-800">
            {active_tab}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-[10px] uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">Staff member</th>
                <th className="px-4 py-3">Role / Scope</th>
                <th className="px-4 py-3">MFA / Last Review</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered_staff.map((staff) => (
                <tr
                  key={staff.id}
                  className="border-t border-slate-100 text-xs"
                >
                  <td className="px-4 py-4 font-semibold text-slate-800">
                    {staff.name}
                  </td>

                  <td className="px-4 py-4 text-slate-500">
                    {staff.role} · {staff.scope}
                  </td>

                  <td className="px-4 py-4 text-slate-500">
                    {staff.mfa} • {staff.last_review}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={
                        staff.status === "Active"
                          ? "font-semibold text-blue-600"
                          : "font-semibold text-orange-500"
                      }
                    >
                      {staff.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filtered_staff.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
          Showing {filtered_staff.length} sample records · Scoped results
        </div>
      </section>

      {/* Information cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800">
            Staff onboarding
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Invite → scoped role → MFA enrollment → access review.
            Staff rights are separate from business membership.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800">
            Privileged changes
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Re-authentication, reason, and audit are required for
            role changes. Revoke sessions when a staff role ends.
          </p>
        </div>
      </section>

      <p className="text-center text-[10px] text-slate-400">
        Concept UI · Fictional sample data · Access scoped to your permissions
      </p>
    </div>
  );
}
