
"use client";

import { useEffect, useState } from "react";

import {
  PanelLeftClose,
  PanelLeftOpen,
  Moon,
  Sun,
  Search,
  Bell,
  ChevronRight,
  ChevronDown,
  Globe,
} from "lucide-react";

import AdminSidebar from "./admin_sidebar";

type admin_role = "admin" | "super_admin";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mengatur mode Light dan Dark
  const [dark_mode, set_dark_mode] = useState(false);
  const [theme_loaded, set_theme_loaded] = useState(false);

  // Mengatur role yang sedang digunakan
  const [current_role, set_current_role] =
    useState<admin_role>("super_admin");

  // Mengatur permission menu untuk role Admin
  const [admin_permissions, set_admin_permissions] = useState<string[]>([
    "user_management",
    "business_management",
    "company_verification",
    "product_management",
    "category_management",
    "rfq_management",
    "quotation_monitoring",
    "order_monitoring",
    "shipment_monitoring",
    "trade_center",
    "reports",
    "activity_logs",
  ]);

  // Mengatur lebar Sidebar
  const [sidebar_collapsed, set_sidebar_collapsed] = useState(false);

  // Mengambil tema yang tersimpan di browser
  useEffect(() => {
    const saved_theme = localStorage.getItem("admin_theme");

    if (saved_theme === "dark") {
      set_dark_mode(true);
    }

    set_theme_loaded(true);
  }, []);

  // Menyimpan tema dan mengatur class dark pada HTML
  useEffect(() => {
    if (!theme_loaded) return;

    localStorage.setItem("admin_theme", dark_mode ? "dark" : "light");

    document.documentElement.classList.toggle("dark", dark_mode);
  }, [dark_mode, theme_loaded]);

  // Mengubah tema Light dan Dark
  function toggle_theme() {
    set_dark_mode((current) => !current);
  }

  // Mengecilkan dan melebarkan Sidebar
  function toggle_sidebar() {
    set_sidebar_collapsed((current) => !current);
  }

  // Mengubah role Admin dan Super Admin
  function toggle_role() {
    set_current_role((current) =>
      current === "super_admin" ? "admin" : "super_admin"
    );
  }

  // Mengubah permission Admin
  function toggle_permission(permission: string) {
    set_admin_permissions((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission]
    );
  }

  return (
    <div
      className={`flex min-h-screen ${
        dark_mode ? "dark bg-gray-950" : "bg-gray-100"
      }`}
    >
      {/* Sidebar */}
      <AdminSidebar
        role={current_role}
        permissions={admin_permissions}
        dark_mode={dark_mode}
        collapsed={sidebar_collapsed}
      />

      {/* Bagian utama dashboard */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-5 dark:border-gray-800 dark:bg-gray-900">

          {/* Bagian kiri: Drawer dan Breadcrumb */}
          <div className="flex items-center gap-5">

            {/* Tombol Sidebar */}
            <button
              type="button"
              onClick={toggle_sidebar}
              title={
                sidebar_collapsed
                  ? "Lebarkan Sidebar"
                  : "Kecilkan Sidebar"
              }
              className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {sidebar_collapsed ? (
                <PanelLeftOpen size={20} />
              ) : (
                <PanelLeftClose size={20} />
              )}
            </button>

            {/* Breadcrumb */}
            <div className="hidden items-center gap-2 text-sm sm:flex">
              <span className="text-gray-400 dark:text-gray-500">
                Workspace
              </span>

              <ChevronRight
                size={15}
                className="text-gray-400"
              />

              <span className="font-medium text-gray-800 dark:text-white">
                Overview
              </span>
            </div>
          </div>

          {/* Bagian kanan Header */}
          <div className="flex items-center gap-3">

            {/* Search Bar */}
            <div className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 md:flex dark:border-gray-700 dark:bg-gray-800">
              <Search
                size={16}
                className="text-gray-400"
              />

              <input
                type="text"
                placeholder="Search anything..."
                className="w-36 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200"
              />

              <span className="rounded border border-gray-200 px-1.5 py-0.5 text-xs text-gray-400 dark:border-gray-600">
                /
              </span>
            </div>

            {/* Language */}
            <button
              type="button"
              className="hidden items-center gap-1 rounded-lg px-2 py-2 text-sm text-gray-600 transition hover:bg-gray-100 sm:flex dark:text-gray-300 dark:hover:bg-gray-800"
              title="Language"
            >
              <Globe size={16} />
              EN
              <ChevronDown size={13} />
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggle_theme}
              title={dark_mode ? "Light Mode" : "Dark Mode"}
              className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {dark_mode ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>

            {/* Notification */}
            <button
              type="button"
              title="Notifications"
              className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Bell size={19} />

              {/* Indikator notifikasi */}
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 border-l border-gray-200 pl-3 dark:border-gray-700">

              {/* Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                AM
              </div>

              {/* Informasi Profile */}
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  Alex Morgan
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Platform Admin
                </p>
              </div>

              <ChevronDown
                size={15}
                className="hidden text-gray-400 lg:block"
              />
            </div>
          </div>
        </header>

        {/* Konten halaman */}
        <main className="flex-1 p-6 text-gray-800 dark:text-gray-100">
          {children}

          {/* Panel sementara untuk menguji permission Admin */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

            <h2 className="mb-3 font-semibold text-gray-800 dark:text-white">
              Permission Testing
            </h2>

            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Panel sementara untuk menguji menu berdasarkan permission Admin.
            </p>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {[
                ["user_management", "User Management"],
                ["business_management", "Business Management"],
                ["company_verification", "Company Verification"],
                ["product_management", "Product Management"],
                ["category_management", "Category Management"],
                ["rfq_management", "RFQ Management"],
                ["quotation_monitoring", "Quotation Monitoring"],
                ["order_monitoring", "Order Monitoring"],
                ["shipment_monitoring", "Shipment Monitoring"],
                ["trade_center", "Trade Center"],
                ["reports", "Reports"],
                ["activity_logs", "Activity Logs"],
              ].map(([permission, label]) => (
                <label
                  key={permission}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={admin_permissions.includes(permission)}
                    onChange={() => toggle_permission(permission)}
                    className="h-4 w-4 accent-blue-600"
                  />

                  {label}
                </label>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
