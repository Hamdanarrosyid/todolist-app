"use client"

import React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    Row,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "./ui/button"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[] | undefined
    isLoading: boolean
    page: number | undefined
    total: number | undefined
    onClickNext?: () => void
    onclikcPrev?: () => void
    onClickRow?: (row: Row<TData>) => void
}

export default function DataTable<TData, TValue>({
    columns,
    data,
    isLoading,
    page,
    total,
    onClickNext,
    onclikcPrev,
    onClickRow,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const renderSkeleton = () => {
        return (
            <TableRow>
                {columns.map((col, index) => (
                    <TableCell key={index}>
                        <Skeleton className="h-6 w-full" />
                    </TableCell>
                ))}
            </TableRow>
        )
    }

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className="cursor-pointer"
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => onClickRow?.(row)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    show {page} of{" "} {total}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onclikcPrev}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClickNext}
                        disabled={page === total}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
