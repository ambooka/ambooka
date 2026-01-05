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
        <div 
            className="ad-card"
            style={{ padding: 0, overflow: 'hidden' }}
        >
            {/* Header */}
            <div 
                className="p-6 flex justify-between items-center"
                style={{ borderBottom: '1px solid var(--ad-border-default)' }}
            >
                <h2 className="text-lg font-bold" style={{ color: 'var(--ad-text-primary)' }}>{title}</h2>
                {onAdd && (
                    <button
                        onClick={onAdd}
                        className="ad-btn ad-btn-primary"
                    >
                        <Plus size={16} />
                        Add New
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead style={{ background: 'var(--ad-bg-muted)' }}>
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider ${col.className || ''}`}
                                    style={{ color: 'var(--ad-text-tertiary)' }}
                                >
                                    {col.header}
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th 
                                    className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-right" 
                                    style={{ color: 'var(--ad-text-tertiary)' }}
                                >
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td 
                                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} 
                                    className="px-6 py-12 text-center"
                                >
                                    <div 
                                        className="w-8 h-8 border-4 rounded-full ad-spinner mx-auto"
                                        style={{ borderColor: 'var(--ad-primary)', borderTopColor: 'transparent' }} 
                                    />
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td 
                                    colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} 
                                    className="px-6 py-12 text-center" 
                                    style={{ color: 'var(--ad-text-tertiary)' }}
                                >
                                    No items found.
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr 
                                    key={item.id} 
                                    className="transition-colors"
                                    style={{ borderBottom: '1px solid var(--ad-border-subtle)' }}
                                >
                                    {columns.map((col, idx) => (
                                        <td 
                                            key={idx} 
                                            className="px-6 py-4 text-sm whitespace-nowrap" 
                                            style={{ color: 'var(--ad-text-primary)' }}
                                        >
                                            {typeof col.accessor === 'function'
                                                ? col.accessor(item)
                                                : (item[col.accessor] as React.ReactNode)}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="px-6 py-4 text-right text-sm font-medium space-x-1">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="p-2 rounded-lg transition-colors"
                                                    style={{ color: 'var(--ad-text-tertiary)' }}
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="p-2 rounded-lg transition-colors"
                                                    style={{ color: 'var(--ad-danger)' }}
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
