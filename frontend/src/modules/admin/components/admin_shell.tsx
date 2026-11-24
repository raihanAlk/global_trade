
"use client";

import { AdminProvider } from "../context/admin_context";
import { admin_permission_list } from "../config/admin_permissions";
import { get_admin_menu } from "../config/admin_menu";
import type { admin_role } from "../context/admin_context";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

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
  UserRound,
  Settings,
  LogOut,
} from "lucide-react";

import AdminSidebar from "./admin_sidebar";

// Permission awal untuk role Admin.
const default_admin_permissions = [
  "user_management.view",
  "business_management.view",
  "product_management.view",
  "role_permissions.view",
];

type breadcrumb_item = {
  label: string;
  href?: string;
};

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Mengatur mode Light dan Dark.
  const [dark_mode, set_dark_mode] = useState(false);
  const [theme_loaded, set_theme_loaded] = useState(false);

  // Role sementara selama backend belum terhubung.
  // Nantinya role akan diambil dari akun yang login.
  const [current_role] = useState<admin_role>("super_admin");

  // Menyimpan permission khusus Admin.
  const [admin_permissions, set_admin_permissions] = useState<string[]>(
    default_admin_permissions
  );

  // Mengatur lebar Sidebar.
  const [sidebar_collapsed, set_sidebar_collapsed] = useState(false);

  // Mengatur dropdown Profile.
  const [profile_open, set_profile_open] = useState(false);

  // Mengambil tema yang tersimpan di browser.
  useEffect(() => {
    const saved_theme = localStorage.getItem("admin_theme");

    if (saved_theme === "dark") {
      set_dark_mode(true);
    }

    set_theme_loaded(true);
  }, []);

  // Menyimpan tema dan mengatur class dark pada HTML.
  useEffect(() => {
    if (!theme_loaded) return;

    localStorage.setItem("admin_theme", dark_mode ? "dark" : "light");

    document.documentElement.classList.toggle("dark", dark_mode);
  }, [dark_mode, theme_loaded]);

  // Mengubah tema Light dan Dark.
  function toggle_theme() {
    set_dark_mode((current) => !current);
  }

  // Mengecilkan dan melebarkan Sidebar.
  function toggle_sidebar() {
    set_sidebar_collapsed((current) => !current);
  }

  // Mengubah permission khusus Admin.
  function toggle_permission(permission: string) {
    set_admin_permissions((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission]
    );
  }

  // Permission untuk Super Admin.
  const super_admin_permissions = useMemo(
    () => admin_permission_list.map((permission) => permission.key),
    []
  );

  // Permission yang digunakan mengikuti role aktif.
  const active_permissions =
    current_role === "super_admin"
      ? super_admin_permissions
      : admin_permissions;

  // Mengambil menu berdasarkan role dan permission.
  const menu_items = useMemo(
    () => get_admin_menu(current_role, active_permissions),
    [current_role, active_permissions]
  );

  // Membuat breadcrumb berdasarkan URL dan konfigurasi menu.
  const breadcrumbs = useMemo(() => {
    const normalized_path = pathname.replace(/\/$/, "") || "/";

    // Memeriksa apakah URL sama atau merupakan halaman turunan.
    function matches_path(href: string) {
      const normalized_href = href.replace(/\/$/, "") || "/";

      return (
        normalized_path === normalized_href ||
        normalized_path.startsWith(`${normalized_href}/`)
      );
    }

    // Mengubah URL tambahan menjadi label yang mudah dibaca.
    function format_segment(segment: string) {
      return decodeURIComponent(segment)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
    }

    // Mencari menu dan submenu yang cocok dengan URL.
    for (const item of menu_items) {
      if (item.href && matches_path(item.href)) {
        const extra_path = normalized_path
          .slice(item.href.replace(/\/$/, "").length)
          .split("/")
          .filter(Boolean);

        return [
          { label: "Workspace" },
          { label: item.label, href: item.href },
          ...extra_path.map((segment) => ({
            label: format_segment(segment),
          })),
        ];
      }

      const active_child = item.children?.find(
        (child) => child.href && matches_path(child.href)
      );

      if (active_child?.href) {
        const extra_path = normalized_path
          .slice(active_child.href.replace(/\/$/, "").length)
          .split("/")
          .filter(Boolean);

        return [
          { label: "Workspace" },
          { label: item.label },
          {
            label: active_child.label,
            href: active_child.href,
          },
          ...extra_path.map((segment) => ({
            label: format_segment(segment),
          })),
        ];
      }
    }

    // Fallback jika URL belum terdaftar di konfigurasi menu.
    const path_segments = normalized_path
      .split("/")
      .filter(Boolean);

    return [
      { label: "Workspace" },
      ...path_segments
        .filter((segment) => segment !== "admin")
        .map((segment) => ({
          label: format_segment(segment),
        })),
    ];
  }, [pathname, menu_items]);

  return (
    <AdminProvider
      current_role={current_role}
      admin_permissions={admin_permissions}
      toggle_permission={toggle_permission}
    >
      <div
        className={`flex min-h-screen ${
          dark_mode ? "dark bg-gray-950" : "bg-gray-100"
        }`}
      >
        {/* Sidebar */}
        <AdminSidebar
          role={current_role}
          permissions={active_permissions}
          dark_mode={dark_mode}
          collapsed={sidebar_collapsed}
        />

        {/* Bagian utama dashboard */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-5 dark:border-gray-800 dark:bg-gray-900">

            {/* Bagian kiri: Sidebar dan Breadcrumb */}
            <div className="flex min-w-0 items-center gap-5">

              {/* Tombol Sidebar */}
              <button
                type="button"
                onClick={toggle_sidebar}
                title={
                  sidebar_collapsed
                    ? "Lebarkan Sidebar"
                    : "Kecilkan Sidebar"
                }
                className="shrink-0 rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {sidebar_collapsed ? (
                  <PanelLeftOpen size={20} />
                ) : (
                  <PanelLeftClose size={20} />
                )}
              </button>

              {/* Dynamic Breadcrumb */}
              <nav
                aria-label="Breadcrumb"
                className="hidden min-w-0 items-center gap-2 overflow-hidden text-sm sm:flex"
              >
                {breadcrumbs.map((item, index) => {
                  const is_last = index === breadcrumbs.length - 1;

                  return (
                    <div
                      key={`${item.label}-${index}`}
                      className="flex min-w-0 shrink-0 items-center gap-2"
                    >
                      {index > 0 && (
                        <ChevronRight
                          size={15}
                          className="shrink-0 text-gray-400"
                        />
                      )}

                      <span
                        title={item.label}
                        aria-current={is_last ? "page" : undefined}
                        className={`truncate ${
                          is_last
                            ? "font-semibold text-gray-800 dark:text-white"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Bagian kanan Header */}
            <div className="flex shrink-0 items-center gap-3">

              {/* Search Bar */}
              <div className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 md:flex dark:border-gray-700 dark:bg-gray-800">
                <Search size={16} className="text-gray-400" />

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

                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative border-l border-gray-200 pl-3 dark:border-gray-700">

                {/* Profile Trigger */}
                <button
                  type="button"
                  onClick={() => set_profile_open((current) => !current)}
                  aria-expanded={profile_open}
                  title="Profile"
                  className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {/* Avatar */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                    AM
                  </div>

                  {/* Informasi Profile */}
                  <div className="hidden text-left lg:block">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      Alex Morgan
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {current_role === "super_admin"
                        ? "Super Administrator"
                        : "Administrator"}
                    </p>
                  </div>

                  <ChevronDown
                    size={15}
                    className={`hidden text-gray-400 transition-transform lg:block ${
                      profile_open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Menu */}
                {profile_open && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">

                    <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        Alex Morgan
                      </p>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {current_role === "super_admin"
                          ? "Super Administrator"
                          : "Administrator"}
                      </p>
                    </div>

                    <div className="p-1.5">
                      <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                        <UserRound size={16} />
                        My Profile
                      </div>

                      <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                        <Settings size={16} />
                        Account Settings
                      </div>

                      <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

                      <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 dark:text-red-400">
                        <LogOut size={16} />
                        Logout
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Konten Halaman */}
          <main className="flex-1 p-6 text-gray-800 dark:text-gray-100">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
