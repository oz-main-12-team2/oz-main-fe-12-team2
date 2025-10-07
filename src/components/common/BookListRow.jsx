import "../../styles/booklistrow.scss";

import { BookCardRow } from "./BookCard";

export function BookListRow({
  books,
  onCardClick,
  buttonActions,
  leftActions,
}) {
  if (!books || books.length === 0) {
    return <p className="book-list-row-empty">상품이 없습니다.</p>;
  }

  return (
    <div className="book-list-row">
      {books.map((book) => (
        <BookCardRow
          key={book.id}
          book={book}
          onClick={onCardClick}
          left={leftActions && leftActions(book)}
        >
          {buttonActions && buttonActions(book)}
        </BookCardRow>
      ))}
    </div>
  );
}
