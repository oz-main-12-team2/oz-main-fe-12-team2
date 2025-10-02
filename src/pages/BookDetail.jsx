import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/common/Button";
import "../styles/cdh/book-Detail.scss";
import { alertComfirm, alertSuccess, alertError } from "../utils/alert"; // alertError 추가
// API 함수 import (경로는 프로젝트 구조에 맞게 수정하세요)
import { getProductItem } from "../api/products.js";
// 장바구니 API 함수 import (경로 확인 필수)
import { addCart, getCart } from "../api/cart";
// Zustand 스토어 및 useBuyMove 훅 import
import useCartStore from "../stores/cartStore";
import useBuyMove from "../hooks/useBuyMove";

// formatPrice 함수 (이전과 동일)
const formatPrice = (price) => {
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    return "가격 미정";
  }
  return numericPrice.toLocaleString("ko-KR", {
    maximumFractionDigits: 0,
  });
};

function BookDetail() {
  const { id } = useParams();

  const [bookDetail, setBookDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Zustand 상태 액션 및 useBuyMove 훅 호출
  const setStoreCartItems = useCartStore((state) => state.setCartItems);
  const navigateToCheckout = useBuyMove();

  useEffect(() => {
    if (!id) {
      setError("도서 ID가 유효하지 않습니다.");
      setLoading(false);
      return;
    }

    const loadBookDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getProductItem(id);
        setBookDetail(res);
      } catch (e) {
        console.error(`도서(ID: ${id}) 정보 불러오기 실패 : `, e);
        setError(
          e.message || "도서 상세 정보를 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookDetail();
  }, [id]);

  // --- 로딩/오류/데이터 없음 처리 UI (이전과 동일) ---
  if (loading)
    return (
      <div className="book-detail-page">
        <Header />
        <div className="base-container">
          <main className="book-detail-container">
            <p>도서 정보를 불러오는 중입니다...</p>
          </main>
        </div>
        <Footer />
      </div>
    );

  if (error)
    return (
      <div className="book-detail-page">
        <Header />
        <div className="base-container">
          <main className="book-detail-container">
            <p className="error-message">오류 발생: {error}</p>
          </main>
        </div>
        <Footer />
      </div>
    );

  if (!bookDetail)
    return (
      <div className="book-detail-page">
        <Header />
        <div className="base-container">
          <main className="book-detail-container">
            <p>요청하신 도서 정보를 찾을 수 없습니다.</p>
          </main>
        </div>
        <Footer />
      </div>
    );

  const book = bookDetail;

  // 3. Description 내용 나누기 로직 (이전과 동일)
  const descriptionLines = book.description
    ? book.description
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<\/div>/gi, "\n")
        .replace(/\n\s*\n/g, "\n")
        .split("\n")
        .filter((line) => line.trim() !== "")
    : [];

  const PREVIEW_LINE_COUNT = 3;
  const previewLines = descriptionLines.slice(0, PREVIEW_LINE_COUNT);
  const previewDescription = previewLines.join("\n");
  const remainingLines = descriptionLines.slice(PREVIEW_LINE_COUNT);
  const remainingDescription = remainingLines.join("\n");

  // 4. 하단 상세 정보 콘텐츠 로직 (이전과 동일)
  let bottomContent = null;

  if (remainingDescription) {
    bottomContent = <p className="description-rest">{remainingDescription}</p>;
  } else {
    const formattedPrice = formatPrice(book.price);
    const fallbackText = `${
      book.name || "이 도서"
    }은 저자 여러분들의 많은 관심과 기대를 바라며 정가: ${formattedPrice}원에 기다리고 있습니다.`;

    bottomContent = (
      <div className="book-metadata-fallback">
        <p className="fallback-message">{fallbackText}</p>
      </div>
    );
  }

  // --- 핸들러 및 최종 렌더링 수정 ---
  // 장바구니 추가 핸들러 (API 호출 및 Zustand 갱신)
  const handleCartAdd = async () => {
    const alert = await alertComfirm(
      "장바구니에 담겠습니까?",
      "예를 누르면 장바구니에 상품이 담깁니다"
    );
    if (!alert.isConfirmed) return;

    try {
      await addCart({ productId: book.id, quantity: 1 }); // 객체 형태로 인자 전달 (cart.js 정의에 따름)

      // 2. 전체 장바구니 데이터 다시 불러오기
      const res = await getCart();
      const items = Array.isArray(res[0]?.items) ? res[0].items : [];

      // 3. Zustand 상태 갱신을 위해 API 응답을 클라이언트 상태 형태로 매핑 (CartPage와 동일한 형식)
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

      // 4. Zustand 스토어 갱신 (헤더 카운트 동기화)
      setStoreCartItems(mappedItems);

      await alertSuccess(
        "장바구니",
        `선택하신 도서(${book.name})가 장바구니에 담겼습니다.`
      );
    } catch (e) {
      console.error("장바구니 추가 실패:", e);
      alertError(
        "장바구니 오류",
        "상품을 장바구니에 추가하는 중 오류가 발생했습니다."
      );
    }
  };

  // 구매하기 핸들러 (useBuyMove 연결)
  const handlebuyAdd = async () => {
    const alert = await alertComfirm(
      "상품을 구매하시겠습니까?",
      "예를 누르면 상품구매를 진행합니다"
    );
    if (!alert.isConfirmed) return;

    const productsToBuy = [
      {
        book: book, // 현재 도서 상세 정보 객체
        quantity: 1, // 상세 페이지에서 '바로 구매'는 수량 1개로 가정
      },
    ];

    // 'direct' 모드로 설정하여 재고 확인 없이 바로 이동
    console.log(`즉시 구매 이동 호출: 도서 ID ${book.id}`);
    navigateToCheckout(productsToBuy, "direct");
  };

  return (
    <>
      <div className="book-detail-page">
        <div className="base-container">
          <main className="book-detail-container">
            <div className="book-detail-image">
              <img src={book.image} alt={book.name} />
            </div>

            <div className="book-detail">
              <div className="book-detail-up">
                <h1>{book.name}</h1>
                <p>
                  저자: {book.author} | 출판사: {book.publisher}
                </p>
              </div>

              <div className="book-detail-bottom">
                <section className="book-detail-description">
                  <h2 className="book-introduction">소 개</h2>
                  <p className="description-preview">{previewDescription}</p>
                </section>

                <div className="bottom-flex-wrapper">
                  <div className="price-area-wrapper">
                    <section className="book-price">
                      <span className="original-price">
                        가격: {formatPrice(book.price)}원
                      </span>
                    </section>
                  </div>

                  <div className="book-actions">
                    {/* 수정된 handleCartAdd 함수 연결 */}
                    <Button
                      onClick={handleCartAdd}
                      size="lg"
                      variant="secondary"
                    >
                      장바구니
                    </Button>
                    {/* 수정된 handlebuyAdd 함수 연결 */}
                    <Button onClick={handlebuyAdd} size="lg" variant="primary">
                      구매하기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* 하단 '상세 정보' 섹션 */}
          {book.description && (
            <section className="book-summary-section full-width-section">
              <h2 className="book-summary">상세 정보</h2>
              {bottomContent}

              {book.summary && (
                <p className="summary-original">{book.summary}</p>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
}

export default BookDetail;