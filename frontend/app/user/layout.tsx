
import UserShell from "@/src/modules/user/components/user_shell";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserShell>{children}</UserShell>;
}
