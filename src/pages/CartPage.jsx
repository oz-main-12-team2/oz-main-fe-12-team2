import { useState, useEffect, useCallback, useRef } from "react";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import { BookListRow } from "../components/common/BookListRow";
import "../styles/cart.scss";
import { Checkbox } from "../components/common/CheckRadio";
import useTitle from "../hooks/useTitle";
import { deleteCartItem, getCart, updateCartItem } from "../api/cart";
import { alertComfirm, alertError, alertSuccess } from "../utils/alert";
import useCartStore from "../stores/cartStore";
import useBuyMove from "../hooks/useBuyMove";

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
  const setStoreCartItems = useCartStore((state) => state.setCartItems);
  const buyMove = useBuyMove();

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
            category: item.product_category,
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
          "재고가 부족하여 더 이상 수량을 추가할 수 없습니다"
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
                    price: Number(res.product_price ?? res.price ?? 0),
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
    async (bookId) => {
      setSavingIds((s) => new Set(s).add(bookId)); // 로딩 시작
      try {
        const alert = await alertComfirm(
          "장바구니 삭제",
          "정말 삭제 하시겠습니까?"
        );
        if (!alert.isConfirmed) return;
        await deleteCartItem(bookId);

        // 로컬 상태 갱신
        const filtered = cartItems.filter((item) => item.book.id !== bookId);
        setCartItems(filtered);

        // 전역 상태도 갱신 (헤더 카운트 동기화 위해)
        setStoreCartItems(filtered);

        // 선택 상태에서 삭제 상품 제거
        setSelectedItems((prev) => prev.filter((id) => id !== bookId));
        await alertSuccess("장바구니 삭제 성공", "삭제가 완료되었습니다");
      } catch {
        alertError("장바구니 삭제 오류", "상품 삭제 중 오류가 발생했습니다.");
      }
      setSavingIds((s) => {
        const newSet = new Set(s);
        newSet.delete(bookId);
        return newSet;
      });
    },
    [cartItems, setStoreCartItems]
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
  const handleRemoveSelected = useCallback(async () => {
    if (selectedItems.length === 0) return; // 선택이 없으면 빠져나감
    const alert = await alertComfirm(
      "장바구니 선택 삭제",
      "선택한 상품들을 정말 삭제하시겠습니까?"
    );
    if (!alert.isConfirmed) return;

    setSavingIds((s) => {
      const newSet = new Set(s);
      selectedItems.forEach((id) => newSet.add(id));
      return newSet;
    });

    try {
      // 선택된 상품들을 순차적으로 삭제 API 호출
      for (const productId of selectedItems) {
        await deleteCartItem(productId);
      }

      // 삭제 후 로컬 상태 갱신 (선택된 상품 제외)
      const filtered = cartItems.filter(
        (item) => !selectedItems.includes(item.book.id)
      );
      setCartItems(filtered);

      // 전역 상태에도 반영
      setStoreCartItems(filtered);

      // 선택 상태 초기화
      setSelectedItems([]);

      await alertSuccess("장바구니 삭제 성공", "선택 상품들이 삭제되었습니다.");
    } catch {
      alertError(
        "삭제 실패",
        "장바구니 선택 상품 삭제 중 오류가 발생했습니다."
      );
    } finally {
      // 로딩 상태에서 제외
      setSavingIds((s) => {
        const newSet = new Set(s);
        selectedItems.forEach((id) => newSet.delete(id));
        return newSet;
      });
    }
  }, [cartItems, selectedItems, setStoreCartItems]);

  //구매하기 버튼 클릭시 상품리스트만 넘겨줌
  const handleCheckoutSelected = useCallback(() => {
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.book.id)
    );

    buyMove(selectedProducts);
  }, [cartItems, selectedItems, buyMove]);

  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.book.id))
    .reduce((acc, item) => acc + (item.book.price || 0) * item.quantity, 0);

  if (isLoading)
    return <Loading loadingText="장바구니 불러오는 중" size={40} />;

  return (
    <div className="cart-page">
      <p className="cart-title">장바구니</p>

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
        <p className="cart-empty-message">
          {activeTab === "available"
            ? "장바구니에 상품이 없습니다."
            : "장바구니에 품절된 상품이 없습니다."}
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
