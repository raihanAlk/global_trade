
"use client";

import { AdminProvider } from "../context/admin_context";
import ComingSoonPage from "@/src/modules/admin/pages/coming_soon";
import { admin_permission_list } from "@/src/modules/admin/config/admin_permissions";
import { get_admin_menu } from "../config/admin_menu";
import type { admin_role } from "../context/admin_context";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

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

const default_admin_permissions = admin_permission_list.map(
  (permission) => permission.key
);
const API = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

type AdminShellProps = {
  children: React.ReactNode;
  role?: "admin" | "super_admin";
};

export default function AdminShell({
  children,
  role = "admin",
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Mengatur mode Light dan Dark.
  const [dark_mode, set_dark_mode] = useState(false);
  const [theme_loaded, set_theme_loaded] = useState(false);
  // Login connection is temporarily disabled:
  // the admin shell renders the dashboard without requiring a token.
  const [auth_checked, set_auth_checked] = useState(true);
  const [auth_valid, set_auth_valid] = useState(true);

  // Role aktif, bisa diinisialisasi dari props atau default admin.
  const [current_role] = useState<admin_role>(role);

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
    let cancelled = false;

    Promise.resolve().then(() => {
      if (cancelled) return;

      set_dark_mode(localStorage.getItem("globaltrade_admin_theme") === "dark");
      set_theme_loaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  

  // Menyimpan tema dan mengatur class dark pada HTML.
  useEffect(() => {
    if (!theme_loaded) return;

    localStorage.setItem("globaltrade_admin_theme", dark_mode ? "dark" : "light");

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

  async function logout() {
    const token = sessionStorage.getItem("gth_admin_token");

    try {
      if (token) {
        const response = await fetch(`${API}/v1/auth/logout`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Logout gagal (${response.status}).`);
        }
      }
    } catch (error) {
      console.error("Admin logout request failed:", error);
    } finally {
      sessionStorage.removeItem("gth_admin_token");
      router.replace("/");
    }
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

  if (!auth_checked || !auth_valid) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 text-sm text-gray-500">
        Memeriksa sesi admin...
      </main>
    );
  }

  return (
    <AdminProvider
      current_role={current_role}
      admin_permissions={admin_permissions}
      toggle_permission={toggle_permission}
    >
      <div
        className={`flex min-h-screen ${
          dark_mode ? "dark bg-gray-950" : "bg-slate-100"
        }`}
      >
        {/* Sidebar */}
        <AdminSidebar
          role={current_role}
          permissions={active_permissions}
          dark_mode={dark_mode}
          collapsed={sidebar_collapsed}
          on_logout={logout}
        />

        {/* Bagian utama dashboard */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="flex h-10 items-center justify-between border-b border-gray-200 bg-white px-3 dark:border-gray-800 dark:bg-gray-900 lg:h-14 xl:h-20 xl:px-6">

            {/* Bagian kiri: Sidebar dan Breadcrumb */}
            <div className="flex min-w-0 items-center gap-2.5 xl:gap-4">

              {/* Tombol Sidebar */}
              <button
                type="button"
                onClick={toggle_sidebar}
                title={
                  sidebar_collapsed
                    ? "Lebarkan Sidebar"
                    : "Kecilkan Sidebar"
                }
                className="shrink-0 rounded-md p-1.5 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 xl:p-2"
              >
                {sidebar_collapsed ? (
                  <PanelLeftOpen size={16} className="xl:h-5 xl:w-5" />
                ) : (
                  <PanelLeftClose size={16} className="xl:h-5 xl:w-5" />
                )}
              </button>

              {/* Dynamic Breadcrumb */}
              <nav
                aria-label="Breadcrumb"
                className="hidden min-w-0 items-center gap-1.5 overflow-hidden text-[10px] sm:flex lg:gap-2.5 lg:text-xs xl:gap-3 xl:text-sm"
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
                          size={12}
                          className="shrink-0 text-gray-400 xl:h-4 xl:w-4"
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
            <div className="flex shrink-0 items-center gap-1.5 xl:gap-3">

              {/* Search Bar */}
              <div className="hidden items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 md:flex dark:border-gray-700 dark:bg-gray-800 lg:gap-2 lg:px-3 lg:py-1.5 xl:gap-2 xl:px-3 xl:py-2">
                <Search size={14} className="text-gray-400 lg:h-4 lg:w-4 xl:h-[18px] xl:w-[18px]" />

                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-28 bg-transparent text-[10px] text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200 lg:w-36 lg:text-xs xl:w-48 xl:text-sm"
                />

                <span className="rounded border border-gray-200 px-1 py-0.5 text-[9px] text-gray-400 dark:border-gray-600 xl:px-1.5 xl:py-1 xl:text-xs">
                  /
                </span>
              </div>

              {/* Language */}
              <button
                type="button"
                className="hidden items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-gray-600 transition hover:bg-gray-100 sm:flex dark:text-gray-300 dark:hover:bg-gray-800 lg:gap-1.5 lg:px-2 lg:py-1.5 lg:text-xs xl:gap-2 xl:px-2 xl:py-2 xl:text-sm"
                title="Language"
              >
                <Globe size={13} className="lg:h-4 lg:w-4 xl:h-[18px] xl:w-[18px]" />
                EN
                <ChevronDown size={11} className="lg:h-3.5 lg:w-3.5 xl:h-4 xl:w-4" />
              </button>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggle_theme}
                title={dark_mode ? "Light Mode" : "Dark Mode"}
                className="rounded-md p-1.5 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 xl:p-2"
              >
                {dark_mode ? (
                  <Sun size={16} className="xl:h-5 xl:w-5" />
                ) : (
                  <Moon size={16} className="xl:h-5 xl:w-5" />
                )}
              </button>

              {/* Notification */}
              <button
                type="button"
                title="Notifications"
                className="relative rounded-md p-1.5 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 xl:p-2"
              >
                <Bell size={16} className="xl:h-5 xl:w-5" />

                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative border-l border-gray-200 pl-2 dark:border-gray-700 xl:pl-4">

                {/* Profile Trigger */}
                <button
                  type="button"
                  onClick={() => set_profile_open((current) => !current)}
                  aria-expanded={profile_open}
                  title="Profile"
                  className="flex items-center gap-1.5 rounded-md p-1 transition hover:bg-gray-100 dark:hover:bg-gray-800 xl:gap-3 xl:p-1.5"
                >
                  {/* Avatar */}
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[9px] font-semibold text-white lg:h-8 lg:w-8 lg:text-xs xl:h-10 xl:w-10 xl:text-sm">
                    AM
                  </div>

                  {/* Informasi Profile */}
                  <div className="hidden text-left md:block">
                    <p className="text-[10px] font-semibold text-gray-800 dark:text-white lg:text-xs xl:text-sm">
                      Alex Morgan
                    </p>

                    <p className="text-[9px] text-gray-500 dark:text-gray-400 lg:text-[10px] xl:text-xs">
                      {current_role === "super_admin"
                        ? "Super Administrator"
                        : "Administrator"}
                    </p>
                  </div>

                  <ChevronDown
                    size={12}
                    className={`hidden text-gray-400 transition-transform md:block ${
                      profile_open ? "rotate-180" : ""
                    } lg:h-3.5 lg:w-3.5 xl:h-4 xl:w-4`}
                  />
                </button>

                {/* Profile Menu */}
                {profile_open && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900 xl:w-64">

                    <div className="border-b border-gray-100 px-3 py-2.5 dark:border-gray-800 xl:px-4 xl:py-3">
                      <p className="text-xs font-semibold text-gray-800 dark:text-white lg:text-sm">
                        Alex Morgan
                      </p>

                      <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400 lg:text-xs">
                        {current_role === "super_admin"
                          ? "Super Administrator"
                          : "Administrator"}
                      </p>
                    </div>

                    <div className="p-1.5 xl:p-2">
                      <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-gray-700 dark:text-gray-300 lg:gap-3 lg:px-3 lg:py-2.5 lg:text-sm">
                        <UserRound size={14} className="xl:h-[18px] xl:w-[18px]" />
                        My Profile
                      </div>

                      <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-gray-700 dark:text-gray-300 lg:gap-3 lg:px-3 lg:py-2.5 lg:text-sm">
                        <Settings size={14} className="xl:h-[18px] xl:w-[18px]" />
                        Account Settings
                      </div>

                      <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

                      <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-red-600 dark:text-red-400 lg:gap-3 lg:px-3 lg:py-2.5 lg:text-sm"
                      >
                        <LogOut size={14} className="xl:h-[18px] xl:w-[18px]" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Konten Halaman */}
          <main className="flex-1 p-4 text-gray-800 dark:text-gray-100 xl:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
