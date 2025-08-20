import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Column<T> {
  header: string;
  render: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface ReusableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage: string;
  className?: string;
}

const ReusableTable = <T,>({ data, columns, emptyMessage, className }: ReusableTableProps<T>) => {
  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow className="bg-admin-bg-primary text-gray-300">
            {columns.map((col) => (
              <TableHead
                key={col.header}
                className={`px-6 py-4 text-left font-bold ${col.className || ''}`}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500 dark:text-gray-400">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow
                key={index}
                className={index % 2 === 0 ? 'bg-admin-bg-secondary' : 'bg-admin-bg-box'}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.header}
                    className={`px-6 py-4 text-white ${col.className || ''}`}
                  >
                    {col.render(item, index)}
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
