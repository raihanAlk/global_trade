
"use client";

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

import UserSidebar from "./user_sidebar";

type UserShellProps = {
  children: React.ReactNode;
};

export default function UserShell({ children }: UserShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Mengatur Light Mode dan Dark Mode.
  const [dark_mode, set_dark_mode] = useState(false);
  const [theme_loaded, set_theme_loaded] = useState(false);

  // Mengatur lebar Sidebar.
  const [sidebar_collapsed, set_sidebar_collapsed] = useState(false);

  // Mengatur dropdown Profile.
  const [profile_open, set_profile_open] = useState(false);

  // Mengambil tema yang tersimpan di browser.
  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(() => {
      if (cancelled) return;

      set_dark_mode(
        localStorage.getItem("globaltrade_user_theme") === "dark"
      );

      set_theme_loaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Menyimpan tema dan mengatur class dark pada HTML.
  useEffect(() => {
    if (!theme_loaded) return;

    localStorage.setItem(
      "globaltrade_user_theme",
      dark_mode ? "dark" : "light"
    );

    document.documentElement.classList.toggle("dark", dark_mode);
  }, [dark_mode, theme_loaded]);

  // Mengubah tema.
  function toggle_theme() {
    set_dark_mode((current) => !current);
  }

  // Mengecilkan dan melebarkan Sidebar.
  function toggle_sidebar() {
    set_sidebar_collapsed((current) => !current);
  }

  // Logout sementara: kembali ke halaman utama.
  function logout() {
    router.replace("/");
  }

  // Membuat breadcrumb berdasarkan URL.
  const breadcrumbs = useMemo(() => {
    const normalized_path = pathname.replace(/\/$/, "") || "/";

    function format_segment(segment: string) {
      return decodeURIComponent(segment)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
    }

    const path_segments = normalized_path
      .split("/")
      .filter(Boolean)
      .filter((segment) => segment !== "user");

    return [
      { label: "Workspace" },
      ...path_segments.map((segment) => ({
        label: format_segment(segment),
      })),
    ];
  }, [pathname]);


return (
  <div
    className={`flex min-h-screen ${
      dark_mode ? "dark bg-gray-950" : "bg-slate-100"
    }`}
  >
    {/* Sidebar */}
    <UserSidebar
      dark_mode={dark_mode}
      collapsed={sidebar_collapsed}
    />

    {/* Main Dashboard */}
    <div className="flex min-w-0 flex-1 flex-col">
      {/* Header */}
      <header className="flex h-10 items-center justify-between border-b border-gray-200 bg-white px-3 dark:border-gray-800 dark:bg-gray-900 lg:h-14 xl:h-20 xl:px-6">

        {/* Bagian Kiri */}
        <div className="flex min-w-0 items-center gap-2.5 xl:gap-4">
          {/* Sidebar Toggle */}
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

          {/* Breadcrumb */}
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

        {/* Bagian Kanan */}
        <div className="flex shrink-0 items-center gap-1.5 xl:gap-3">
          {/* Search */}
          <div className="hidden items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 md:flex dark:border-gray-700 dark:bg-gray-800 lg:gap-2 lg:px-3 lg:py-1.5 xl:px-3 xl:py-2">
            <Search size={14} className="text-gray-400" />

            <input
              type="text"
              placeholder="Search anything..."
              className="w-28 bg-transparent text-[10px] text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200 lg:w-36 lg:text-xs xl:w-48 xl:text-sm"
            />

            <span className="rounded border border-gray-200 px-1 py-0.5 text-[9px] text-gray-400 dark:border-gray-600">
              /
            </span>
          </div>

          {/* Language */}
          <button
            type="button"
            className="hidden items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-gray-600 transition hover:bg-gray-100 sm:flex dark:text-gray-300 dark:hover:bg-gray-800 lg:gap-1.5 lg:px-2 lg:py-1.5 lg:text-xs xl:gap-2 xl:px-2 xl:py-2 xl:text-sm"
            title="Language"
          >
            <Globe size={13} />
            EN
            <ChevronDown size={11} />
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggle_theme}
            title={dark_mode ? "Light Mode" : "Dark Mode"}
            className="rounded-md p-1.5 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 xl:p-2"
          >
            {dark_mode ? (
              <Sun size={16} />
            ) : (
              <Moon size={16} />
            )}
          </button>

          {/* Notification */}
          <button
            type="button"
            onClick={() => router.push("/user/notifications")}
            title="Notifications"
            className="relative rounded-md p-1.5 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 xl:p-2"
          >
            <Bell size={16} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative border-l border-gray-200 pl-2 dark:border-gray-700 xl:pl-4">
            <button
              type="button"
              onClick={() => set_profile_open((current) => !current)}
              aria-expanded={profile_open}
              title="Profile"
              className="flex items-center gap-1.5 rounded-md p-1 transition hover:bg-gray-100 dark:hover:bg-gray-800 xl:gap-3 xl:p-1.5"
            >
              {/* Avatar */}
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[9px] font-semibold text-white lg:h-8 lg:w-8 lg:text-xs xl:h-10 xl:w-10 xl:text-sm">
                US
              </div>

              {/* User Information */}
              <div className="hidden text-left md:block">
                <p className="text-[10px] font-semibold text-gray-800 dark:text-white lg:text-xs xl:text-sm">
                  User Account
                </p>

                <p className="text-[9px] text-gray-500 dark:text-gray-400 lg:text-[10px] xl:text-xs">
                  Member
                </p>
              </div>

              <ChevronDown
                size={12}
                className={`hidden text-gray-400 transition-transform md:block ${
                  profile_open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Content */}
            {profile_open && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900 xl:w-64">
                <div className="border-b border-gray-100 px-3 py-2.5 dark:border-gray-800 xl:px-4 xl:py-3">
                  <p className="text-xs font-semibold text-gray-800 dark:text-white lg:text-sm">
                    User Account
                  </p>

                  <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400 lg:text-xs">
                    Member
                  </p>
                </div>

                <div className="p-1.5 xl:p-2">
                  <button
                    type="button"
                    onClick={() => router.push("/user/profile")}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:gap-3 lg:px-3 lg:py-2.5 lg:text-sm"
                  >
                    <UserRound size={14} />
                    My Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/user/settings")}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:gap-3 lg:px-3 lg:py-2.5 lg:text-sm"
                  >
                    <Settings size={14} />
                    Settings
                  </button>

                  <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950 lg:gap-3 lg:px-3 lg:py-2.5 lg:text-sm"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 p-4 text-gray-800 dark:text-gray-100 xl:p-8">
        {children}
      </main>
    </div>
  </div>
);
}