'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package } from 'lucide-react';

interface Column<T> {
  header: string;
  /** Render function – receives the row item and its index */
  render: (item: T, index: number) => React.ReactNode;
  /** Optional Tailwind class for the column cells */
  className?: string;
}

interface ReusableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string; // optional – falls back to a nice default
  emptyDescription?: string;
  className?: string;
  onRowClick?: (row: T) => void;
}

/**
 * Reusable, responsive, professional table
 */
const ReusableTable = <T,>({
  data,
  columns,
  emptyMessage = 'No data available',
  emptyDescription = 'Try adjusting filters or adding new items.',
  className,
  onRowClick,
}: ReusableTableProps<T>) => {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl shadow-lg bg-white ${className ?? ''}`}>
      <Table className="min-w-full">
        {/* Sticky header with subtle bottom shadow */}
        <TableHeader className="sticky top-0 z-10 bg-primaryText shadow-sm">
          <TableRow>
            {columns.map((col, idx) => (
              <TableHead
                key={col.header}
                scope="col"
                className={`
                  font-semibold text-white py-5 px-4 sm:px-6 text-left
                  text-xs sm:text-sm whitespace-nowrap
                  ${idx === 0 ? 'pl-6 sm:pl-8' : ''}
                  ${col.className ?? ''}
                `}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            /* ---------- EMPTY STATE ---------- */
            <TableRow role="row">
              <TableCell colSpan={columns.length} className="text-center py-20">
                <div className="flex flex-col items-center space-y-3">
                  <Package className="h-12 w-12 text-gray-300" />
                  <p className="text-lg font-medium text-gray-700">{emptyMessage}</p>
                  <p className="text-sm text-gray-500">{emptyDescription}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            /* ---------- DATA ROWS ---------- */
            data.map((item, rowIdx) => (
              <TableRow
                key={rowIdx}
                className={`
                  transition-colors duration-200 hover:bg-gray-100
                  ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  ${onRowClick ? 'cursor-pointer' : ''}
                  animate-fadeIn
                `}
                style={{ animationDelay: `${rowIdx * 50}ms` }}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col, colIdx) => (
                  <TableCell
                    key={col.header}
                    className={`
                      py-5 px-4 sm:px-6 text-xs sm:text-sm text-gray-700
                      ${colIdx === 0 ? 'pl-6 sm:pl-8' : ''}
                      ${col.className ?? ''}
                    `}
                  >
                    {col.render(item, rowIdx)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReusableTable;
