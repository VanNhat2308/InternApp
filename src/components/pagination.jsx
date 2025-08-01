import { useState } from 'react';
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
const Pagination = ({ currentPage, setCurrentPage, totalPages = 1 }) => {
  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxShown = 3; // số trang giữa được hiển thị

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1); // trang đầu

      if (currentPage > 4) pages.push('prevDots');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 3) pages.push('nextDots');

      pages.push(totalPages); // trang cuối
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-4 space-x-2 text-sm sm:text-base flex-wrap">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-2 py-1 rounded ${currentPage === 1 ? 'text-gray-400' : 'text-gray-800 hover:text-green-600'}`}
      >
        <FaChevronLeft />
      </button>

      {getPageNumbers().map((page, idx) =>
        page === 'prevDots' || page === 'nextDots' ? (
          <span key={`dots-${idx}`} className="px-2 text-gray-500">...</span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => handleClick(page)}
            className={`px-3 py-1 rounded-lg border transition ${
              currentPage === page
                ? 'border-green-500 text-green-600 font-semibold'
                : 'border-transparent text-gray-700 hover:text-green-600'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 rounded ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-800 hover:text-green-700'}`}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;

