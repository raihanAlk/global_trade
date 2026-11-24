import ComingSoonPage from "@/src/modules/admin/pages/coming_soon";

export default function page() {
  return (
    <ComingSoonPage
      title="Coming Soon"
      description="Review and process administrator registration requests here."
      backTo="/admin/admin_management/admin_list"
    />
  );
}
