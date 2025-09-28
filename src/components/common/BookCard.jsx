import "../../styles/bookcardcol.scss";
import "../../styles/bookcardrow.scss";

// 기본 이미지 대체
const DEFAULT_IMAGE = "/no-image.jpg";

// 세로형 카드 (상품리스트)
export function BookCardCol({ book, onClick, actions }) {
  // 이미지 로드 실패 시 대체이미지로 변경
  const handleImgError = (e) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  return (
    <div
      className="book-card-col"
      onClick={() => onClick && onClick(book)} // 클릭 시 onClick(book) 실행
    >
      <div className="book-card-image">
        <img
          src={book.image || DEFAULT_IMAGE}
          alt={book.name}
          onError={handleImgError}
        />
      </div>

      <div className="book-card-content">
        <h3 className="book-title">{book.name}</h3>
        <p className="book-category">{book.category}</p>
        <p className="book-author">{`${book.author} · ${book.publisher}`}</p>
        <p className="book-price">
          {book.price != null
            ? parseInt(book.price, 10).toLocaleString()
            : 0}
          원
        </p>

        {/* actions가 있으면 버튼 영역 렌더링 */}
        {actions && <div className="book-card-actions">{actions}</div>}
      </div>
    </div>
  );
}

// 가로형 카드 (장바구니/주문내역)
export function BookCardRow({ book, onClick, children, left }) {
  const handleImgError = (e) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  return (
    <div className="book-card-row" onClick={() => onClick && onClick(book)}>
      {left && <div className="book-card-row-left">{left}</div>}

      <div className="book-card-row-image">
        <img
          src={book.image || DEFAULT_IMAGE}
          alt={book.name}
          onError={handleImgError}
        />
      </div>

      <div className="book-card-row-content">
        <h3 className="book-title">{book.name}</h3>
        <p className="book-category">{book.category}</p>
        <p className="book-author">{`${book.author} · ${book.publisher}`}</p>
        <p className="book-price">{(book.price ?? 0).toLocaleString()}원</p>
      </div>

      {children && <div className="book-card-row-actions">{children}</div>}
    </div>
  );
}