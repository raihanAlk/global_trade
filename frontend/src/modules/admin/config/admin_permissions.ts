
export type admin_permission = {
  key: string;
  label: string;
  description: string;
};

export const admin_permission_list: admin_permission[] = [
  {
    key: "user_management.view",
    label: "User Management",
    description: "View and manage platform users.",
  },
  {
    key: "business_management.view",
    label: "Business Management",
    description: "View registered business accounts.",
  },
  {
    key: "company_verification.view",
    label: "Company Verification",
    description: "Access company verification workflows.",
  },
  {
    key: "product_management.view",
    label: "Product Management",
    description: "View and manage product listings.",
  },
  {
    key: "category_management.view",
    label: "Category Management",
    description: "Manage product categories.",
  },
  {
    key: "rfq_management.view",
    label: "RFQ Management",
    description: "View request for quotation data.",
  },
  {
    key: "quotation_monitoring.view",
    label: "Quotation Monitoring",
    description: "Monitor submitted quotations.",
  },
  {
    key: "order_monitoring.view",
    label: "Order Monitoring",
    description: "View and monitor trade orders.",
  },
  {
    key: "shipment_monitoring.view",
    label: "Shipment Monitoring",
    description: "Monitor shipment information.",
  },
  {
    key: "trade_center.view",
    label: "Trade Center",
    description: "Manage trade center content.",
  },
  {
    key: "reports.view",
    label: "Reports",
    description: "Access platform reports.",
  },
  {
    key: "activity_logs.view",
    label: "Activity Logs",
    description: "View platform activity records.",
  },
  {
    key: "role_permissions.view",
    label: "Admin Permissions",
    description: "Manage admin roles and permissions.",
  },
];
