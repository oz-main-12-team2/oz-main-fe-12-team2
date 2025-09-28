import { useState, useEffect } from "react";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import { BookListRow } from "../components/common/BookListRow";
import "../styles/cart.scss";
import { Checkbox } from "../components/common/CheckRadio";

const DUMMY_CART = [
  {
    book: {
      id: 1,
      name: "자바스크립트",
      category: "프론트엔드",
      author: "이름1",
      publisher: "한빛미디어",
      price: 25000,
      stock: 10,
      image_url: "",
    },
    quantity: 2,
  },
  {
    book: {
      id: 2,
      name: "자바스크립트2",
      category: "프로그래밍",
      author: "이름2",
      publisher: "한빛미디어2",
      price: 18000,
      stock: 5,
      image_url: "",
    },
    quantity: 1,
  },
];

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCartItems(DUMMY_CART);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleQuantityChange = (bookId, delta) => {
    const updatedItems = cartItems.map((item) => {
      if (item.book.id === bookId) {
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return item;
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedItems);
  };

  const handleRemoveItem = (bookId) => {
    setCartItems(cartItems.filter((item) => item.book.id !== bookId));
    setSelectedItems(selectedItems.filter((id) => id !== bookId));
  };

  const handleSelectItem = (bookId) => {
    setSelectedItems((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.book.id));
    }
  };

  const handleRemoveSelected = () => {
    setCartItems(cartItems.filter((item) => !selectedItems.includes(item.book.id)));
    setSelectedItems([]);
  };

  const handleCheckoutSelected = () => {
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.book.id)
    );
    console.log("선택된 상품 구매 진행:", selectedProducts);
  };

  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.book.id))
    .reduce((acc, item) => acc + item.book.price * item.quantity, 0);

  if (isLoading) return <Loading loadingText="장바구니 로딩 중..." size={40} />;

  return (
    <div className="cart-page">
      <h2>장바구니</h2>

      {cartItems.length === 0 ? (
        <p>장바구니가 비어 있습니다.</p>
      ) : (
        <>
          {/* 전체 선택 */}
          <div className="cart-select-all">
            <Checkbox
              checked={selectedItems.length === cartItems.length}
              onChange={handleSelectAll}
              label="전체 선택"
            />
            <Button
              variant="danger"
              size="sm"
              onClick={handleRemoveSelected}
              disabled={selectedItems.length === 0}
            >
              선택 삭제
            </Button>
          </div>

          {/* 공통 컴포넌트 활용 */}
          <BookListRow
            books={cartItems.map((item) => ({ ...item.book, quantity: item.quantity }))}
            onCardClick={() => {}}
            buttonActions={(book) => {
              const cartItem = cartItems.find((i) => i.book.id === book.id);
              return (
                <div className="cart-actions">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleQuantityChange(book.id, -1)}
                  >
                    -
                  </Button>
                  <span className="cart-quantity">{cartItem.quantity}</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleQuantityChange(book.id, +1)}
                  >
                    +
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveItem(book.id)}
                  >
                    삭제
                  </Button>
                </div>
              );
            }}
            // 왼쪽 체크박스 추가
            leftActions={(book) => (
              <Checkbox
                checked={selectedItems.includes(book.id)}
                onChange={() => handleSelectItem(book.id)}
              />
            )}
          />

          {/* 하단 결제 영역 */}
          <div className="cart-footer">
            <span className="cart-total">
              총 결제 금액: <strong>{totalPrice.toLocaleString()}원</strong>
            </span>
            <Button
              variant="primary"
              size="md"
              onClick={handleCheckoutSelected}
              disabled={selectedItems.length === 0}
            >
              선택 상품 구매하기
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;