
import type { InputHTMLAttributes } from "react";

// Variasi ukuran Input.
type input_size = "sm" | "md" | "lg";

// Props tambahan untuk Input.
type input_props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  size?: input_size;
  label?: string;
  error?: string;
  helper_text?: string;
};

// Komponen Input reusable.
export default function Input({
  size = "md",
  label,
  error,
  helper_text,
  className = "",
  id,
  ...props
}: input_props) {
  // Mengatur ukuran Input.
  const size_style: Record<input_size, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  // Membuat ID otomatis jika tidak diberikan.
  const input_id =
    id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {/* Label Input */}
      {label && (
        <label
          htmlFor={input_id}
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}

      {/* Field Input */}
      <input
        id={input_id}
        className={`
          w-full rounded-lg border bg-white text-gray-800 outline-none
          transition placeholder:text-gray-400
          focus:ring-2 focus:ring-blue-500/20
          disabled:cursor-not-allowed disabled:bg-gray-100
          dark:bg-gray-900 dark:text-gray-100 dark:disabled:bg-gray-800
          ${size_style[size]}
          ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-blue-500 dark:border-gray-700"
          }
          ${className}
        `}
        aria-invalid={Boolean(error)}
        {...props}
      />

      {/* Helper Text */}
      {error ? (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      ) : helper_text ? (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helper_text}
        </p>
      ) : null}
    </div>
  );
}
