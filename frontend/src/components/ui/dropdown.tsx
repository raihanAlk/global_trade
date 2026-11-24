
"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ChevronDown } from "lucide-react";

// Posisi Dropdown.
type dropdown_align = "left" | "right";

// Props Dropdown.
type dropdown_props = {
  trigger: ReactNode;
  children: ReactNode;
  align?: dropdown_align;
  width?: string;
  className?: string;
};

// Komponen Dropdown reusable.
export default function Dropdown({
  trigger,
  children,
  align = "left",
  width = "w-56",
  className = "",
}: dropdown_props) {
  // Mengatur kondisi Dropdown.
  const [is_open, set_is_open] = useState(false);

  // Referensi elemen Dropdown.
  const dropdown_ref = useRef<HTMLDivElement>(null);

  // Menutup Dropdown ketika pengguna mengeklik di luar.
  useEffect(() => {
    function handle_outside_click(event: MouseEvent) {
      if (
        dropdown_ref.current &&
        !dropdown_ref.current.contains(event.target as Node)
      ) {
        set_is_open(false);
      }
    }

    // Menutup Dropdown ketika tombol Escape ditekan.
    function handle_escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        set_is_open(false);
      }
    }

    document.addEventListener("mousedown", handle_outside_click);
    document.addEventListener("keydown", handle_escape);

    return () => {
      document.removeEventListener("mousedown", handle_outside_click);
      document.removeEventListener("keydown", handle_escape);
    };
  }, []);

  // Menentukan posisi menu.
  const align_style: Record<dropdown_align, string> = {
    left: "left-0",
    right: "right-0",
  };

  return (
    <div
      ref={dropdown_ref}
      className={`relative inline-block ${className}`}
    >
      {/* Tombol untuk membuka Dropdown */}
      <button
        type="button"
        onClick={() => set_is_open((current) => !current)}
        aria-expanded={is_open}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        {trigger}

        <ChevronDown
          size={15}
          className={`transition-transform ${
            is_open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Isi Dropdown */}
      {is_open && (
        <div
          className={`
            absolute top-full z-50 mt-2 ${width}
            overflow-hidden rounded-xl border border-gray-200
            bg-white py-1 shadow-lg
            dark:border-gray-700 dark:bg-gray-900
            ${align_style[align]}
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
}
