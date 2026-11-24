
"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ShieldCheck,
  Search,
  Plus,
  Pencil,
  Trash2,
  Users,
  Lock,
} from "lucide-react";

import PermissionGuard from "../../components/permission_guard";
import {
  admin_permission_list,
} from "../../config/admin_permissions";
import { use_admin } from "../../context/admin_context";

import Button from "@/src/components/ui/button";
import Badge from "@/src/components/ui/badge";
import Modal from "@/src/components/ui/modal";

export default function AdminPermissionsPage() {
  const {
    roles,
    add_role,
    update_role,
    delete_role,
    toggle_role_permission,
  } = use_admin();

  const [selected_role_id, set_selected_role_id] = useState("admin");
  const [search_query, set_search_query] = useState("");

  const [modal_open, set_modal_open] = useState(false);
  const [modal_mode, set_modal_mode] = useState<"create" | "edit">("create");

  const [role_name, set_role_name] = useState("");
  const [role_description, set_role_description] = useState("");
  const [editing_role_id, set_editing_role_id] = useState("");

  // Mengambil role yang sedang dipilih.
  const selected_role = roles.find(
    (role) => role.id === selected_role_id
  );

  // Filter daftar role berdasarkan pencarian.
  const filtered_roles = useMemo(() => {
    return roles.filter((role) =>
      role.name.toLowerCase().includes(search_query.toLowerCase())
    );
  }, [roles, search_query]);

  // Menghitung statistik role dan permission.
  const total_roles = roles.length;

  const total_permissions = admin_permission_list.length;

  const active_permissions =
    selected_role?.permissions.length ?? 0;

  // Membuka modal untuk membuat role baru.
  function handle_open_create() {
    set_modal_mode("create");
    set_role_name("");
    set_role_description("");
    set_editing_role_id("");
    set_modal_open(true);
  }

  // Membuka modal untuk mengedit role.
  function handle_open_edit() {
    if (!selected_role || selected_role.is_system) return;

    set_modal_mode("edit");
    set_role_name(selected_role.name);
    set_role_description(selected_role.description);
    set_editing_role_id(selected_role.id);
    set_modal_open(true);
  }

  // Menyimpan role baru atau perubahan role.
  function handle_submit_role(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const clean_name = role_name.trim();
    const clean_description = role_description.trim();

    if (!clean_name) return;

    // Mencegah nama role yang sama.
    const duplicate_role = roles.some(
      (role) =>
        role.name.toLowerCase() === clean_name.toLowerCase() &&
        role.id !== editing_role_id
    );

    if (duplicate_role) {
      alert("Role dengan nama tersebut sudah tersedia.");
      return;
    }

    if (modal_mode === "create") {
      const new_role_id = add_role(
        clean_name,
        clean_description
      );

      set_selected_role_id(new_role_id);
    } else {
      update_role(
        editing_role_id,
        clean_name,
        clean_description
      );
    }

    set_modal_open(false);
  }

  // Menghapus role yang dipilih.
  function handle_delete_role() {
    if (!selected_role || selected_role.is_system) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selected_role.name}?`
    );

    if (!confirmed) return;

    delete_role(selected_role.id);
    set_selected_role_id("admin");
  }

  return (
    <PermissionGuard required_permission="role_permissions.view">
      <div className="space-y-6">
        {/* Page Header */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-blue-600">
              <ShieldCheck size={18} />
              <span className="text-xs font-semibold uppercase tracking-wider">
                System Administration
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              Role & Permissions
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create roles and manage their access permissions.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handle_open_create}
          >
            <Plus size={16} className="mr-2" />
            Create Role
          </Button>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                <Users size={22} />
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Roles
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {total_roles}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
                <Lock size={22} />
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Available Permissions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {total_permissions}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-3 text-green-600 dark:bg-green-900/40 dark:text-green-400">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Selected Role Permissions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {active_permissions}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          {/* Role List */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Available Roles
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Select a role to manage its permissions.
              </p>
            </div>

            {/* Search Roles */}
            <div className="relative mt-4">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search_query}
                onChange={(event) =>
                  set_search_query(event.target.value)
                }
                placeholder="Search roles..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
            </div>

            {/* Role Items */}
            <div className="mt-4 space-y-2">
              {filtered_roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => set_selected_role_id(role.id)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    selected_role_id === role.id
                      ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30"
                      : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {role.name}
                    </span>

                    {role.is_system && (
                      <Badge variant="info" size="sm">
                        System
                      </Badge>
                    )}
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                    {role.description || "No description provided."}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {role.permissions.length} permissions
                  </p>
                </button>
              ))}

              {filtered_roles.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No roles found.
                </p>
              )}
            </div>
          </div>

          {/* Permission Management */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            {selected_role ? (
              <>
                {/* Selected Role Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 dark:border-gray-700 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        {selected_role.name}
                      </h2>

                      {selected_role.is_system && (
                        <Badge variant="info" size="sm">
                          System Role
                        </Badge>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {selected_role.description}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      {selected_role.permissions.length} of{" "}
                      {total_permissions} permissions enabled
                    </p>
                  </div>

                  {!selected_role.is_system && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handle_open_edit}
                      >
                        <Pencil size={14} className="mr-2" />
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handle_delete_role}
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>

                {/* Super Admin Information */}
                {selected_role.id === "super_admin" && (
                  <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                    <div className="flex items-start gap-3">
                      <Lock
                        size={18}
                        className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                      />

                      <div>
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                          Protected System Role
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-blue-700 dark:text-blue-400">
                          Super Admin automatically has access to
                          all available permissions. Its permissions
                          cannot be modified here.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Permission List */}
                <div className="mt-5">
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Permission Access
                    </h3>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Enable or disable access for this role.
                    </p>
                  </div>

                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {admin_permission_list.map((permission) => {
                      const is_active =
                        selected_role.permissions.includes(
                          permission.key
                        );

                      const is_protected =
                        selected_role.id === "super_admin";

                      return (
                        <label
                          key={permission.key}
                          className={`flex items-center justify-between gap-4 py-4 ${
                            is_protected
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <div className="min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {permission.label}
                            </h4>

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {permission.description}
                            </p>

                            <span className="mt-2 inline-block rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                              {permission.key}
                            </span>
                          </div>

                          <input
                            type="checkbox"
                            checked={is_active}
                            disabled={is_protected}
                            onChange={() =>
                              toggle_role_permission(
                                selected_role.id,
                                permission.key
                              )
                            }
                            className="h-5 w-5 shrink-0 accent-blue-600 disabled:cursor-not-allowed"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select a role to manage permissions.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Create / Edit Role Modal */}
        <Modal
          is_open={modal_open}
          on_close={() => set_modal_open(false)}
          title={
            modal_mode === "create"
              ? "Create New Role"
              : "Edit Role"
          }
          description={
            modal_mode === "create"
              ? "Add a new role to your administration system."
              : "Update the selected role information."
          }
          size="md"
        >
          <form onSubmit={handle_submit_role} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Role Name
              </label>

              <input
                type="text"
                value={role_name}
                onChange={(event) =>
                  set_role_name(event.target.value)
                }
                placeholder="Example: Verification Manager"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Description
              </label>

              <textarea
                value={role_description}
                onChange={(event) =>
                  set_role_description(event.target.value)
                }
                placeholder="Describe the responsibilities of this role..."
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                New roles start without permissions. You can
                configure their access after creating the role.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => set_modal_open(false)}
              >
                Cancel
              </Button>

              <Button type="submit" variant="primary">
                {modal_mode === "create"
                  ? "Create Role"
                  : "Save Changes"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PermissionGuard>
  );
}
