import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Limit the number of visible page links to 5 for better UX
  const maxVisiblePages = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1);

  return (
    <Pagination aria-label="Pagination Navigation" className="flex justify-center items-center py-6">
      <PaginationContent className="flex items-center gap-2">
        <PaginationPrevious
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          aria-disabled={currentPage === 1}
          className={`px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 ${
            currentPage === 1 ? 'opacity-50 pointer-events-none' : 'cursor-pointer'
          }`}
        >
          Previous
        </PaginationPrevious>

        {adjustedStartPage > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
              >
                1
              </PaginationLink>
            </PaginationItem>
            {adjustedStartPage > 2 && (
              <PaginationItem>
                <span className="px-4 py-2 text-gray-500">...</span>
              </PaginationItem>
            )}
          </>
        )}

        {Array.from({ length: endPage - adjustedStartPage + 1 }, (_, i) => adjustedStartPage + i).map(page => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onPageChange(page)}
              isActive={currentPage === page}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                currentPage === page
                  ? 'bg-primaryText text-white border-primaryText'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
              } border`}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <PaginationItem>
                <span className="px-4 py-2 text-gray-500">...</span>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(totalPages)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationNext
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          aria-disabled={currentPage === totalPages}
          className={`px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 ${
            currentPage === totalPages ? 'opacity-50 pointer-events-none' : 'cursor-pointer'
          }`}
        >
          Next
        </PaginationNext>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
