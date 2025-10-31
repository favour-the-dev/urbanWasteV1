import { ReactNode } from "react";

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    className?: string;
    emptyMessage?: string;
}

export default function DataTable<T extends Record<string, any>>({
    data,
    columns,
    className = "",
    emptyMessage = "No data available",
}: DataTableProps<T>) {
    return (
        <div
            className={`overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
        >
            <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/60">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={`px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider ${
                                    column.className || ""
                                }`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-12 text-center text-slate-500"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={`transition-colors ${
                                    rowIndex % 2 === 0
                                        ? "bg-white"
                                        : "bg-slate-50/40"
                                } hover:bg-emerald-50/30`}
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`px-4 py-3 text-sm text-slate-900 ${
                                            column.className || ""
                                        }`}
                                    >
                                        {typeof column.accessor === "function"
                                            ? column.accessor(row)
                                            : row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
