
"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { admin_permission_list } from "../config/admin_permissions";

// Role bawaan sistem.
export type admin_role = "admin" | "super_admin";

// Bentuk data setiap role.
export type admin_role_data = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  is_system: boolean;
};

// Role awal untuk simulasi frontend.
const initial_roles: admin_role_data[] = [
  {
    id: "super_admin",
    name: "Super Admin",
    description: "Full access to all platform features.",
    permissions: admin_permission_list.map((permission) => permission.key),
    is_system: true,
  },
  {
    id: "admin",
    name: "Admin",
    description: "General platform administration.",
    permissions: [
      "user_management.view",
      "business_management.view",
      "product_management.view",
      "role_permissions.view",
    ],
    is_system: true,
  },
  {
    id: "verification_manager",
    name: "Verification Manager",
    description: "Manage company verification activities.",
    permissions: [
      "company_verification.view",
      "business_management.view",
    ],
    is_system: false,
  },
];

// Bentuk data yang dibagikan melalui Admin Context.
type admin_context_type = {
  current_role: admin_role;
  admin_permissions: string[];
  toggle_permission: (permission: string) => void;

  roles: admin_role_data[];
  add_role: (name: string, description: string) => string;
  update_role: (
    role_id: string,
    name: string,
    description: string
  ) => void;
  delete_role: (role_id: string) => void;
  toggle_role_permission: (
    role_id: string,
    permission: string
  ) => void;
};

const AdminContext = createContext<admin_context_type | undefined>(
  undefined
);

// Provider untuk membagikan role dan permission ke seluruh halaman Admin.
export function AdminProvider({
  children,
  current_role,
  admin_permissions,
  toggle_permission,
}: {
  children: ReactNode;
  current_role: admin_role;
  admin_permissions: string[];
  toggle_permission: (permission: string) => void;
}) {
  const [roles, set_roles] =
    useState<admin_role_data[]>(initial_roles);

  // Membuat role baru.
  function add_role(name: string, description: string) {
    const role_id = `custom_${Date.now()}`;

    const new_role: admin_role_data = {
      id: role_id,
      name,
      description,
      permissions: [],
      is_system: false,
    };

    set_roles((previous_roles) => [
      ...previous_roles,
      new_role,
    ]);

    return role_id;
  }

  // Mengubah nama dan deskripsi role.
  function update_role(
    role_id: string,
    name: string,
    description: string
  ) {
    set_roles((previous_roles) =>
      previous_roles.map((role) =>
        role.id === role_id
          ? { ...role, name, description }
          : role
      )
    );
  }

  // Menghapus role khusus, bukan role sistem.
  function delete_role(role_id: string) {
    set_roles((previous_roles) =>
      previous_roles.filter(
        (role) => role.id !== role_id || role.is_system
      )
    );
  }

  // Mengaktifkan atau menonaktifkan permission pada role.
  function toggle_role_permission(
    role_id: string,
    permission: string
  ) {
    set_roles((previous_roles) =>
      previous_roles.map((role) => {
        if (role.id !== role_id || role.id === "super_admin") {
          return role;
        }

        const has_permission =
          role.permissions.includes(permission);

        return {
          ...role,
          permissions: has_permission
            ? role.permissions.filter(
                (item) => item !== permission
              )
            : [...role.permissions, permission],
        };
      })
    );
  }

  return (
    <AdminContext.Provider
      value={{
        current_role,
        admin_permissions,
        toggle_permission,
        roles,
        add_role,
        update_role,
        delete_role,
        toggle_role_permission,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

// Hook untuk mengambil data Admin Context.
export function use_admin() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error(
      "use_admin harus digunakan di dalam AdminProvider"
    );
  }

  return context;
}
