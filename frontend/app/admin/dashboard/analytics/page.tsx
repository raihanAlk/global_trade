import ComingSoonPage from "@/src/modules/admin/pages/coming_soon";

export default function page() {
  return (
    <ComingSoonPage
      title="Coming Soon"
      description="Platform analytics will be available here soon."
      backTo="/admin/dashboard/overview"
    />
  );
}
