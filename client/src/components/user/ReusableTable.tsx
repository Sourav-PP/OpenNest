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
  onRowClick?: (row: any) => void;
}

const ReusableTable = <T,>({ data, columns, emptyMessage, className, onRowClick }: ReusableTableProps<T>) => {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl shadow-lg bg-white ${className}`}>
      <Table className="min-w-full">
        <TableHeader className="sticky top-0 bg-primaryText">
          <TableRow>
            {columns.map((col, index) => (
              <TableHead
                key={col.header}
                className={`font-semibold text-white py-4 px-6 text-sm sm:text-base ${index === 0 ? 'pl-6 sm:pl-8' : ''} ${
                  col.className || ''
                }`}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-12 text-gray-500 text-sm sm:text-base font-medium"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow
                key={index}
                className={`transition-all duration-300 hover:bg-gray-100 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } animate-fadeIn`}
              >
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={col.header}
                    className={`py-4 px-6 text-gray-500 text-sm sm:text-base ${
                      col.className || ''
                    } ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                      colIndex === 0 ? 'pl-6 sm:pl-8' : ''
                    }`}
                    onClick={() => {
                      if(onRowClick) onRowClick(item);
                    }}
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