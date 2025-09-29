import { useState, useEffect } from "react";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import { BookListRow } from "../components/common/BookListRow";
import "../styles/cart.scss";
import { Checkbox } from "../components/common/CheckRadio";
import useTitle from "../hooks/useTitle";

const DUMMY_CART = [
  {
    book: {
      id: 1,
      name: "자바스크립트",
      category: "프로그래밍",
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
  {
    book: {
      id: 3,
      name: "자바스크립트3",
      category: "프로그래밍",
      author: "이름3",
      publisher: "한빛미디어3",
      price: 18000,
      stock: 0,
      image_url: "",
    },
    quantity: 1,
  },
];

function CartPage() {
  useTitle("장바구니");
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("available");

  useEffect(() => {
    setTimeout(() => {
      setCartItems(DUMMY_CART);
      setSelectedItems(DUMMY_CART.map((item) => item.book.id)); //전체선택 자동
      setIsLoading(false);
    }, 500);
  }, []);

  // 구매가능/품절 상품 분리
  const availableItems = cartItems.filter((item) => item.book.stock > 0);
  const soldOutItems = cartItems.filter((item) => item.book.stock === 0);
  const filteredItems =
    activeTab === "available" ? availableItems : soldOutItems;

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
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
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
    setCartItems(
      cartItems.filter((item) => !selectedItems.includes(item.book.id))
    );
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

  if (isLoading)
    return <Loading loadingText="장바구니 불러오는 중" size={40} />;

  return (
    <div className="cart-page">
      <h2>장바구니</h2>

      {/* 탭 */}
      <div className="cart-tabs">
        <div
          className={`cart-tab ${activeTab === "available" ? "active" : ""}`}
          onClick={() => setActiveTab("available")}
        >
          구매 가능 상품 <span className="badge">{availableItems.length}</span>
        </div>
        <div
          className={`cart-tab ${activeTab === "soldout" ? "active" : ""}`}
          onClick={() => setActiveTab("soldout")}
        >
          품절된 상품 <span className="badge">{soldOutItems.length}</span>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <p>
          {activeTab === "available"
            ? "판매중인 상품이 없습니다."
            : "품절된 상품이 없습니다."}
        </p>
      ) : (
        <>
          {/* 전체 선택 */}
          {activeTab === "available" && (
            <div className="cart-select-all">
              <Checkbox
                checked={selectedItems.length === cartItems.length}
                onChange={handleSelectAll}
                label="전체 선택"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRemoveSelected}
                disabled={selectedItems.length === 0}
              >
                선택 삭제
              </Button>
            </div>
          )}

          {/* 북카드리스트 */}
          <BookListRow
            books={filteredItems.map((item) => ({
              ...item.book,
              quantity: item.quantity,
              isSoldOut: item.book.stock === 0, // soldout 표시 flag
            }))}
            onCardClick={() => {}}
            buttonActions={(book) => {
              const cartItem = cartItems.find((i) => i.book.id === book.id);
              return (
                <div className="cart-actions">
                  {activeTab === "available" ? (
                    <>
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
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRemoveItem(book.id)}
                      >
                        삭제
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRemoveItem(book.id)}
                    >
                      삭제
                    </Button>
                  )}
                </div>
              );
            }}
            leftActions={(book) =>
              activeTab === "available" ? (
                <Checkbox
                  checked={selectedItems.includes(book.id)}
                  onChange={() => handleSelectItem(book.id)}
                />
              ) : null
            }
          />

          {/* 하단 결제 영역 */}
          {activeTab === "available" && (
            <div className="cart-footer">
              <span className="cart-total">
                총 결제금액 <span>{totalPrice.toLocaleString()}원</span>
              </span>
              <Button
                variant="primary"
                size="md"
                onClick={handleCheckoutSelected}
                disabled={selectedItems.length === 0}
              >
                구매하기
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CartPage;
