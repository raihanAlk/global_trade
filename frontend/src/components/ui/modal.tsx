
"use client";

import {
  useEffect,
  type ReactNode,
} from "react";

import { X } from "lucide-react";

// Ukuran Modal.
type modal_size = "sm" | "md" | "lg" | "xl";

// Props Modal.
type modal_props = {
  is_open: boolean;
  on_close: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: modal_size;
  show_close_button?: boolean;
};

// Komponen Modal reusable.
export default function Modal({
  is_open,
  on_close,
  title,
  description,
  children,
  size = "md",
  show_close_button = true,
}: modal_props) {
  // Mengatur ukuran Modal.
  const size_style: Record<modal_size, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  // Mengatur tombol Escape dan scroll halaman.
  useEffect(() => {
    if (!is_open) return;

    function handle_escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        on_close();
      }
    }

    document.addEventListener("keydown", handle_escape);

    // Mencegah halaman belakang ikut di-scroll.
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handle_escape);
      document.body.style.overflow = "";
    };
  }, [is_open, on_close]);

  // Jangan render Modal jika tidak terbuka.
  if (!is_open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        // Menutup Modal jika area luar diklik.
        if (event.target === event.currentTarget) {
          on_close();
        }
      }}
    >
      {/* Kontainer Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`
          w-full ${size_style[size]}
          max-h-[90vh] overflow-y-auto
          rounded-xl border border-gray-200
          bg-white shadow-xl
          dark:border-gray-700 dark:bg-gray-900
        `}
      >
        {/* Header Modal */}
        <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div>
            <h2
              id="modal-title"
              className="text-lg font-semibold text-gray-800 dark:text-white"
            >
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>

          {show_close_button && (
            <button
              type="button"
              onClick={on_close}
              aria-label="Close modal"
              className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <X size={19} />
            </button>
          )}
        </div>

        {/* Isi Modal */}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
