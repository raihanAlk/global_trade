import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GlobalTrade Hub | Admin",
  description: "GlobalTrade Hub administration workspace",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
