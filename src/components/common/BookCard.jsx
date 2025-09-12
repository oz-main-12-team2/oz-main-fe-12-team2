import "../../styles/bookcardcol.scss";
import "../../styles/bookcardrow.scss";

// 세로형 카드 (상품리스트)
export function BookCardCol({ book }) {
  return (
    <div className="book-card-col">
      <div className="book-card-image">
        <img src={book.image_url} alt={book.name} />
      </div>
      <div className="book-card-content">
        <h3 className="book-title">{book.name}</h3>
        <p className="book-category">{book.category}</p>
        <p className="book-author">{`${book.author} · ${book.publisher}`}</p>

        <p className="book-price">{(book.price ?? 0).toLocaleString()}원</p>
      </div>
    </div>
  );
}

// 가로형 카드 (장바구니/주문내역)
export function BookCardRow({ book, children }) {
  return (
    <div className="book-card-row">
      <div className="book-card-row-image">
        <img src={book.image_url} alt={book.name} />
      </div>

      <div className="book-card-row-content">
        <h3 className="book-title">{book.name}</h3>
        <p className="book-author">{`${book.author} · ${book.publisher}`}</p>
        <p className="book-price">{(book.price ?? 0).toLocaleString()}원</p>
        <p className="book-stock">재고: {book.stock}권</p>
      </div>

      {/* 오른쪽 actions 영역 */}
      {children && <div className="book-card-row-actions">{children}</div>}
    </div>
  );
}
