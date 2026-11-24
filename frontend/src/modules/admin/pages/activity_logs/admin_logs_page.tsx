
"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Search,
  Download,
  Eye,
  Plus,
  Pencil,
  Trash2,
  LogIn,
  ShieldCheck,
  FileText,
  X,
} from "lucide-react";

import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";
import Badge from "@/src/components/ui/badge";
import Modal from "@/src/components/ui/modal";

// Struktur data untuk satu aktivitas Admin.
type activity_log = {
  id: number;
  admin_name: string;
  admin_email: string;
  action: "Create" | "Update" | "Delete" | "Login";
  module: string;
  description: string;
  ip_address: string;
  date: string;
  status: "Success" | "Failed";
};

// Data sementara untuk simulasi Activity Logs.
const initial_logs: activity_log[] = [
  {
    id: 1,
    admin_name: "Vizar Benarly",
    admin_email: "vizar@globaltrade.com",
    action: "Create",
    module: "Admin Management",
    description: "Created a new administrator account.",
    ip_address: "192.168.1.10",
    date: "2026-11-24T09:15:00",
    status: "Success",
  },
  {
    id: 2,
    admin_name: "Raihan",
    admin_email: "raihan@globaltrade.com",
    action: "Update",
    module: "Role & Permissions",
    description: "Updated permissions for the Admin role.",
    ip_address: "192.168.1.12",
    date: "2026-11-24T08:45:00",
    status: "Success",
  },
  {
    id: 3,
    admin_name: "Dimas",
    admin_email: "dimas@globaltrade.com",
    action: "Delete",
    module: "Product Management",
    description: "Deleted a product from the platform.",
    ip_address: "192.168.1.15",
    date: "2026-11-23T16:30:00",
    status: "Success",
  },
  {
    id: 4,
    admin_name: "Vizar Benarly",
    admin_email: "vizar@globaltrade.com",
    action: "Login",
    module: "Authentication",
    description: "Administrator logged into the dashboard.",
    ip_address: "192.168.1.10",
    date: "2026-11-23T10:20:00",
    status: "Success",
  },
  {
    id: 5,
    admin_name: "Sarah",
    admin_email: "sarah@globaltrade.com",
    action: "Update",
    module: "Company Verification",
    description: "Updated a company verification status.",
    ip_address: "192.168.1.20",
    date: "2026-11-22T14:10:00",
    status: "Failed",
  },
  {
    id: 6,
    admin_name: "Raihan",
    admin_email: "raihan@globaltrade.com",
    action: "Create",
    module: "Trade Center",
    description: "Created a new trade article.",
    ip_address: "192.168.1.12",
    date: "2026-11-22T11:05:00",
    status: "Success",
  },
];

// Mengubah format tanggal agar mudah dibaca.
function format_date(date: string) {
  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Menentukan ikon berdasarkan jenis aktivitas.
function get_action_icon(action: activity_log["action"]) {
  switch (action) {
    case "Create":
      return <Plus size={15} />;
    case "Update":
      return <Pencil size={15} />;
    case "Delete":
      return <Trash2 size={15} />;
    case "Login":
      return <LogIn size={15} />;
  }
}

// Menentukan warna Badge berdasarkan jenis aktivitas.
function get_action_variant(action: activity_log["action"]) {
  switch (action) {
    case "Create":
      return "success";
    case "Update":
      return "info";
    case "Delete":
      return "danger";
    case "Login":
      return "neutral";
  }
}

export default function AdminLogsPage() {
  const [logs] = useState<activity_log[]>(initial_logs);

  const [search, set_search] = useState("");
  const [action_filter, set_action_filter] = useState("All");
  const [module_filter, set_module_filter] = useState("All");
  const [date_filter, set_date_filter] = useState("");

  const [selected_log, set_selected_log] =
    useState<activity_log | null>(null);

  // Mengambil daftar module unik dari data aktivitas.
  const modules = useMemo(
    () => [...new Set(logs.map((log) => log.module))],
    [logs]
  );

  // Memfilter data berdasarkan search dan filter yang dipilih.
  const filtered_logs = useMemo(() => {
    return logs.filter((log) => {
      const search_match =
        log.admin_name.toLowerCase().includes(search.toLowerCase()) ||
        log.admin_email.toLowerCase().includes(search.toLowerCase()) ||
        log.description.toLowerCase().includes(search.toLowerCase());

      const action_match =
        action_filter === "All" || log.action === action_filter;

      const module_match =
        module_filter === "All" || log.module === module_filter;

      const date_match =
        !date_filter || log.date.slice(0, 10) === date_filter;

      return (
        search_match &&
        action_match &&
        module_match &&
        date_match
      );
    });
  }, [logs, search, action_filter, module_filter, date_filter]);

  // Menghitung jumlah aktivitas berdasarkan jenisnya.
  const total_activities = logs.length;
  const total_success = logs.filter(
    (log) => log.status === "Success"
  ).length;
  const total_failed = logs.filter(
    (log) => log.status === "Failed"
  ).length;
  const total_admins = new Set(
    logs.map((log) => log.admin_email)
  ).size;

  // Mengunduh data aktivitas dalam format CSV.
  function export_csv() {
    const headers = [
      "Admin",
      "Email",
      "Action",
      "Module",
      "Description",
      "IP Address",
      "Date",
      "Status",
    ];

    const rows = filtered_logs.map((log) => [
      log.admin_name,
      log.admin_email,
      log.action,
      log.module,
      log.description,
      log.ip_address,
      format_date(log.date),
      log.status,
    ]);

    const csv_content = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv_content], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "admin_activity_logs.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Activity size={16} />
            <span>Activity Logs</span>
            <span>/</span>
            <span>Admin Logs</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Activity Logs
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor and review activities performed by administrators.
          </p>
        </div>

        <Button onClick={export_csv}>
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Activities
            </p>
            <Activity className="text-blue-600" size={20} />
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {total_activities}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Recorded activities
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Successful Activities
            </p>
            <ShieldCheck className="text-green-600" size={20} />
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {total_success}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Successfully completed
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Failed Activities
            </p>
            <X className="text-red-600" size={20} />
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {total_failed}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Activities with errors
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Active Admins
            </p>
            <ShieldCheck className="text-purple-600" size={20} />
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {total_admins}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Admins in this sample
          </p>
        </div>
      </div>

      {/* Activity Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 p-5 dark:border-gray-800">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Activity History
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                A list of recent administrator activities.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="w-full sm:w-56">
                <Input
                  placeholder="Search admin or activity..."
                  value={search}
                  onChange={(event) => set_search(event.target.value)}
                />
              </div>

              <select
                value={action_filter}
                onChange={(event) => set_action_filter(event.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="All">All Actions</option>
                <option value="Create">Create</option>
                <option value="Update">Update</option>
                <option value="Delete">Delete</option>
                <option value="Login">Login</option>
              </select>

              <select
                value={module_filter}
                onChange={(event) => set_module_filter(event.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="All">All Modules</option>
                {modules.map((module) => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={date_filter}
                onChange={(event) => set_date_filter(event.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
              <tr>
                <th className="px-5 py-4 font-semibold">Administrator</th>
                <th className="px-5 py-4 font-semibold">Action</th>
                <th className="px-5 py-4 font-semibold">Module</th>
                <th className="px-5 py-4 font-semibold">Date & Time</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered_logs.map((log) => (
                <tr
                  key={log.id}
                  className="transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {log.admin_name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {log.admin_email}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2">
                      {get_action_icon(log.action)}
                      <Badge variant={get_action_variant(log.action)}>
                        {log.action}
                      </Badge>
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {log.module}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                    {format_date(log.date)}
                  </td>

                  <td className="px-5 py-4">
                    <Badge
                      variant={
                        log.status === "Success" ? "success" : "danger"
                      }
                    >
                      {log.status}
                    </Badge>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => set_selected_log(log)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-950"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filtered_logs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <FileText className="mx-auto mb-3" size={30} />
                    No activity logs found.
                    <p className="mt-1 text-xs">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 px-5 py-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          Showing {filtered_logs.length} of {total_activities} activities
        </div>
      </div>

      {/* Activity Detail Modal */}
      <Modal
        is_open={!!selected_log}
        on_close={() => set_selected_log(null)}
        title="Activity Details"
        description="Detailed information about this administrator activity."
        size="md"
      >
        {selected_log && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Activity Status
              </span>
              <Badge
                variant={
                  selected_log.status === "Success" ? "success" : "danger"
                }
              >
                {selected_log.status}
              </Badge>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <p className="font-semibold text-gray-900 dark:text-white">
                {selected_log.admin_name}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {selected_log.admin_email}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Action</p>
                <div className="mt-1">
                  <Badge variant={get_action_variant(selected_log.action)}>
                    {selected_log.action}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Module</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {selected_log.module}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Date & Time</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {format_date(selected_log.date)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">IP Address</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {selected_log.ip_address}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Description</p>
              <p className="mt-1 rounded-lg border border-gray-200 p-3 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
                {selected_log.description}
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => set_selected_log(null)}
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
