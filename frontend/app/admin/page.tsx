
import AdminShell from "@/src/modules/admin/components/admin_shell";
import DashboardPage from "@/src/modules/admin/pages/dashboard_page";

export default function admin_page() {
  return (
    <AdminShell>
      <DashboardPage />
    </AdminShell>
  );
}
