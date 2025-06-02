import { useState } from 'react';
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
const Pagination = ({ totalPages = 4 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="flex justify-center items-center mt-4 space-x-2 text-sm sm:text-base">
      {/* Previous button */}
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-2 py-1 rounded ${currentPage === 1 ? 'text-gray-400' : 'text-gray-800 hover:text-green-600'}`}
      >
       <FaChevronLeft />
      </button>

      {/* Page numbers */}
      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => handleClick(page)}
            className={`px-3 py-1 rounded-lg border transition 
              ${
                currentPage === page
                  ? 'border-green-500 text-green-600 font-semibold'
                  : 'border-transparent text-gray-700 hover:text-green-600'
              }
            `}
          >
            {page}
          </button>
        );
      })}

      {/* Next button */}
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
