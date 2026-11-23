
import AdminShell from "@/src/modules/admin/components/admin_shell";
import AdminListPage from "@/src/modules/admin/pages/admin_management/admin_list_page";

export default function page() {
  return (
    <AdminShell>
      <AdminListPage />
    </AdminShell>
  );
}
    