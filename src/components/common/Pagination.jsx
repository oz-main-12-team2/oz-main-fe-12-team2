import Button from "./Button";
import "../../styles/pagination.scss";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) {
  if (totalPages <= 1) return null;

  // 페이지 번호 배열 생성
  const pages = [];
  const startPage = Math.max(2, currentPage - siblingCount);
  const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

  // 항상 첫 페이지는 표시
  pages.push(1);

  // 페이지 많아지면... 표시 여부
  if (startPage > 2) pages.push("ellipsis-start");

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages - 1) pages.push("ellipsis-end");

  // 항상 마지막 페이지 표시
  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="pagination">
      <Button
        size="sm"
        variant="secondary"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <LuChevronLeft size={16} />
      </Button>

      {pages.map((page, idx) => {
        if (page === "ellipsis-start" || page === "ellipsis-end") {
          return (
            <span key={page + idx} className="pagination-ellipsis">
              ...
            </span>
          );
        }
        return (
          <Button
            key={page}
            size="sm"
            variant={page === currentPage ? "primary" : "secondary"}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        );
      })}

      <Button
        size="sm"
        variant="secondary"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <LuChevronRight size={16} />
      </Button>
    </div>
  );
}

export default Pagination;
