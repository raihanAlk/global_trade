
import AdminShell from "@/src/modules/admin/components/admin_shell";

export default function admin_layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
