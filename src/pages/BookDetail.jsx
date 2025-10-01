import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import "../styles/cdh/book-Detail.scss";
import { alertComfirm, alertSuccess } from "../utils/alert";
// API 함수 import (경로는 프로젝트 구조에 맞게 수정하세요)
import { getProductItem } from "../api/products.js"; 

function BookDetail() {
  const { id } = useParams(); 
  
  // 1. 상태 정의
  const [bookDetail, setBookDetail] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. 데이터 로딩 로직 (useEffect)
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

        // API 함수 호출 시, useParams()로 가져온 id를 인수로 전달
        const res = await getProductItem(id); 
            console.log("API 응답으로 받은 price 타입:", typeof res.price);
    console.log("API 응답으로 받은 price 값:", res.price);
        setBookDetail(res); 

      } catch (e) {
        console.error(`도서(ID: ${id}) 정보 불러오기 실패 : `, e);
        setError(e.message || "도서 상세 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadBookDetail();
  }, [id]); // id가 변경될 때마다 재실행

  // --- 로딩/오류/데이터 없음 처리 UI ---
  if (loading) return (
    <div className="book-detail-page"><Header /><div className="base-container">
      <main className="book-detail-container"><p>도서 정보를 불러오는 중입니다...</p></main>
    </div><Footer /></div>
  );

  if (error) return (
    <div className="book-detail-page"><Header /><div className="base-container">
      <main className="book-detail-container"><p className="error-message">오류 발생: {error}</p></main>
    </div><Footer /></div>
  );
  
  if (!bookDetail) return (
    <div className="book-detail-page"><Header /><div className="base-container">
      <main className="book-detail-container"><p>요청하신 도서 정보를 찾을 수 없습니다.</p></main>
    </div><Footer /></div>
  );

  const book = bookDetail;

  // 3. Description 내용 나누기 로직
  // 줄바꿈 문자를 기준으로 내용을 배열로 분리하고, 빈 문자열은 제거
  const descriptionLines = book.description 
    ? book.description.split('\n').filter(line => line.trim() !== '') 
    : [];
    
  const PREVIEW_LINE_COUNT = 3;
  const previewLines = descriptionLines.slice(0, PREVIEW_LINE_COUNT); 
  const remainingLines = descriptionLines.slice(PREVIEW_LINE_COUNT); 

  // 상단에 표시할 미리보기 텍스트
  const previewDescription = previewLines.join('\n');
  
  // 하단에 이어서 나올 나머지 텍스트
  const remainingDescription = remainingLines.join('\n');


  // 4. 하단 상세 정보 대체 콘텐츠 로직
  let bottomContent = null;

// BookDetail.jsx 파일 내의 formatPrice 함수
const formatPrice = (price) => {
  // 1. 가격 데이터를 숫자로 변환 (API에서 문자열로 왔으니 필수!)
  const numericPrice = Number(price);

  // 2. 변환된 값이 유효한 숫자인지 확인
  if (isNaN(numericPrice)) {
    return '가격 미정';
  }

  // ⭐️⭐️⭐️ 중요: 숫자로 변환된 numericPrice에 대해 toLocaleString을 호출합니다.
  return numericPrice.toLocaleString('ko-KR', { 
      maximumFractionDigits: 0 // 소수점 이하를 0으로 설정하여 제거
  }); 
};
  
  if (remainingDescription) {
      // 1순위: 분할하고 남은 내용이 있을 경우
      bottomContent = <p className="description-rest">{remainingDescription}</p>;
      
  } else if (book.description && book.description.trim().length > 0) {
      // 2순위: 남은 내용이 없지만, description 자체가 있다면 전체 내용을 다시 표시
      bottomContent = (
          <>
              <p className="description-rest">
                  * 상단 소개 내용이 짧아 전체 내용을 하단에 재표시합니다. *
              </p>
              <p className="description-rest-full">{book.description}</p>
          </>
      );
  } else {
      // 3순위: description 자체가 없거나 너무 짧을 경우 (대체 텍스트)
      const formattedPrice = formatPrice(book.price);
      
      // ⭐ 지정 텍스트 조합
      const fallbackText = `${book.name || '이 도서'}은 정가 ${formattedPrice}원에 기다리고 있습니다.`;
      
      bottomContent = (
          <div className="book-metadata-fallback">
              <p className="fallback-message">
                  {fallbackText}
              </p>
              <ul>
                  <li>**저자:** {book.author || '정보 없음'}</li>
                  <li>**출판사:** {book.publisher || '정보 없음'}</li>
              </ul>
          </div>
      );
  }


  // --- 장바구니/구매 핸들러 ---
  const handleCartAdd = async () => {
    const alert = await alertComfirm("장바구니에 담겠습니까?", "예를 누르면 장바구니에 상품이 담깁니다");
    if (!alert.isConfirmed) return;
    
    console.log(`장바구니 추가 API호출: 도서 ID ${book.id}`);
    // 장바구니 API 호출 로직 (TODO)
    
    // book.name 사용
    await alertSuccess("장바구니", `선택하신 도서(${book.name})가 장바구니에 담겼습니다.`);
  };

  const handlebuyAdd = async () => {
    const alert = await alertComfirm("상품을 구매하시겠습니까?", "예를 누르면 상품구매를 진행합니다");
    if (!alert.isConfirmed) return;
    
    console.log(`구매 API 호출: 도서 ID ${book.id}`);
    // 구매 API 호출 로직 (TODO)
    
    // book.name 사용
    await alertSuccess("구매 완료", `선택하신 도서(${book.name})의 구매가 완료되었습니다.`);
  };


  // --- 최종 렌더링 (JSX) ---
  return (
    <>
      <Header />
      <div className="book-detail-page">
        <div className="base-container">

          <main className="book-detail-container"> 
            <div className="book-detail-image">
              <img src={book.image} alt={book.name} /> 
            </div>

            <div className="book-detail">
              <div className="book-detail-up">
                {/* API 필드 'name' 사용 (도서 제목) */}
                <h1>{book.name}</h1> 
                <p>
                  저자: {book.author} | 출판사: {book.publisher}
                </p>
              </div>

              <div className="book-detail-bottom">
                
                <section className="book-detail-description">
                  <h2 className="book-introduction">소 개</h2>
                  
                  {/* 1. 상단: description의 미리 보기(3줄)만 표시 */}
                  <p className="description-preview">{previewDescription}</p>
                  
                </section>

                <div className="bottom-flex-wrapper">
                  
                  <div className="price-area-wrapper">
                    <section className="book-price">
                      <span className="original-price">
                        {/* ⭐️ formatPrice 함수를 사용하여 가격 표시 */}
                        가격: {formatPrice(book.price)}원
                      </span>
                    </section>
                  </div>
                  
                  <div className="book-actions">
                    <Button onClick={handleCartAdd} size="lg" variant="secondary">장바구니</Button>
                    <Button onClick={handlebuyAdd} size="lg" variant="primary">구매하기</Button>
                  </div>
                  
                </div>
              </div>
            </div>
          </main>
          
          {/* 2. 하단 '상세 정보' 섹션 */}
          {(remainingDescription || book.description) && ( 
              <section className="book-summary-section full-width-section">
                <h2 className="book-summary-title">상세 정보</h2>
                
                {bottomContent}
                
                {/* API에 summary 필드가 따로 있다면 그 내용을 여기에 표시 */}
                {book.summary && <p className="summary-original">{book.summary}</p>}
                
              </section>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BookDetail;