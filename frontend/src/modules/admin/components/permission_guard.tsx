
"use client";

import type { ReactNode } from "react";
import { use_admin } from "../context/admin_context";

// Props yang dibutuhkan Permission Guard
type permission_guard_props = {
  required_permission: string;
  children: ReactNode;
};

export default function PermissionGuard({
  required_permission,
  children,
}: permission_guard_props) {
  // Mengambil role dan permission dari Admin Context
  const { current_role, admin_permissions } = use_admin();

  // Super Admin selalu memiliki akses
  if (current_role === "super_admin") {
    return <>{children}</>;
  }

  // Memeriksa apakah Admin memiliki permission yang dibutuhkan
  const has_permission = admin_permissions.includes(
    required_permission
  );

  // Jika tidak memiliki permission, tampilkan Access Denied
  if (!has_permission) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
            <span className="text-2xl font-bold">!</span>
          </div>

          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Access Denied
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You do not have permission to access this page.
            Please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  // Jika memiliki permission, tampilkan halaman
  return <>{children}</>;
}
