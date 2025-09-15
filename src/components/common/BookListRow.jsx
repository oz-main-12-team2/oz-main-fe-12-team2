import "../../styles/booklistrow.scss";
import { BookCardRow } from "./BookCard";

export function BookListRow({ books, onCardClick, buttonActions }) {
  if (!books || books.length === 0) {
    return <p className="book-list-row-empty">상품이 없습니다.</p>;
  }

  return (
    <div className="book-list-row">
      {books.map((book) => (
        <BookCardRow key={book.id} book={book} onClick={onCardClick}>
          {/* 필요한 경우 카드 오른쪽에 버튼 넣기 */}
          {buttonActions && buttonActions(book)}
        </BookCardRow>
      ))}
    </div>
  );
}
