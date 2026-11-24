
import type { HTMLAttributes, ReactNode } from "react";

// Variasi warna Badge.
type badge_variant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

// Variasi ukuran Badge.
type badge_size = "sm" | "md";

type badge_props = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: badge_variant;
  size?: badge_size;
  show_dot?: boolean;
};

// Komponen Badge reusable.
export default function Badge({
  children,
  variant = "neutral",
  size = "md",
  show_dot = false,
  className = "",
  ...props
}: badge_props) {
  // Mengatur warna Badge.
  const variant_style: Record<badge_variant, string> = {
    success:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",

    warning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",

    danger:
      "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",

    info:
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",

    neutral:
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

  // Mengatur ukuran Badge.
  const size_style: Record<badge_size, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
  };

  // Mengatur warna titik berdasarkan variant.
  const dot_style: Record<badge_variant, string> = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
    neutral: "bg-gray-500",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full
        font-medium whitespace-nowrap
        ${variant_style[variant]}
        ${size_style[size]}
        ${className}
      `}
      {...props}
    >
      {show_dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dot_style[variant]}`}
        />
      )}

      {children}
    </span>
  );
}
