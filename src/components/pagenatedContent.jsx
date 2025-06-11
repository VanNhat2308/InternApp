import { useState, useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const splitTextIntoPages = (text, maxChars = 400) => {
  const words = text.split(" ");
  const pages = [];
  let currentPage = "";

  for (let word of words) {
    if ((currentPage + word).length < maxChars) {
      currentPage += word + " ";
    } else {
      pages.push(currentPage.trim());
      currentPage = word + " ";
    }
  }

  if (currentPage) pages.push(currentPage.trim());
  return pages;
};

const PaginatedContent = ({ text, maxCharsPerPage = 400 }) => {
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const splitPages = splitTextIntoPages(text, maxCharsPerPage);
    setPages(splitPages);
    setPage(0);
  }, [text, maxCharsPerPage]);

  const total = pages.length;

  const prevPage = () => setPage((p) => (p > 0 ? p - 1 : p));
  const nextPage = () => setPage((p) => (p < total - 1 ? p + 1 : p));

  return (
    <div>
      <div className="whitespace-pre-line text-xl rounded-md">
        {pages[page]}
      </div>

      <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
        <button onClick={prevPage} disabled={page === 0} className="p-2 hover:bg-gray-100 rounded-full">
          <IoChevronBack />
        </button>

        <span>
          {page + 1} / {total}
        </span>

        <button onClick={nextPage} disabled={page === total - 1} className="p-2 hover:bg-gray-100 rounded-full">
          <IoChevronForward />
        </button>
      </div>
    </div>
  );
};

export default PaginatedContent;
