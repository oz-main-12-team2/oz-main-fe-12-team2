import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/common/Button";
import "../styles/cdh/book-Detail.scss";
import { alertComfirm, alertSuccess } from "../utils/alert";
// API 함수 import (경로는 프로젝트 구조에 맞게 수정하세요)
import { getProductItem } from "../api/products.js";

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

  // 3. Description 내용 나누기 로직

  const descriptionLines = book.description
    ? book.description
        // ⭐️ 1단계: <br>과 닫는 </p>, </div> 같은 흔한 HTML 줄 바꿈 태그를 \n으로 대체하여 통일
        .replace(/<br\s*\/?>/gi, "\n") // <br>, <br/>, <BR> 등 처리
        .replace(/<\/p>/gi, "\n") // 닫는 </p> 태그 처리
        .replace(/<\/div>/gi, "\n") // 닫는 </div> 태그 처리

        // 2단계: 여러 개의 \n이 연속될 경우 하나로 합쳐서 중복 줄바꿈 방지
        .replace(/\n\s*\n/g, "\n")

        // 3단계: 통일된 \n 문자를 기준으로 배열로 분리
        .split("\n")

        // 4단계: 빈 문자열은 제거
        .filter((line) => line.trim() !== "")
    : [];

  // ⭐️ 3줄 기준으로 변경
  const PREVIEW_LINE_COUNT = 3;

  // '소개'에 표시할 미리 보기 (최대 3줄)
  const previewLines = descriptionLines.slice(0, PREVIEW_LINE_COUNT);
  const previewDescription = previewLines.join("\n");

  // '상세 정보'에 표시할 나머지 내용 (4번째 줄부터)
  const remainingLines = descriptionLines.slice(PREVIEW_LINE_COUNT);
  const remainingDescription = remainingLines.join("\n");

  // 4. 하단 상세 정보 콘텐츠 로직 (3줄 초과/이하에 따라 분기)
  let bottomContent = null;

  if (remainingDescription) {
    // 조건 1: 3줄을 초과한 내용이 있을 경우 (remainingDescription이 존재)
    // -> '상세 정보'에 나머지 내용을 이어서 표시
    bottomContent = <p className="description-rest">{remainingDescription}</p>;
  } else {
    // 조건 2: 3줄 이하의 내용만 있거나 (remainingDescription이 비어있음)
    // -> '상세 정보'에 대체 텍스트만 표시

    const formattedPrice = formatPrice(book.price);

    // 요청하신 지정 텍스트 조합
    const fallbackText = `${
      book.name || "이 도서"
    }은 저자 여러분들의 많은 관심과 기대를 바라고 ${formattedPrice}원에 기다리고 있습니다.`;

    bottomContent = (
      <div className="book-metadata-fallback">
        <p className="fallback-message">{fallbackText}</p>
      </div>
    );
  }

  // --- 핸들러 및 최종 렌더링 (이전과 동일) ---
  const handleCartAdd = async () => {
    const alert = await alertComfirm(
      "장바구니에 담겠습니까?",
      "예를 누르면 장바구니에 상품이 담깁니다"
    );
    if (!alert.isConfirmed) return;

    console.log(`장바구니 추가 API호출: 도서 ID ${book.id}`);
    await alertSuccess(
      "장바구니",
      `선택하신 도서(${book.name})가 장바구니에 담겼습니다.`
    );
  };

  const handlebuyAdd = async () => {
    const alert = await alertComfirm(
      "상품을 구매하시겠습니까?",
      "예를 누르면 상품구매를 진행합니다"
    );
    if (!alert.isConfirmed) return;

    console.log(`구매 API 호출: 도서 ID ${book.id}`);
    await alertSuccess(
      "구매 완료",
      `선택하신 도서(${book.name})의 구매가 완료되었습니다.`
    );
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

                  {/* 상단: description의 미리 보기(최대 3줄)만 표시 */}
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
                    <Button
                      onClick={handleCartAdd}
                      size="lg"
                      variant="secondary"
                    >
                      장바구니
                    </Button>
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
