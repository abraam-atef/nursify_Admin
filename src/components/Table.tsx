import { ReactNode } from "react";

export interface TableColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string | number;
}

export function Table<T>({ columns, rows, getRowKey }: TableProps<T>) {
  return (
    <div className="scrollbar-thin overflow-x-auto rounded-card border border-border dark:border-border-dark">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-black/[0.02] dark:border-border-dark dark:bg-white/[0.03]">
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3 font-medium text-ink-light dark:text-white/60">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className="border-b border-border last:border-0 dark:border-border-dark"
            >
              {columns.map((col) => (
                <td key={col.header} className={`px-4 py-3 align-middle text-ink dark:text-white/90 ${col.className ?? ""}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
