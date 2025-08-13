import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<PaginationProps> = ({currentPage, totalPages, onPageChange}) => {
  return (
    <Pagination aria-label="Pagination Navigation">
      <PaginationPrevious
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={currentPage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
      >
        Previous
      </PaginationPrevious>

      <PaginationContent>
        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i + 1}>
            <PaginationLink
              onClick={() => onPageChange(i + 1)}
              isActive={currentPage === i + 1}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>

      <PaginationNext
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={currentPage === totalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"}
      >
        Next
      </PaginationNext>
    </Pagination>
  )
}

export default CustomPagination
