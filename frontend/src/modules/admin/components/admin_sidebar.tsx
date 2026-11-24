
"use client";

import { useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Building2,
  Package,
  Tags,
  FileText,
  ClipboardList,
  Truck,
  MessageSquare,
  BarChart3,
  Activity,
  Settings,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  UserCog,
  FileCheck,
  FolderKanban,
} from "lucide-react";

import { get_admin_menu } from "../config/admin_menu";

type admin_sidebar_props = {
  role: "admin" | "super_admin";
  permissions: string[];
  dark_mode: boolean;
  collapsed: boolean;
};

// Icon untuk setiap menu utama.
const menu_icons: Record<string, ElementType> = {
  dashboard: LayoutDashboard,
  admin_management: ShieldCheck,
  user_management: Users,
  business_management: Building2,
  company_verification: FileCheck,
  product_management: Package,
  category_management: Tags,
  rfq_management: FileText,
  quotation_management: ClipboardList,
  quotation_monitoring: ClipboardList,
  order_management: FolderKanban,
  order_monitoring: FolderKanban,
  shipment_management: Truck,
  shipment_monitoring: Truck,
  chat_monitoring: MessageSquare,
  trade_center: Building2,
  reports_analytics: BarChart3,
  reports: BarChart3,
  activity_logs: Activity,
  role_permissions: UserCog,
  system_settings: Settings,
  my_profile: User,
  logout: LogOut,
};

// Icon untuk submenu.
const submenu_icons: Record<string, ElementType> = {
  all_users: Users,
  all_businesses: Building2,
  pending_verification: FileCheck,
  all_products: Package,
  all_categories: Tags,
  all_rfq: FileText,
  all_quotations: ClipboardList,
  all_orders: FolderKanban,
  all_shipments: Truck,
};

export default function AdminSidebar({
  role,
  permissions,
  dark_mode,
  collapsed,
}: admin_sidebar_props) {
  const pathname = usePathname();

  // Menyimpan submenu yang sedang terbuka.
  const [expanded_menu, set_expanded_menu] = useState<string | null>(null);

  // Mengambil menu berdasarkan role dan permission.
  const menu_items = useMemo(
    () => get_admin_menu(role, permissions),
    [role, permissions]
  );

  // Memeriksa apakah URL cocok dengan halaman atau turunannya.
  function is_path_active(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  // Otomatis membuka submenu sesuai halaman yang sedang diakses.
  useEffect(() => {
    const active_parent = menu_items.find((item) =>
      item.children?.some(
        (child) => child.href && is_path_active(child.href)
      )
    );

    set_expanded_menu(active_parent?.key ?? null);
  }, [pathname, menu_items]);

  // Membuka atau menutup submenu secara manual.
  function toggle_menu(menu_key: string) {
    set_expanded_menu((current) =>
      current === menu_key ? null : menu_key
    );
  }

  // Mengatur warna sidebar berdasarkan tema.
  const sidebar_theme = dark_mode
    ? "border-gray-800 bg-gray-900 text-gray-200"
    : "border-gray-200 bg-white text-gray-700";

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } ${sidebar_theme} flex min-h-screen shrink-0 flex-col border-r transition-all duration-300`}
    >
      {/* Brand Sidebar */}
      <div
        className={`flex h-16 items-center border-b ${
          dark_mode ? "border-gray-800" : "border-gray-200"
        } ${collapsed ? "justify-center px-2" : "px-5"}`}
      >
        {collapsed ? (
          <span className="text-xl font-bold text-blue-600">GT</span>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-blue-600">
              GlobalTrade Hub
            </h2>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {role === "super_admin"
                ? "Super Administrator"
                : "Administrator"}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menu_items.map((item) => {
          const Icon = menu_icons[item.key] || LayoutDashboard;

          const has_children =
            !!item.children && item.children.length > 0;

          const is_child_active = item.children?.some(
            (child) =>
              child.href && is_path_active(child.href)
          );

          const is_active =
            (!!item.href && is_path_active(item.href)) ||
            !!is_child_active;

          const is_expanded = expanded_menu === item.key;

          // Menu yang memiliki submenu.
          if (has_children) {
            return (
              <div key={item.key}>
                <button
                  type="button"
                  onClick={() => toggle_menu(item.key)}
                  title={collapsed ? item.label : undefined}
                  className={`flex w-full items-center rounded-lg py-2.5 text-sm transition ${
                    collapsed
                      ? "justify-center px-2"
                      : "justify-between px-3"
                  } ${
                    is_active
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : dark_mode
                        ? "text-gray-300 hover:bg-gray-800"
                        : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={19} />

                    {!collapsed && <span>{item.label}</span>}
                  </span>

                  {!collapsed &&
                    (is_expanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    ))}
                </button>

                {/* Daftar submenu */}
                {!collapsed && is_expanded && (
                  <div className="ml-5 mt-1 space-y-1 border-l border-gray-200 pl-3 dark:border-gray-700">
                    {item.children?.map((child) => {
                      // Lewati submenu yang belum memiliki URL.
                      if (!child.href) return null;

                      const ChildIcon =
                        submenu_icons[child.key] || FileText;

                      const child_active = is_path_active(child.href);

                      return (
                        <Link
                          key={child.key}
                          href={child.href}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                            child_active
                              ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                              : dark_mode
                                ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          }`}
                        >
                          <ChildIcon size={16} />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Menu tanpa submenu.
          if (item.href) {
            return (
              <Link
                key={item.key}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center rounded-lg py-2.5 text-sm transition ${
                  collapsed
                    ? "justify-center px-2"
                    : "gap-3 px-3"
                } ${
                  is_active
                    ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : dark_mode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={19} />

                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          }

          // Menu tanpa URL dan tanpa submenu tidak ditampilkan.
          return null;
        })}
      </nav>

      {/* Footer Sidebar */}
      <div
        className={`border-t p-4 ${
          dark_mode ? "border-gray-800" : "border-gray-200"
        } ${collapsed ? "flex justify-center" : ""}`}
      >
        {collapsed ? (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
            title={
              role === "super_admin" ? "Super Admin" : "Admin"
            }
          >
            A
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold">
              {role === "super_admin"
                ? "Super Admin"
                : "Administrator"}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              GlobalTrade Hub
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
