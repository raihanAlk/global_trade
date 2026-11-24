
/*
 * Admin sidebar menu configuration.
 * This file stores menu items for Super Admin and Admin.
 */

// Define the structure of one menu item.
export type admin_menu_item = {
  key: string;
  label: string;
  href?: string;
  permission?: string;
  children?: admin_menu_item[];
};

// Super Admin receives the complete administration menu.
export const super_admin_menu: admin_menu_item[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    children: [
      {
        key: "overview",
        label: "Overview",
        href: "/admin/dashboard/overview",
      },
      {
        key: "platform_analytics",
        label: "Platform Analytics",
        href: "/admin/dashboard/platform_analytics",
      },
    ],
  },
  {
    key: "admin_management",
    label: "Admin Management",
    children: [
      { key: "admin_list", label: "Admin List", href: "/admin/admin_management/admin_list" },
      { key: "admin_registration_requests", label: "Admin Registration Requests", href: "/admin/admin_management/registration_requests" },
      { key: "admin_permissions", label: "Admin Permissions", href: "/admin/admin_management/admin_permissions" },
    ],
  },
  {
    key: "user_management",
    label: "User Management",
    children: [
      { key: "all_users", label: "All Users", href: "/admin/user_management/all_users" },
      { key: "exporters", label: "Exporters", href: "/admin/user_management/exporters" },
      { key: "importers", label: "Importers", href: "/admin/user_management/importers" },
      { key: "suspended_users", label: "Suspended Users", href: "/admin/user_management/suspended_users" },
    ],
  },
  {
    key: "business_management",
    label: "Business Management",
    children: [
      { key: "all_companies", label: "All Companies", href: "/admin/business_management/all_companies" },
      { key: "business_members", label: "Business Members", href: "/admin/business_management/business_members" },
    ],
  },
  {
    key: "company_verification",
    label: "Company Verification",
    children: [
      { key: "verification_queue", label: "Verification Queue", href: "/admin/company_verification/verification_queue" },
      { key: "in_review", label: "In Review", href: "/admin/company_verification/in_review" },
      { key: "approved", label: "Approved", href: "/admin/company_verification/approved" },
      { key: "rejected", label: "Rejected", href: "/admin/company_verification/rejected" },
      { key: "suspended", label: "Suspended", href: "/admin/company_verification/suspended" },
    ],
  },
  {
    key: "product_management",
    label: "Product Management",
    children: [
      { key: "all_products", label: "All Products", href: "/admin/product_management/all_products" },
      { key: "pending_review", label: "Pending Review", href: "/admin/product_management/pending_review" },
      { key: "published", label: "Published", href: "/admin/product_management/published" },
      { key: "rejected", label: "Rejected", href: "/admin/product_management/rejected" },
    ],
  },
  {
    key: "category_management",
    label: "Category Management",
    children: [
      { key: "categories", label: "Categories", href: "/admin/category_management/categories" },
      { key: "subcategories", label: "Subcategories", href: "/admin/category_management/subcategories" },
    ],
  },
  {
    key: "rfq_management",
    label: "RFQ Management",
    children: [
      { key: "all_rfqs", label: "All RFQs", href: "/admin/rfq_management/all_rfqs" },
      { key: "active_rfqs", label: "Active RFQs", href: "/admin/rfq_management/active_rfqs" },
      { key: "closed_rfqs", label: "Closed RFQs", href: "/admin/rfq_management/closed_rfqs" },
    ],
  },
  {
    key: "quotation_management",
    label: "Quotation Management",
    children: [
      { key: "all_quotations", label: "All Quotations", href: "/admin/quotation_management/all_quotations" },
      { key: "accepted", label: "Accepted", href: "/admin/quotation_management/accepted" },
      { key: "rejected", label: "Rejected", href: "/admin/quotation_management/rejected" },
      { key: "expired", label: "Expired", href: "/admin/quotation_management/expired" },
    ],
  },
  {
    key: "order_management",
    label: "Order Management",
    children: [
      { key: "all_orders", label: "All Orders", href: "/admin/order_management/all_orders" },
      { key: "active_orders", label: "Active Orders", href: "/admin/order_management/active_orders" },
      { key: "completed", label: "Completed", href: "/admin/order_management/completed" },
      { key: "cancelled", label: "Cancelled", href: "/admin/order_management/cancelled" },
    ],
  },
  {
    key: "shipment_management",
    label: "Shipment Management",
    children: [
      { key: "all_shipments", label: "All Shipments", href: "/admin/shipment_management/all_shipments" },
      { key: "in_transit", label: "In Transit", href: "/admin/shipment_management/in_transit" },
      { key: "delivered", label: "Delivered", href: "/admin/shipment_management/delivered" },
    ],
  },
  {
    key: "chat_monitoring",
    label: "Chat Monitoring",
    children: [
      { key: "reported_conversations", label: "Reported Conversations", href: "/admin/chat_monitoring/reported_conversations" },
      { key: "message_reports", label: "Message Reports", href: "/admin/chat_monitoring/message_reports" },
    ],
  },
  {
    key: "trade_center",
    label: "Trade Center",
    children: [
      { key: "articles", label: "Articles", href: "/admin/trade_center/articles" },
      { key: "guides", label: "Guides", href: "/admin/trade_center/guides" },
      { key: "country_profiles", label: "Country Profiles", href: "/admin/trade_center/country_profiles" },
      { key: "trade_categories", label: "Categories", href: "/admin/trade_center/categories" },
    ],
  },
  {
    key: "reports_analytics",
    label: "Reports & Analytics",
    children: [
      { key: "user_reports", label: "User Reports", href: "/admin/reports_analytics/user_reports" },
      { key: "business_reports", label: "Business Reports", href: "/admin/reports_analytics/business_reports" },
      { key: "transaction_reports", label: "Transaction Reports", href: "/admin/reports_analytics/transaction_reports" },
    ],
  },
  {
    key: "activity_logs",
    label: "Activity Logs",
    children: [
      { key: "admin_logs", label: "Admin Logs", href: "/admin/activity_logs/admin_logs" },
      { key: "user_logs", label: "User Logs", href: "/admin/activity_logs/user_logs" },
      { key: "system_logs", label: "System Logs", href: "/admin/activity_logs/system_logs" },
    ],
  },
  {
    key: "role_permissions",
    label: "Role & Permissions",
    children: [
      { key: "roles", label: "Roles", href: "/admin/role_permissions/roles" },
      { key: "permissions", label: "Permissions", href: "/admin/role_permissions/permissions" },
      { key: "role_assignment", label: "Role Assignment", href: "/admin/role_permissions/role_assignment" },
    ],
  },
  {
    key: "system_settings",
    label: "System Settings",
    children: [
      { key: "general_settings", label: "General Settings", href: "/admin/system_settings/general_settings" },
      { key: "languages", label: "Languages", href: "/admin/system_settings/languages" },
      { key: "security", label: "Security", href: "/admin/system_settings/security" },
      { key: "integrations", label: "Integrations", href: "/admin/system_settings/integrations" },
    ],
  },
  {
    key: "my_profile",
    label: "My Profile",
    children: [
      { key: "account_information", label: "Account Information", href: "/admin/my_profile/account_information" },
      { key: "change_password", label: "Change Password", href: "/admin/my_profile/change_password" },
    ],
  },
  {
    key: "logout",
    label: "Logout",
    href: "/logout",
  },
];

// Admin only receives menus allowed by the Super Admin.
export const admin_menu: admin_menu_item[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    children: [
      { key: "overview", label: "Overview", href: "/admin/dashboard/overview" },
      { key: "activity_summary", label: "Activity Summary", href: "/admin/dashboard/activity_summary" },
    ],
  },
  {
    key: "user_management",
    label: "User Management",
    permission: "user_management.view",
    children: [
      { key: "all_users", label: "All Users", href: "/admin/user_management/all_users" },
      { key: "exporters", label: "Exporters", href: "/admin/user_management/exporters" },
      { key: "importers", label: "Importers", href: "/admin/user_management/importers" },
    ],
  },
  {
    key: "business_management",
    label: "Business Management",
    permission: "business_management.view",
    children: [
      { key: "company_list", label: "Company List", href: "/admin/business_management/company_list" },
      { key: "business_details", label: "Business Details", href: "/admin/business_management/business_details" },
    ],
  },
  {
    key: "company_verification",
    label: "Company Verification",
    permission: "company_verification.view",
    children: [
      { key: "verification_queue", label: "Verification Queue", href: "/admin/company_verification/verification_queue" },
      { key: "in_review", label: "In Review", href: "/admin/company_verification/in_review" },
      { key: "approved", label: "Approved", href: "/admin/company_verification/approved" },
      { key: "rejected", label: "Rejected", href: "/admin/company_verification/rejected" },
    ],
  },
  {
    key: "product_management",
    label: "Product Management",
    permission: "product_management.view",
    children: [
      { key: "product_list", label: "Product List", href: "/admin/product_management/product_list" },
      { key: "pending_review", label: "Pending Review", href: "/admin/product_management/pending_review" },
      { key: "published", label: "Published", href: "/admin/product_management/published" },
      { key: "rejected", label: "Rejected", href: "/admin/product_management/rejected" },
    ],
  },
  {
    key: "category_management",
    label: "Category Management",
    permission: "category_management.view",
    children: [
      { key: "categories", label: "Categories", href: "/admin/category_management/categories" },
      { key: "subcategories", label: "Subcategories", href: "/admin/category_management/subcategories" },
    ],
  },
  {
    key: "rfq_management",
    label: "RFQ Management",
    permission: "rfq_management.view",
    children: [
      { key: "rfq_list", label: "RFQ List", href: "/admin/rfq_management/rfq_list" },
      { key: "rfq_details", label: "RFQ Details", href: "/admin/rfq_management/rfq_details" },
    ],
  },
  {
    key: "quotation_monitoring",
    label: "Quotation Monitoring",
    permission: "quotation_monitoring.view",
    children: [
      { key: "quotation_list", label: "Quotation List", href: "/admin/quotation_monitoring/quotation_list" },
    ],
  },
  {
    key: "order_monitoring",
    label: "Order Monitoring",
    permission: "order_monitoring.view",
    children: [
      { key: "order_list", label: "Order List", href: "/admin/order_monitoring/order_list" },
      { key: "order_details", label: "Order Details", href: "/admin/order_monitoring/order_details" },
    ],
  },
  {
    key: "shipment_monitoring",
    label: "Shipment Monitoring",
    permission: "shipment_monitoring.view",
    children: [
      { key: "shipment_list", label: "Shipment List", href: "/admin/shipment_monitoring/shipment_list" },
      { key: "shipment_details", label: "Shipment Details", href: "/admin/shipment_monitoring/shipment_details" },
    ],
  },
  {
    key: "trade_center",
    label: "Trade Center",
    permission: "trade_center.view",
    children: [
      { key: "articles", label: "Articles", href: "/admin/trade_center/articles" },
      { key: "guides", label: "Guides", href: "/admin/trade_center/guides" },
      { key: "country_profiles", label: "Country Profiles", href: "/admin/trade_center/country_profiles" },
    ],
  },
  {
    key: "reports",
    label: "Reports",
    permission: "reports.view",
    children: [
      { key: "user_reports", label: "User Reports", href: "/admin/reports/user_reports" },
      { key: "product_reports", label: "Product Reports", href: "/admin/reports/product_reports" },
      { key: "business_reports", label: "Business Reports", href: "/admin/reports/business_reports" },
    ],
  },
  {
    key: "activity_logs",
    label: "Activity Logs",
    permission: "activity_logs.view",
    children: [
      { key: "my_activity", label: "My Activity", href: "/admin/activity_logs/my_activity" },
    ],
  },
  {
    key: "my_profile",
    label: "My Profile",
    children: [
      { key: "account_information", label: "Account Information", href: "/admin/my_profile/account_information" },
      { key: "change_password", label: "Change Password", href: "/admin/my_profile/change_password" },
    ],
  },
];

// Return the correct menu based on role and granted permissions.
export function get_admin_menu(
  role: "super_admin" | "admin",
  permissions: string[] = []
): admin_menu_item[] {
  if (role === "super_admin") {
    return super_admin_menu;
  }

  return admin_menu.filter((menu_item) => {
    // Dashboard and My Profile are available to every Admin.
    if (!menu_item.permission) {
      return true;
    }

    return permissions.includes(menu_item.permission);
  });
}
