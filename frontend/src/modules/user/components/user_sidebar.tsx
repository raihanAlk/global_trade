
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, LayoutDashboard } from "lucide-react";

import { userMenu } from "../config/user_menu";

type UserSidebarProps = {
  dark_mode: boolean;
  collapsed: boolean;
};

export default function UserSidebar({
  dark_mode,
  collapsed,
}: UserSidebarProps) {
  const pathname = usePathname();
  const [expanded_menu, set_expanded_menu] = useState<string | null>(null);

  // Memeriksa apakah URL sedang aktif.
  function is_path_active(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  // Membuka grup menu sesuai halaman yang sedang diakses.
  useEffect(() => {
    const active_parent = userMenu.find((item) =>
      item.children?.some(
        (child) => child.href && is_path_active(child.href)
      )
    );

    set_expanded_menu(active_parent?.title ?? null);
  }, [pathname]);

  // Membuka atau menutup grup menu.
  function toggle_menu(menu_title: string) {
    set_expanded_menu((current) =>
      current === menu_title ? null : menu_title
    );
  }

  const sidebar_theme = dark_mode
    ? "border-gray-800 bg-gray-900 text-gray-200"
    : "border-gray-200 bg-white text-gray-700";

  return (
    <aside
      className={`${
        collapsed ? "w-14 min-w-14" : "w-[20vw] min-w-[160px] max-w-[320px]"
      } ${sidebar_theme} flex min-h-screen shrink-0 flex-col border-r transition-all duration-300`}
    >
      {/* Brand */}
      <div
        className={`flex h-10 items-center border-b lg:h-14 xl:h-20 ${
          dark_mode ? "border-gray-800" : "border-gray-200"
        } ${collapsed ? "justify-center px-1" : "px-3 xl:px-5"}`}
      >
        {collapsed ? (
          <span className="text-lg font-bold text-blue-600">GT</span>
        ) : (
          <div>
            <h2 className="text-sm font-bold text-blue-600 lg:text-base xl:text-lg">
              GlobalTrade Hub
            </h2>
            <p className="text-[9px] text-gray-500 dark:text-gray-400 xl:text-xs">
              User Workspace
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-2 xl:py-4">
        {userMenu.map((item) => {
          const Icon = item.icon;
          const has_children =
            !!item.children && item.children.length > 0;

          const is_active = item.children?.some(
            (child) => child.href && is_path_active(child.href)
          );

          const is_expanded = expanded_menu === item.title;

          if (!has_children) return null;

          return (
            <div key={item.title}>
              <button
                type="button"
                onClick={() => toggle_menu(item.title)}
                title={collapsed ? item.title : undefined}
                className={`flex w-full items-center rounded-md py-2 text-[10px] transition lg:text-[13px] xl:py-2.5 xl:text-sm ${
                  collapsed
                    ? "justify-center px-1"
                    : "justify-between px-2 xl:px-3"
                } ${
                  is_active
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : dark_mode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Icon size={15} className="xl:h-[18px] xl:w-[18px]" />
                  {!collapsed && (
                    <span className="whitespace-nowrap">
                      {item.title}
                    </span>
                  )}
                </span>

                {!collapsed &&
                  (is_expanded ? (
                    <ChevronDown size={13} />
                  ) : (
                    <ChevronRight size={15} />
                  ))}
              </button>

              {!collapsed && is_expanded && (
                <div className="ml-3 mt-1 space-y-0.5 border-l border-gray-200 pl-2 dark:border-gray-700 xl:ml-4 xl:pl-3">
                  {item.children?.map((child) => {
                    if (!child.href) return null;

                    const ChildIcon = child.icon;
                    const child_active = is_path_active(child.href);

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center gap-1.5 rounded-md px-2 py-2 text-[10px] transition lg:text-xs xl:gap-2 xl:px-2.5 xl:py-2.5 xl:text-sm ${
                          child_active
                            ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            : dark_mode
                              ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        }`}
                      >
                        <ChildIcon size={14} />
                        <span>{child.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div
        className={`border-t px-3 py-3 xl:px-5 xl:py-4 ${
          dark_mode ? "border-gray-800" : "border-gray-200"
        } ${collapsed ? "flex justify-center" : ""}`}
      >
        {collapsed ? (
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white xl:h-9 xl:w-9"
            title="User"
          >
            U
          </div>
        ) : (
          <div>
            <p className="text-[10px] font-semibold xl:text-sm">
              User Account
            </p>
            <p className="text-[9px] text-gray-500 dark:text-gray-400 xl:text-xs">
              GlobalTrade Hub
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
