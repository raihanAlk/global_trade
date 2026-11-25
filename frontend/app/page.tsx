import { redirect } from "next/navigation";

// Login connection is temporarily disabled.
// A new page now opens directly on the admin dashboard.
export default function Home() {
  redirect("/admin/dashboard/overview");
}
