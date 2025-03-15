"use client";

import type React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { tableStyles } from "./styles";
import { ChevronLeft, ChevronRight, Inbox, Loader2 } from "lucide-react";
import { TableSkeleton } from "./table-skeleton";
import { useState } from "react";

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  footer?: React.ReactNode;
  pageSize?: number;
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  isLoading = false,
  emptyMessage = "No data available",
  footer,
  pageSize = 10
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className={tableStyles.wrapper}>
      <div className="relative">
        <Table>
          <TableHeader className={tableStyles.header}>
            <TableRow className={tableStyles.headerRow}>
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className={cn(tableStyles.headerCell, column.className)}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <TableSkeleton columns={columns.length} rows={pageSize} />
          ) : (
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    className={tableStyles.row}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className={cn(tableStyles.cell, column.className)}
                      >
                        {column.cell
                          ? column.cell(item)
                          : (item[column.accessorKey] as React.ReactNode)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className={tableStyles.emptyState}
                  >
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="rounded-full bg-muted p-4 mb-4">
                        <Inbox className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-1">
                        Aucune donnée trouvée
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {emptyMessage}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>

        {isLoading && (
          <div className={tableStyles.loadingOverlay}>
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}
      </div>

      {data.length > 0 && (
        <div className={tableStyles.footer}>
          {footer ? (
            footer
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-muted-foreground">
                Affichage de {startIndex + 1} à{" "}
                {Math.min(startIndex + pageSize, data.length)} sur {data.length}{" "}
                entrées
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={tableStyles.paginationButton}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="text-sm font-medium px-2">
                  Page {currentPage} sur {totalPages}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={tableStyles.paginationButton}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
