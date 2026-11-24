
"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  Download,
  Eye,
  Server,
  X,
  Clock,
  FileText,
} from "lucide-react";

import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";
import Badge from "@/src/components/ui/badge";
import Modal from "@/src/components/ui/modal";

// Jenis tingkat keparahan log sistem.
type log_severity = "Info" | "Warning" | "Error" | "Critical";

// Status penanganan log.
type log_status = "Resolved" | "Investigating" | "Active";

// Struktur data untuk satu system log.
type system_log = {
  id: number;
  event: string;
  service: string;
  severity: log_severity;
  description: string;
  date: string;
  status: log_status;
  environment: "Production" | "Development" | "Staging";
  reference_id: string;
};

// Data sementara untuk simulasi System Logs.
const initial_logs: system_log[] = [
  {
    id: 1,
    event: "Database Connection",
    service: "Database Service",
    severity: "Info",
    description: "Database connection established successfully.",
    date: "2026-11-24T09:30:00",
    status: "Resolved",
    environment: "Production",
    reference_id: "SYS-2026-001",
  },
  {
    id: 2,
    event: "API Response Delay",
    service: "API Gateway",
    severity: "Warning",
    description: "API response time exceeded the expected threshold.",
    date: "2026-11-24T09:15:00",
    status: "Investigating",
    environment: "Production",
    reference_id: "SYS-2026-002",
  },
  {
    id: 3,
    event: "Payment Service Error",
    service: "Payment Service",
    severity: "Error",
    description: "A payment processing request could not be completed.",
    date: "2026-11-24T08:45:00",
    status: "Active",
    environment: "Production",
    reference_id: "SYS-2026-003",
  },
  {
    id: 4,
    event: "Authentication Failure",
    service: "Authentication Service",
    severity: "Warning",
    description: "An authentication request failed validation.",
    date: "2026-11-23T16:30:00",
    status: "Resolved",
    environment: "Production",
    reference_id: "SYS-2026-004",
  },
  {
    id: 5,
    event: "Storage Capacity Alert",
    service: "Storage Service",
    severity: "Critical",
    description: "Storage capacity reached a critical threshold.",
    date: "2026-11-23T14:10:00",
    status: "Active",
    environment: "Production",
    reference_id: "SYS-2026-005",
  },
  {
    id: 6,
    event: "Scheduled Backup",
    service: "Backup Service",
    severity: "Info",
    description: "Scheduled database backup completed successfully.",
    date: "2026-11-22T02:00:00",
    status: "Resolved",
    environment: "Production",
    reference_id: "SYS-2026-006",
  },
  {
    id: 7,
    event: "Email Delivery Delay",
    service: "Notification Service",
    severity: "Error",
    description: "Email notification delivery was unsuccessful.",
    date: "2026-11-21T11:20:00",
    status: "Investigating",
    environment: "Staging",
    reference_id: "SYS-2026-007",
  },
];

// Mengubah tanggal menjadi format yang mudah dibaca.
function format_date(date: string) {
  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Mengambil ikon berdasarkan tingkat keparahan.
function get_severity_icon(severity: log_severity) {
  switch (severity) {
    case "Info":
      return <Info size={15} />;
    case "Warning":
      return <AlertTriangle size={15} />;
    case "Error":
      return <AlertCircle size={15} />;
    case "Critical":
      return <AlertCircle size={15} />;
  }
}

// Mengambil warna Badge berdasarkan tingkat keparahan.
function get_severity_variant(severity: log_severity) {
  switch (severity) {
    case "Info":
      return "info";
    case "Warning":
      return "warning";
    case "Error":
      return "danger";
    case "Critical":
      return "danger";
  }
}

// Mengambil warna Badge berdasarkan status.
function get_status_variant(status: log_status) {
  switch (status) {
    case "Resolved":
      return "success";
    case "Investigating":
      return "warning";
    case "Active":
      return "danger";
  }
}

export default function SystemLogsPage() {
  const [logs] = useState<system_log[]>(initial_logs);

  const [search, set_search] = useState("");
  const [severity_filter, set_severity_filter] = useState("All");
  const [service_filter, set_service_filter] = useState("All");
  const [status_filter, set_status_filter] = useState("All");
  const [date_filter, set_date_filter] = useState("");

  const [selected_log, set_selected_log] =
    useState<system_log | null>(null);

  // Mengambil daftar service unik dari data log.
  const services = useMemo(
    () => [...new Set(logs.map((log) => log.service))],
    [logs]
  );

  // Memfilter data berdasarkan pencarian dan filter.
  const filtered_logs = useMemo(() => {
    return logs.filter((log) => {
      const search_match =
        log.event.toLowerCase().includes(search.toLowerCase()) ||
        log.service.toLowerCase().includes(search.toLowerCase()) ||
        log.description.toLowerCase().includes(search.toLowerCase()) ||
        log.reference_id.toLowerCase().includes(search.toLowerCase());

      const severity_match =
        severity_filter === "All" ||
        log.severity === severity_filter;

      const service_match =
        service_filter === "All" ||
        log.service === service_filter;

      const status_match =
        status_filter === "All" ||
        log.status === status_filter;

      const date_match =
        !date_filter || log.date.slice(0, 10) === date_filter;

      return (
        search_match &&
        severity_match &&
        service_match &&
        status_match &&
        date_match
      );
    });
  }, [
    logs,
    search,
    severity_filter,
    service_filter,
    status_filter,
    date_filter,
  ]);

  // Menghitung jumlah log berdasarkan severity.
  const total_logs = logs.length;

  const total_info = logs.filter(
    (log) => log.severity === "Info"
  ).length;

  const total_warning = logs.filter(
    (log) => log.severity === "Warning"
  ).length;

  const total_errors = logs.filter(
    (log) =>
      log.severity === "Error" ||
      log.severity === "Critical"
  ).length;

  // Mengunduh data log yang sudah difilter ke CSV.
  function export_csv() {
    const headers = [
      "Reference ID",
      "Event",
      "Service",
      "Severity",
      "Description",
      "Date",
      "Status",
      "Environment",
    ];

    const rows = filtered_logs.map((log) => [
      log.reference_id,
      log.event,
      log.service,
      log.severity,
      log.description,
      format_date(log.date),
      log.status,
      log.environment,
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
    link.download = "system_activity_logs.csv";
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
            <span>System Logs</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            System Activity Logs
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor system events, errors, warnings, and service activities.
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
              Total System Logs
            </p>
            <Activity className="text-blue-600" size={20} />
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {total_logs}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Recorded system events
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Informational
            </p>
            <Info className="text-blue-600" size={20} />
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {total_info}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Normal system events
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Warnings
            </p>
            <AlertTriangle className="text-yellow-600" size={20} />
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {total_warning}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Events requiring attention
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Errors & Critical
            </p>
            <AlertCircle className="text-red-600" size={20} />
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {total_errors}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Events requiring investigation
          </p>
        </div>
      </div>

      {/* System Logs Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 p-5 dark:border-gray-800">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                System Event History
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                A list of recent events recorded by the system.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="w-full sm:w-56">
                <Input
                  placeholder="Search system events..."
                  value={search}
                  onChange={(event) => set_search(event.target.value)}
                />
              </div>

              <select
                value={severity_filter}
                onChange={(event) => set_severity_filter(event.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="All">All Severity</option>
                <option value="Info">Info</option>
                <option value="Warning">Warning</option>
                <option value="Error">Error</option>
                <option value="Critical">Critical</option>
              </select>

              <select
                value={service_filter}
                onChange={(event) => set_service_filter(event.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="All">All Services</option>
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>

              <select
                value={status_filter}
                onChange={(event) => set_status_filter(event.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="All">All Status</option>
                <option value="Resolved">Resolved</option>
                <option value="Investigating">Investigating</option>
                <option value="Active">Active</option>
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
                <th className="px-5 py-4 font-semibold">Event</th>
                <th className="px-5 py-4 font-semibold">Service</th>
                <th className="px-5 py-4 font-semibold">Severity</th>
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
                      {log.event}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {log.reference_id}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    <span className="inline-flex items-center gap-2">
                      <Server size={15} />
                      {log.service}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2">
                      {get_severity_icon(log.severity)}
                      <Badge variant={get_severity_variant(log.severity)}>
                        {log.severity}
                      </Badge>
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                    {format_date(log.date)}
                  </td>

                  <td className="px-5 py-4">
                    <Badge variant={get_status_variant(log.status)}>
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
                    No system logs found.
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
          Showing {filtered_logs.length} of {total_logs} system logs
        </div>
      </div>

      {/* System Log Detail Modal */}
      <Modal
        is_open={!!selected_log}
        on_close={() => set_selected_log(null)}
        title="System Log Details"
        description="Detailed information about this system event."
        size="md"
      >
        {selected_log && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Severity
              </span>
              <Badge variant={get_severity_variant(selected_log.severity)}>
                {selected_log.severity}
              </Badge>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <p className="font-semibold text-gray-900 dark:text-white">
                {selected_log.event}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {selected_log.reference_id}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Service</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {selected_log.service}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Environment</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {selected_log.environment}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Date & Time</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {format_date(selected_log.date)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1">
                  <Badge variant={get_status_variant(selected_log.status)}>
                    {selected_log.status}
                  </Badge>
                </div>
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
