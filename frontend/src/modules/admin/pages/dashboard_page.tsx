
import {
  Users,
  Building2,
  ShieldCheck,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowRight,
  Clock,
  FileCheck,
  ShoppingCart,
  Truck,
  FileText,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  Globe,
} from "lucide-react";

export default function dashboard_page() {
  // Data statistik sementara
  const statistics = [
    {
      title: "Total Users",
      value: "1,250",
      percentage: "+12.5%",
      description: "vs last month",
      icon: Users,
      color: "blue",
      positive: true,
    },
    {
      title: "Total Businesses",
      value: "320",
      percentage: "+8.2%",
      description: "vs last month",
      icon: Building2,
      color: "violet",
      positive: true,
    },
    {
      title: "Pending Verification",
      value: "24",
      percentage: "Needs review",
      description: "Requires attention",
      icon: ShieldCheck,
      color: "orange",
      positive: false,
    },
    {
      title: "Total Products",
      value: "890",
      percentage: "+15.3%",
      description: "vs last month",
      icon: Package,
      color: "emerald",
      positive: true,
    },
  ];

  // Data grafik pertumbuhan pengguna
  const user_growth = [
    { month: "Jan", value: 35 },
    { month: "Feb", value: 48 },
    { month: "Mar", value: 42 },
    { month: "Apr", value: 65 },
    { month: "May", value: 55 },
    { month: "Jun", value: 78 },
    { month: "Jul", value: 68 },
    { month: "Aug", value: 88 },
    { month: "Sep", value: 72 },
    { month: "Oct", value: 95 },
    { month: "Nov", value: 82 },
    { month: "Dec", value: 100 },
  ];

  // Data verifikasi perusahaan
  const verification_data = [
    {
      label: "Approved",
      value: 185,
      color: "bg-emerald-500",
    },
    {
      label: "Pending",
      value: 24,
      color: "bg-orange-500",
    },
    {
      label: "Rejected",
      value: 11,
      color: "bg-red-500",
    },
  ];

  // Data aktivitas perdagangan
  const trade_statistics = [
    {
      title: "Total RFQs",
      value: "456",
      icon: FileText,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Active Orders",
      value: "128",
      icon: ShoppingCart,
      color: "text-violet-600 bg-violet-50 dark:bg-violet-950",
    },
    {
      title: "Shipments",
      value: "86",
      icon: Truck,
      color: "text-orange-600 bg-orange-50 dark:bg-orange-950",
    },
  ];

  // Data aktivitas terbaru
  const recent_activities = [
    {
      title: "New business registered",
      description: "PT Nusantara Export joined the platform.",
      time: "5 minutes ago",
      icon: Building2,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      title: "Company verification approved",
      description: "Global Foods Ltd. has been verified.",
      time: "25 minutes ago",
      icon: CheckCircle2,
      color:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    },
    {
      title: "New product submitted",
      description: "A new product is waiting for review.",
      time: "1 hour ago",
      icon: Package,
      color:
        "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
    },
    {
      title: "New RFQ created",
      description: "A new request for quotation was submitted.",
      time: "2 hours ago",
      icon: FileText,
      color:
        "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Welcome Section */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Here&apos;s what&apos;s happening on GlobalTrade Hub.
          </p>
        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        >
          <CalendarDays size={17} />
          Last 30 Days
        </button>
      </section>

      {/* Main Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((item) => {
          const Icon = item.icon;

          const icon_colors: Record<string, string> = {
            blue: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
            violet:
              "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
            orange:
              "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
            emerald:
              "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
          };

          return (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>

                <div className={`rounded-lg p-2.5 ${icon_colors[item.color]}`}>
                  <Icon size={21} />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </h2>

              <div className="mt-2 flex items-center gap-1.5">
                {item.positive ? (
                  <TrendingUp size={15} className="text-emerald-600" />
                ) : (
                  <AlertCircle size={15} className="text-orange-500" />
                )}

                <span
                  className={`text-xs font-semibold ${
                    item.positive
                      ? "text-emerald-600"
                      : "text-orange-500"
                  }`}
                >
                  {item.percentage}
                </span>

                <span className="text-xs text-gray-400">
                  {item.description}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* User Growth Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                User Registration Growth
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Monthly user registration overview
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <TrendingUp size={19} />
            </div>
          </div>

          <div className="mt-8 flex h-52 items-end justify-between gap-2 border-b border-gray-200 pb-2 dark:border-gray-700">
            {user_growth.map((item) => (
              <div
                key={item.month}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <div
                  className="w-full max-w-8 rounded-t-md bg-blue-500 transition hover:bg-blue-600"
                  style={{ height: `${item.value}%` }}
                  title={`${item.month}: ${item.value}`}
                />

                <span className="text-[10px] text-gray-400">
                  {item.month}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total registrations
            </p>

            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              1,250 Users
            </p>
          </div>
        </div>

        {/* Company Verification */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Company Verification
          </h2>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Verification status overview
          </p>

          <div className="mt-7 flex justify-center">
            <div
              className="relative flex h-40 w-40 items-center justify-center rounded-full"
              style={{
                background:
                  "conic-gradient(#10b981 0% 84.1%, #f97316 84.1% 95%, #ef4444 95% 100%)",
              }}
            >
              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white dark:bg-gray-900">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  220
                </span>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Companies
                </span>
              </div>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            {verification_data.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />

                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>

                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trade Statistics */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              International Trade Activity
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Overview of marketplace transactions
            </p>
          </div>

          <Globe size={20} className="text-blue-600" />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {trade_statistics.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-lg border border-gray-100 p-4 dark:border-gray-800"
              >
                <div className={`rounded-lg p-3 ${item.color}`}>
                  <Icon size={22} />
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.title}
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Section */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Recent Activities */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Recent Platform Activity
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Latest activities across the platform
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              View All
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="mt-5 space-y-5">
            {recent_activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <div
                  key={activity.title}
                  className="flex items-start gap-3"
                >
                  <div className={`rounded-lg p-2.5 ${activity.color}`}>
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {activity.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {activity.description}
                    </p>
                  </div>

                  <span className="whitespace-nowrap text-[11px] text-gray-400">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <AlertCircle size={19} className="text-orange-500" />

            <h2 className="font-semibold text-gray-900 dark:text-white">
              Needs Your Attention
            </h2>
          </div>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Items that require administrative review
          </p>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3 dark:bg-orange-950/30">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-orange-600" />

                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Company Verification
                </span>
              </div>

              <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                24
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3 dark:bg-blue-950/30">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-blue-600" />

                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Product Review
                </span>
              </div>

              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                18
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-violet-50 p-3 dark:bg-violet-950/30">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-violet-600" />

                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Pending RFQs
                </span>
              </div>

              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                12
              </span>
            </div>
          </div>

          <button
            type="button"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Review Pending Items
            <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

    </div>
  );
}
