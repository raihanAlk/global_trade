
import type {
  HTMLAttributes,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
  ReactNode,
} from "react";

// Props untuk Table utama.
type table_props = TableHTMLAttributes<HTMLTableElement> & {
  children: ReactNode;
};

// Props untuk Table Header.
type table_header_props = HTMLAttributes<HTMLTableSectionElement> & {
  children: ReactNode;
};

// Props untuk Table Body.
type table_body_props = HTMLAttributes<HTMLTableSectionElement> & {
  children: ReactNode;
};

// Props untuk Table Row.
type table_row_props = HTMLAttributes<HTMLTableRowElement> & {
  children: ReactNode;
};

// Props untuk Table Head.
type table_head_props = ThHTMLAttributes<HTMLTableCellElement> & {
  children?: ReactNode;
};

// Props untuk Table Cell.
type table_cell_props = TdHTMLAttributes<HTMLTableCellElement> & {
  children?: ReactNode;
};

// Table utama.
export function Table({
  children,
  className = "",
  ...props
}: table_props) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table
        className={`w-full border-collapse text-left text-sm ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

// Bagian Header Table.
export function TableHeader({
  children,
  className = "",
  ...props
}: table_header_props) {
  return (
    <thead
      className={`bg-gray-50 dark:bg-gray-800/70 ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
}

// Bagian Body Table.
export function TableBody({
  children,
  className = "",
  ...props
}: table_body_props) {
  return (
    <tbody
      className={`divide-y divide-gray-100 dark:divide-gray-800 ${className}`}
      {...props}
    >
      {children}
    </tbody>
  );
}

// Baris Table.
export function TableRow({
  children,
  className = "",
  ...props
}: table_row_props) {
  return (
    <tr
      className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

// Kolom Header.
export function TableHead({
  children,
  className = "",
  ...props
}: table_head_props) {
  return (
    <th
      className={`whitespace-nowrap !px-2 !py-2 !text-[9px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 xl:!px-4 xl:!py-4 xl:!text-xs ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

// Kolom Data.
export function TableCell({
  children,
  className = "",
  ...props
}: table_cell_props) {
  return (
    <td
      className={`whitespace-nowrap !px-2 !py-1.5 !text-[10px] text-gray-700 dark:text-gray-300 xl:!px-4 xl:!py-3.5 xl:!text-sm ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}
