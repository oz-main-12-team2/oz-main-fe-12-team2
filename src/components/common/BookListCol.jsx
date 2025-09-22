import "../../styles/booklistcol.scss";
import { BookCardCol } from "./BookCard";

export function BookListCol({ books, onCardClick }) {
  if (!books || books.length === 0) {
    return <p className="book-list-col-empty">상품이 없습니다.</p>;
  }

  return (
    <div className="book-list-col">
      {books.map((book) => (
        <BookCardCol key={book.id} book={book} onClick={onCardClick} />
      ))}
    </div>
  );
}