
"use client";

import { useMemo, useState, type FormEvent } from "react";

import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";
import Badge from "@/src/components/ui/badge";
import Dropdown from "@/src/components/ui/dropdown";
import Modal from "@/src/components/ui/modal";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/src/components/ui/table";

// Tipe data untuk setiap staff internal.
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

// Data contoh sementara sebelum terhubung ke Laravel API.
const initial_staff_data: staff_member[] = [
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

export default function AdminListPage() {
  // State utama halaman.
  const [staff_data, set_staff_data] =
    useState<staff_member[]>(initial_staff_data);

  const [search, set_search] = useState("");
  const [status_filter, set_status_filter] = useState("All statuses");
  const [country_filter, set_country_filter] = useState("All countries");
  const [active_tab, set_active_tab] = useState("Active staff");

  // State untuk modal undangan staff.
  const [invite_modal_open, set_invite_modal_open] = useState(false);
  const [invite_name, set_invite_name] = useState("");
  const [invite_role, set_invite_role] = useState("");
  const [invite_country, set_invite_country] = useState("Indonesia");

  // State untuk modal detail staff.
  const [selected_staff, set_selected_staff] =
    useState<staff_member | null>(null);

  const [detail_modal_open, set_detail_modal_open] = useState(false);

  // Filter data berdasarkan pencarian, status, negara, dan tab.
  const filtered_staff = useMemo(() => {
    return staff_data.filter((staff) => {
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
  }, [
    staff_data,
    search,
    status_filter,
    country_filter,
    active_tab,
  ]);

  // Membuka detail staff yang dipilih.
  function handle_view_staff(staff: staff_member) {
    set_selected_staff(staff);
    set_detail_modal_open(true);
  }

  // Menambahkan undangan baru ke data contoh.
  function handle_invite_admin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!invite_name.trim() || !invite_role.trim()) {
      return;
    }

    const new_staff: staff_member = {
      id: Date.now(),
      name: invite_name.trim(),
      role: invite_role.trim(),
      scope: "Assigned",
      mfa: "Enrollment required",
      last_review: "-",
      status: "Pending invitation",
      country: invite_country,
    };

    set_staff_data((previous_staff) => [
      ...previous_staff,
      new_staff,
    ]);

    set_invite_name("");
    set_invite_role("");
    set_invite_country("Indonesia");
    set_invite_modal_open(false);
    set_active_tab("Invitations");
    set_search("");
    set_status_filter("All statuses");
    set_country_filter("All countries");
  }

  return (
    <div className="space-y-4 xl:space-y-6">
      {/* Page heading */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 xl:text-xs">
          Platform Operations
        </p>

        <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-white xl:text-2xl">
          Admin Management
        </h1>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 xl:text-sm">
          Provision internal staff with scoped roles and mandatory MFA.
        </p>

        <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-blue-600 xl:gap-5 xl:text-sm">
          <span className="cursor-pointer hover:underline">
            Verification Queue
          </span>
          <span className="cursor-pointer hover:underline">
            Reviewer Workload
          </span>
          <span className="cursor-pointer hover:underline">
            Trust &amp; Safety
          </span>
          <span className="cursor-pointer hover:underline">
            Reference Data
          </span>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 xl:gap-4">
        {[
          {
            label: "Internal staff",
            value: String(staff_data.length),
          },
          {
            label: "MFA enrolled",
            value: String(
              staff_data.filter((staff) => staff.mfa === "Enrolled").length
            ),
          },
          {
            label: "Pending invite",
            value: String(
              staff_data.filter(
                (staff) => staff.status === "Pending invitation"
              ).length
            ),
          },
          {
            label: "Review due",
            value: "4",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900 xl:rounded-xl xl:p-5"
          >
            <p className="text-[10px] text-slate-500 dark:text-slate-400 xl:text-sm">
              {item.label}
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white xl:mt-3 xl:text-2xl">
              {item.value}
            </h2>

            <p className="mt-1 text-[9px] text-green-600 xl:mt-2 xl:text-xs">
              Sample data · vs last month
            </p>
          </div>
        ))}
      </section>

      {/* Tabs and Invite button */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3 xl:gap-6">
          {["Active staff", "Invitations", "Access reviews"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => set_active_tab(tab)}
              className={`border-b-2 pb-1.5 text-[10px] font-medium transition xl:pb-3 xl:text-sm ${
                active_tab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400 hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => set_invite_modal_open(true)}
        >
          + Invite Admin
        </Button>
      </section>

      {/* Search and filters */}
      <section className="grid grid-cols-1 gap-2 md:grid-cols-[1.5fr_1fr] xl:gap-5">
        <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 xl:rounded-xl xl:p-5">
          <Input
            label="Search internal staff"
            placeholder="Search by name or role..."
            value={search}
            onChange={(event) => set_search(event.target.value)}
            size="md"
          />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 xl:rounded-xl xl:p-5">
          <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-200 xl:text-sm">
            Filter results
          </p>

          <div className="mt-2 flex flex-wrap gap-2 xl:mt-3 xl:gap-3">
            <select
              value={country_filter}
              onChange={(event) => set_country_filter(event.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[10px] text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:w-[145px] xl:px-3 xl:py-2 xl:text-sm"
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
              className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[10px] text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:w-[145px] xl:px-3 xl:py-2 xl:text-sm"
            >
              <option>All statuses</option>
              <option>Active</option>
              <option>Pending invitation</option>
            </select>
          </div>
        </div>
      </section>

      {/* Staff table */}
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 xl:rounded-xl">
        <div className="border-b border-slate-200 px-3 py-2 dark:border-slate-700 xl:px-5 xl:py-4">
          <h2 className="text-xs font-semibold text-slate-800 dark:text-white xl:text-base">
            {active_tab}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table
            className="min-w-[620px] xl:min-w-[800px]"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <TableHeader>
              <TableRow>
                <TableHead className="w-[18%]">Staff member</TableHead>
                <TableHead className="w-[27%]">Role / Scope</TableHead>
                <TableHead className="w-[23%]">MFA / Last Review</TableHead>
                <TableHead className="w-[13%]">Status</TableHead>
                <TableHead className="w-[19%]" align="right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered_staff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {staff.name}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-slate-500 dark:text-slate-400">
                      {staff.role} · {staff.scope}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-slate-500 dark:text-slate-400">
                      {staff.mfa} • {staff.last_review}
                    </span>
                  </TableCell>

                  <TableCell>
                    {staff.status === "Active" ? (
                      <Badge variant="success" size="sm">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        Pending invitation
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell align="right">
                    <Dropdown
                      align="right"
                      width="180px"
                      trigger={
                        <span className="inline-flex cursor-pointer items-center text-[10px] font-medium text-slate-600 dark:text-slate-300 xl:text-sm">
                          Actions
                          <span className="ml-1">⌄</span>
                        </span>
                      }
                    >
                      <button
                        type="button"
                        onClick={() => handle_view_staff(staff)}
                        className="w-full rounded-md px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        View details
                      </button>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}

              {filtered_staff.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="py-8 text-center text-sm text-slate-400">
                      No staff members found.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-400 dark:border-slate-700 xl:px-5 xl:py-4 xl:text-sm">
          Showing {filtered_staff.length} sample records · Scoped results
        </div>
      </section>

      {/* Information cards */}
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:gap-5">
        <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 xl:rounded-xl xl:p-5">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-white xl:text-base">
            Staff onboarding
          </h3>

          <p className="mt-1 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400 xl:text-sm">
            Invite → scoped role → MFA enrollment → access review.
            Staff rights are separate from business membership.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 xl:rounded-xl xl:p-5">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-white xl:text-base">
            Privileged changes
          </h3>

          <p className="mt-1 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400 xl:text-sm">
            Re-authentication, reason, and audit are required for
            role changes. Revoke sessions when a staff role ends.
          </p>
        </div>
      </section>

      <p className="text-center text-[10px] text-slate-400 xl:text-xs">
        Concept UI · Fictional sample data · Access scoped to your permissions
      </p>

      {/* Invite Admin Modal */}
      <Modal
        is_open={invite_modal_open}
        on_close={() => set_invite_modal_open(false)}
        title="Invite Admin"
        description="Add a new internal staff member to the platform."
        size="md"
      >
        <form onSubmit={handle_invite_admin} className="space-y-4">
          <Input
            label="Full name"
            placeholder="Enter staff name"
            value={invite_name}
            onChange={(event) => set_invite_name(event.target.value)}
            required
            size="md"
          />

          <Input
            label="Role"
            placeholder="Example: Verification Manager"
            value={invite_role}
            onChange={(event) => set_invite_role(event.target.value)}
            required
            size="md"
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Country
            </label>

            <select
              value={invite_country}
              onChange={(event) => set_invite_country(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option>Indonesia</option>
              <option>United States</option>
              <option>Vietnam</option>
              <option>Singapore</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => set_invite_modal_open(false)}
            >
              Cancel
            </Button>

            <Button type="submit" variant="primary">
              Create invitation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Staff Details Modal */}
      <Modal
        is_open={detail_modal_open}
        on_close={() => set_detail_modal_open(false)}
        title="Staff details"
        description="Information about the selected internal staff member."
        size="md"
      >
        {selected_staff && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Staff member
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {selected_staff.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Role
              </p>
              <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                {selected_staff.role}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scope
              </p>
              <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                {selected_staff.scope}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Country
              </p>
              <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                {selected_staff.country}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                MFA status
              </p>
              <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                {selected_staff.mfa}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Last review
              </p>
              <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                {selected_staff.last_review}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Status
              </p>
              <div className="mt-2">
                {selected_staff.status === "Active" ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="warning">Pending invitation</Badge>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => set_detail_modal_open(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
