import React from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-transparent border-t-2 border-admin-bg-box">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-full ${
          currentPage === 1
            ? 'text-gray-500 cursor-not-allowed bg-admin-bg-box'
            : 'text-white bg-admin-bg-box hover:bg-gray-700'
        }`}
      >
        <FiArrowLeft size={20} className="stroke-green-700" />
      </button>
      <span className="text-sm text-gray-300">
        Page {currentPage} of {Math.max(totalPages, 1)}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-full ${
          currentPage === totalPages
            ? 'text-gray-500 cursor-not-allowed bg-admin-bg-box'
            : 'text-white hover:bg-gray-700 bg-admin-bg-box'
        }`}
      >
        <FiArrowRight size={20} className="stroke-green-700" />
      </button>
    </div>
  );
};

export default CustomPagination;
