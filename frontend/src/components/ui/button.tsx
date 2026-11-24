
import type { ButtonHTMLAttributes, ReactNode } from "react";

// Variasi tampilan Button.
type button_variant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "ghost";

// Ukuran Button.
type button_size = "sm" | "md" | "lg";

type button_props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: button_variant;
  size?: button_size;
};

// Komponen Button reusable.
export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: button_props) {
  const base_style =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variant_style: Record<button_variant, string> = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",

    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",

    outline:
      "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800",

    danger:
      "bg-red-600 text-white hover:bg-red-700",

    ghost:
      "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
  };

  const size_style: Record<button_size, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      type={type}
      className={`${base_style} ${variant_style[variant]} ${size_style[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
