"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Placeholder page for menu items that are not yet implemented.
export default function ComingSoonPage({
  backTo = "/admin/dashboard/overview",
  title = "Coming Soon",
  description = "This page is not implemented yet. It will be available soon.",
  showBack = true,
}: {
  backTo?: string;
  title?: string;
  description?: string;
  showBack?: boolean;
}) {
  const [sentinel, setSentinel] = useState(0);

  useEffect(() => {
    // Re-run once on mount to ensure hydration is stable.
    setSentinel((s) => s + 1);
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700">
        <span className="text-4xl font-bold text-gray-400">{title}</span>
      </div>
      <p className="max-w-lg text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {showBack && (
        <div className="mt-8">
          <Link
            href={backTo}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      )}
      <p className="mt-4 text-[10px] text-gray-400">
        This page is a placeholder. Contact the platform administrator for updates.
      </p>
    </div>
  );
}
