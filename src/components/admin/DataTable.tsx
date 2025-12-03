'use client'

import { Edit, Trash2, Plus } from 'lucide-react'

interface Column<T> {
    header: string
    accessor: keyof T | ((item: T) => React.ReactNode)
    className?: string
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    onEdit?: (item: T) => void
    onDelete?: (item: T) => void
    onAdd?: () => void
    title: string
    loading?: boolean
}

export default function DataTable<T extends { id: string }>({
    columns,
    data,
    onEdit,
    onDelete,
    onAdd,
    title,
    loading = false
}: DataTableProps<T>) {
    return (
        <div className="rounded-xl shadow-sm border overflow-hidden transition-colors duration-300"
            style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)'
            }}>
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-primary)' }}>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
                {onAdd && (
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                        style={{
                            backgroundColor: 'var(--accent-primary)',
                            color: '#ffffff'
                        }}
                    >
                        <Plus size={16} />
                        Add New
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider ${col.className || ''}`}
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    {col.header}
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--text-secondary)' }}>
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-8 text-center" style={{ color: 'var(--text-secondary)' }}>
                                    Loading data...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-8 text-center" style={{ color: 'var(--text-secondary)' }}>
                                    No items found.
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id} className="transition-colors hover:bg-opacity-50"
                                    style={{ borderBottom: '1px solid var(--border-primary)' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--utility-btn-hover-bg)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    {columns.map((col, idx) => (
                                        <td key={idx} className="px-6 py-4 text-sm whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                                            {typeof col.accessor === 'function'
                                                ? col.accessor(item)
                                                : (item[col.accessor] as React.ReactNode)}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="p-1 rounded transition-colors"
                                                    style={{ color: 'var(--accent-primary)' }}
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="p-1 rounded transition-colors"
                                                    style={{ color: 'var(--accent-error)' }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
