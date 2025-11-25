import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../components/ui/pagination';
import { Button } from '../components/ui/button';
import { Edit2, Trash2, Power, PowerOff, Eye } from 'lucide-react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface Column<T> {
    header: string;
    accessor: keyof T;
    cell?: (value: any, row: T) => React.ReactNode;
    width?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onActivate?: (row: T) => void;
    onDeactivate?: (row: T) => void;
    onView?: (row: T) => void;
    renderActions?: (row: T) => React.ReactNode;
    itemsPerPage?: number;
    hasActions?: boolean;
    emptyMessage?: string;
}

export function DataTable<T extends { id?: string; activo?: boolean }>(
    props: DataTableProps<T>
) {
    const {
        columns,
        data,
        isLoading = false,
        onEdit,
        onDelete,
        onActivate,
        onDeactivate,
        onView,
        renderActions, 
        itemsPerPage = 10,
        hasActions = true,
        emptyMessage = 'No hay datos disponibles',
    } = props;

    const [currentPage, setCurrentPage] = React.useState(1);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-gray-500 text-center">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableHead key={index} className={column.width}>
                                    {column.header}
                                </TableHead>
                            ))}
                            {hasActions && <TableHead className="w-32">Acciones</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <TableCell key={colIndex}>
                                        {column.cell
                                            ? column.cell(row[column.accessor], row)
                                            : String(row[column.accessor] ?? '-')}
                                    </TableCell>
                                ))}
                                {hasActions && (
                                    <TableCell>
                                        {renderActions ? (
                                            renderActions(row)
                                        ) : (
                                            <div className="flex gap-2">
                                                {onView && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onView(row)}
                                                        className="p-1"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                {onEdit && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onEdit(row)}
                                                        className="p-1"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                {onActivate && !row.activo && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onActivate(row)}
                                                        className="p-1 text-green-600 hover:text-green-700"
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                {onDeactivate && row.activo && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDeactivate(row)}
                                                        className="p-1 text-orange-600 hover:text-orange-700"
                                                    >
                                                        <PowerOff className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                {onDelete && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDelete(row)}
                                                        className="p-1 text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationPrevious
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />

                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            if (
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                            ) {
                                return (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink
                                            onClick={() => setCurrentPage(pageNum)}
                                            isActive={currentPage === pageNum}
                                            className="cursor-pointer"
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            } else if (
                                (pageNum === currentPage - 2 || pageNum === currentPage + 2)
                            ) {
                                return <PaginationEllipsis key={pageNum} />;
                            }
                            return null;
                        })}

                        <PaginationNext
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}