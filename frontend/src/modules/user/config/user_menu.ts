
import {
  LayoutDashboard,
  Store,
  MessageSquare,
  Bell,
  Package,
  FileText,
  ClipboardList,
  ShoppingCart,
  Truck,
  Globe,
  BookOpen,
  Building2,
  User,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface UserMenuItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  children?: UserMenuItem[];
}

export const userMenu: UserMenuItem[] = [
  {
    title: "Main Menu",
    icon: LayoutDashboard,
    children: [
      {
        title: "Dashboard",
        href: "/user",
        icon: LayoutDashboard,
      },
      {
        title: "Marketplace",
        href: "/user/marketplace",
        icon: Store,
      },
    ],
  },
  {
    title: "Communication",
    icon: MessageSquare,
    children: [
      {
        title: "Messages",
        href: "/user/messages",
        icon: MessageSquare,
      },
      {
        title: "Notifications",
        href: "/user/notifications",
        icon: Bell,
      },
    ],
  },
  {
    title: "My Business",
    icon: Package,
    children: [
      { title: "My Products", href: "/user/products", icon: Package },
      { title: "RFQ Management", href: "/user/rfq", icon: FileText },
      { title: "My Quotations", href: "/user/quotations", icon: ClipboardList },
      { title: "Orders", href: "/user/orders", icon: ShoppingCart },
      { title: "Shipments", href: "/user/shipments", icon: Truck },
    ],
  },
  {
    title: "Information & Account",
    icon: Globe,
    children: [
      { title: "Trade Center", href: "/user/trade-center", icon: Globe },
      { title: "Export Guide", href: "/user/export-guide", icon: BookOpen },
      { title: "Company Profile", href: "/user/company-profile", icon: Building2 },
      { title: "My Profile", href: "/user/profile", icon: User },
      { title: "Settings", href: "/user/settings", icon: Settings },
    ],
  },
];
