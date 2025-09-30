import { useState, useEffect, useCallback, useRef } from "react";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import { BookListRow } from "../components/common/BookListRow";
import "../styles/cart.scss";
import { Checkbox } from "../components/common/CheckRadio";
import useTitle from "../hooks/useTitle";
import { getCart, updateCartItem } from "../api/cart";
import { alertError } from "../utils/alert";
import { useNavigate } from "react-router-dom";

function CartPage() {
  useTitle("장바구니");

  const [cartItems, setCartItems] = useState([]); // 장바구니 상품 배열
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 상품 id 배열
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [activeTab, setActiveTab] = useState("available"); // 탭 상태 (가능/품절

  const [savingIds, setSavingIds] = useState(new Set()); // 수량 변경 중인 상품id들을 저장하는 Set 상태(개별 버튼 disabled 제어용)

  const availableItems = cartItems.filter((item) => item.book?.stock > 0); // 재고 있는 구매 가능 상품 필터링
  const soldOutItems = cartItems.filter((item) => item.book?.stock === 0); // 품절된 상품 필터링
  const filterItems = activeTab === "available" ? availableItems : soldOutItems; // 탭 상태에 따라 보여질 상품 리스트 설정

  const prevSelectedItemIdsRef = useRef([]); //이전 선택상품 id들 저장용 ref (변경 감지해야해서 추가)
  const availableItemIds = availableItems.map((item) => item.book.id); // 현재 구매 가능 상품id 리스트
  const navigate = useNavigate();

  // 구매 가능 상품 리스트가 변경되면 선택 상품도 초기화 (기존과 다르면)
  useEffect(() => {
    const prevSelectedIds = prevSelectedItemIdsRef.current;
    const isSame =
      prevSelectedIds.length === availableItemIds.length &&
      prevSelectedIds.every((v, i) => v === availableItemIds[i]);

    if (!isSame) {
      setSelectedItems(availableItemIds); // 선택 상품 id 갱신
      prevSelectedItemIdsRef.current = availableItemIds; //ref 동기화
    }
    setIsLoading(false);
  }, [availableItemIds]);

  // 마운트시 장바구니 데이터 api 호출 및 상태 세팅
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await getCart();
        const items = Array.isArray(res[0]?.items) ? res[0].items : [];
        const mappedItems = items.map((item) => ({
          book: {
            id: item.product_id,
            name: item.product_name,
            author: item.product_author,
            publisher: item.product_publisher,
            price: Number(item.product_price),
            stock: item.product_stock,
            image_url: item.product_image,
          },
          quantity: item.quantity,
        }));
        setCartItems(mappedItems);
      } catch (e) {
        console.error("장바구니 불러오기 실패:", e);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // 수량 변경 (재고 초과 불가 조건 추가함)
  const handleQuantityChange = useCallback(
    async (bookId, delta) => {
      const item = cartItems.find((i) => i.book.id === bookId);
      if (!item) return;

      const newQuantity = item.quantity + delta;

      // 재고 초과 또는 1 미만일 때 알림창 띄우고 종료
      if (newQuantity < 1) {
        alertError("수량 오류", "수량은 최소 1개부터 선택 가능합니다");
        return;
      }
      if (newQuantity > item.book.stock) {
        alertError(
          "재고 부족",
          "재고가 부족하여 더 이상 수량을 늘릴 수 없습니다"
        );
        return;
      }

      setSavingIds((s) => new Set(s.add(bookId))); //해당상품 수량 변경중 상태 설정

      try {
        const res = await updateCartItem(bookId, newQuantity);
        setCartItems((prev) =>
          prev.map((i) =>
            i.book.id === res.product_id
              ? {
                  ...i,
                  quantity: res.quantity,
                  book: {
                    ...i.book,
                    name: res.product_name,
                    price: Number(res.price),
                  },
                }
              : i
          )
        );
      } catch {
        alertError("수량 변경 실패", "수량 변경 중 오류가 발생했습니다");
      } finally {
        setSavingIds((s) => {
          const newSet = new Set(s);
          newSet.delete(bookId);
          return newSet;
        });
      }
    },
    [cartItems]
  );

  // 단일 상품 삭제
  const handleRemoveItem = useCallback(
    (bookId) => {
      const filtered = cartItems.filter((item) => item.book.id !== bookId);
      setCartItems(filtered);
      setSelectedItems((prev) => prev.filter((id) => id !== bookId));
    },
    [cartItems]
  );

  // 개별 선택 토글
  const handleSelectItem = useCallback((bookId) => {
    setSelectedItems((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  }, []);

  // 전체선택 or 해제
  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === availableItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(availableItems.map((item) => item.book.id));
    }
  }, [selectedItems, availableItems]);

  // 선택 삭제 (품절 상품은 삭제 불가)
  const handleRemoveSelected = useCallback(() => {
    const filtered = cartItems.filter(
      (item) => item.book.stock === 0 || !selectedItems.includes(item.book.id)
    );
    setCartItems(filtered);
    setSelectedItems([]);
  }, [cartItems, selectedItems]);

  //구매하기 버튼 클릭시 상품리스트만 넘겨줌
  const handleCheckoutSelected = useCallback(async () => {
    try {
      const latestRes = await getCart();
      const latestItems = Array.isArray(latestRes[0]?.items)
        ? latestRes[0].items
        : [];

      // 선택된 상품 필터링
      const selectedProducts = cartItems.filter((item) =>
        selectedItems.includes(item.book.id)
      );

      // 최신 재고와 수량 검사
      for (const selected of selectedProducts) {
        const latest = latestItems.find(
          (li) => li.product_id === selected.book.id
        );
        if (!latest) {
          alertError("구매하기 오류", `${selected.book.name} 상품 정보가 없습니다`);
          return;
        }
        if (selected.quantity > latest.product_stock) {
          alertError(
            "상품 재고 부족",
            `${selected.book.name} 상품의 재고가 부족합니다. 재고: ${latest.product_stock}`
          );
          return;
        }
      }

      if (selectedProducts.length === 0) {
        alertError("구매할 상품을 선택해주세요");
        return;
      }

      // 모든검증 통과 후에 페이지 이동
      navigate("/checkout", { state: { buyProducts: selectedProducts } });
    } catch {
      alertError("구매하기 오류", "구매 목록을 확인하는 중 문제가 발생했습니다");
    }
  }, [cartItems, selectedItems, navigate]);

  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.book.id))
    .reduce((acc, item) => acc + (item.book.price || 0) * item.quantity, 0);

  if (isLoading)
    return <Loading loadingText="장바구니 불러오는 중" size={40} />;

  return (
    <div className="cart-page">
      <h2>장바구니</h2>

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

      {filterItems.length === 0 ? (
        <p>
          {activeTab === "available"
            ? "장바구니에 상품이 없습니다."
            : "품절된 상품이 없습니다."}
        </p>
      ) : (
        <>
          {activeTab === "available" && availableItems.length > 0 && (
            <div className="cart-select-all">
              <Checkbox
                checked={
                  selectedItems.length > 0 &&
                  selectedItems.length === availableItems.length
                }
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

          <BookListRow
            books={filterItems.map((item) => ({
              ...item.book,
              quantity: item.quantity,
              isSoldOut: item.book.stock === 0,
            }))}
            onCardClick={() => {}}
            buttonActions={(book) => {
              const cartItem = cartItems.find((i) => i.book.id === book.id);
              const isSaving = savingIds.has(book.id);
              return activeTab === "available" ? (
                <div className="cart-actions">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleQuantityChange(book.id, -1)}
                    disabled={savingIds.has(book.id) || cartItem?.quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="cart-quantity">{cartItem?.quantity}</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleQuantityChange(book.id, +1)}
                    disabled={savingIds.has(book.id)}
                  >
                    +
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRemoveItem(book.id)}
                    disabled={isSaving}
                  >
                    삭제
                  </Button>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRemoveItem(book.id)}
                  disabled={isSaving}
                >
                  삭제
                </Button>
              );
            }}
            leftActions={(book) =>
              activeTab === "available" ? (
                <Checkbox
                  checked={selectedItems.includes(book?.id)}
                  onChange={() => handleSelectItem(book?.id)}
                />
              ) : null
            }
          />

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
