// src/pages/MainPage.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import Loading from "../components/common/Loading";
import MainBanner from "../components/MainBanner";

// 💡 API 호출 함수 import
import { getProducts } from "../api/products"; 

// 💡 스타일 파일들은 외부에서 import
import "../styles/bookcardcol.scss";
import "../styles/bookcardrow.scss";
import "../styles/cdh/bookmainpage.scss";

const DEFAULT_IMAGE = "/no-image.jpg";

/* BookCard - 세로형 카드 (상품리스트) */
export function BookCardCol({ book, onClick }) {
  const handleImgError = (e) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  // 💡 수정된 가격 계산 로직: book.price가 null/undefined이면 0을 사용 후, Number()로 변환
  const price = (Number(book.price ?? 0) || 0).toLocaleString();

  return (
    <div className="book-card-col" onClick={() => onClick && onClick(book)}>
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
        <p className="book-price">{price}원</p> 
      </div>
    </div>
  );
}

/* BookCard - 가로형 카드 (장바구니/주문내역) */
export function BookCardRow({ book, onClick, children }) {
  const handleImgError = (e) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };
  
  // 💡 수정된 가격 계산 로직 적용
  const price = (Number(book.price ?? 0) || 0).toLocaleString();

  return (
    <div className="book-card-row" onClick={() => onClick && onClick(book)}>
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
        <p className="book-price">{price}원</p>
        <p className="book-stock">재고: {book.stock}권</p>
      </div>
      {children && <div className="book-card-row-actions">{children}</div>}
    </div>
  );
}

/* 세로형 리스트 */
export function BookListCol({ books, onCardClick }) {
  return (
    <div className="book-list-col">
      {books.map((book) => (
        <BookCardCol key={book.id} book={book} onClick={onCardClick} />
      ))}
    </div>
  );
}

/* MainPage */
function MainPage() {
  const [bestBooks, setBestBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();
  const bookListRef = useRef(null);
  const observerRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);

  /* 도서 클릭 */
  const handleCardClick = (book) => {
    navigate(`/book/${book.id}`);
  };

  /* ====== 일간 베스트 캐러셀 ====== */
  const BookListRowLoop = ({ books, onCardClick }) => {
    const containerRef = useRef(null);

    // 자동 스크롤
    useEffect(() => {
      if (!isAutoScrolling || books.length === 0) return;
      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % books.length);
      }, 4000);
      return () => clearInterval(autoScrollIntervalRef.current);
    }, [isAutoScrolling, books.length]);

    // index 바뀔 때 스크롤
    useEffect(() => {
      if (containerRef.current && books.length > 0) {
        const cardWidth = 320;
        containerRef.current.scrollTo({
          left: currentIndex * cardWidth,
          behavior: "smooth",
        });
      }
    }, [currentIndex, books.length]);

    // 마우스 휠로 이동
    useEffect(() => {
      const container = containerRef.current;
      if (!container || books.length === 0) return;

      const handleWheel = (e) => {
        e.preventDefault();
        if (e.deltaY > 0) {
          setCurrentIndex((prev) => (prev + 1) % books.length);
        } else {
          setCurrentIndex((prev) =>
            prev === 0 ? books.length - 1 : prev - 1
          );
        }
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }, [books.length]);

    if (!books || books.length === 0)
      return <div>도서 데이터를 불러오는 중...</div>;

    return (
      <div
        className="enhanced-carousel-wrapper"
        onMouseEnter={() => setIsAutoScrolling(false)}
        onMouseLeave={() => setIsAutoScrolling(true)}
      >
        <div className="background-decoration decoration-1" />
        <div className="background-decoration decoration-2" />

        <div className="carousel-section-header">
          <h2 className="carousel-section-title">
            <span className="title-icon-before">📚</span>
            Best 10 일간 베스트
            <span className="title-icon-after">✨</span>
          </h2>
        </div>

        <div className="enhanced-carousel-container">
          <div className="gradient-overlay left"></div>
          <div className="gradient-overlay right"></div>

          <div ref={containerRef} className="enhanced-carousel-track">
            {books.map((book, index) => (
              <div
                key={book.id}
                className="enhanced-book-card"
                onClick={() => onCardClick(book)}
              >
                <div className="card-glow" />
                <div className="bestseller-badge">👑 #{index + 1}</div>

                <div className="enhanced-book-image">
                  <div className="image-decoration decoration-float" />
                  <div className="image-decoration decoration-morph" />
                  <div className="book-placeholder">
                    <div className="book-icon">📚</div>
                    <div className="image-not-available-text">
                      Image Not Available
                    </div>
                  </div>
                </div>

                <div className="enhanced-book-details">
                  <h3 className="enhanced-book-title">{book.name}</h3>
                  <p className="enhanced-book-price">
                    💰 {(Number(book.price ?? 0) || 0).toLocaleString()}원
                  </p>
                  <p className="enhanced-book-category">{book.category}</p>
                  <p className="enhanced-book-author">
                    {book.author} · {book.publisher}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="dot-indicators">
            {books.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`dot-indicator ${
                  index === currentIndex ? "active" : ""
                }`}
              />
            ))}
          </div>

          <div className="auto-scroll-indicator">
            <span>{isAutoScrolling ? "🔄 자동 스크롤 중" : "⏸️ 일시 정지됨"}</span>
            <span>|</span>
            <span>
              {currentIndex + 1} / {books.length}
            </span>
          </div>
        </div>
      </div>
    );
  };

  /* 전체 도서 무한 스크롤 (API 호출 적용) */
  const fetchAllBooks = async (pageNum) => { 
    if (loading || !hasMore) return; 

    setLoading(true);
    
    try {
      // getProducts 호출
      const data = await getProducts({ page: pageNum, size: 20 }); 
      
      const newBooks = data.results; 

      setAllBooks((prev) => [...prev, ...newBooks]); 

      // API 응답의 next 필드 유무로 다음 페이지 존재 여부 확인
      setHasMore(!!data.next); 
      
    } catch (error) {
      console.error("전체 도서 목록 호출 실패:", error);
      setHasMore(false); 
    } finally {
      setLoading(false);
    }
  };

  /* 초기 데이터 로드 (베스트셀러와 첫 페이지 전체 도서) */
  useEffect(() => {
    // 1. 베스트셀러 데이터 호출
    const fetchBestBooks = async () => {
        try {
            // getProducts 호출: ordering을 판매량 내림차순('-stock')으로 지정
            const data = await getProducts({ page: 1, size: 10, ordering: '-stock' }); 
            setBestBooks(data.results);
        } catch (error) {
            console.error("베스트셀러 호출 실패:", error);
            setBestBooks([]);
        }
    };

    fetchBestBooks();
    
  }, []); 

  /* 무한 스크롤 옵저버 */
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, loading]
  );

  useEffect(() => {
    const option = { threshold: 1.0 };
    const observerTarget = observerRef.current;
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerTarget) observer.observe(observerTarget);
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    // page가 1 이상일 때 데이터 호출 시작
    if (page >= 1) fetchAllBooks(page); 
  }, [page]);

  useEffect(() => {
    return () => {
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
    };
  }, []);

  /* 렌더링 */
  return (
    <div className="main-page-container">
      <Header />

      <MainBanner
        image="main-banner.jpg"
        title="책으로 여는 하루"
        subtitle="좋은 책과 함께 오늘을 시작하세요.."
        buttonText="전체 도서 보기"
        buttonClick={() =>
          bookListRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <div className="base-container">
        {/* 일간 베스트 */}
        <div className="book-daily-best">
          <BookListRowLoop books={bestBooks} onCardClick={handleCardClick} />
        </div>

        {/* 전체 도서 */}
        <section className="book-list" ref={bookListRef}>
          <h2>전체 도서</h2>
          <BookListCol books={allBooks} onCardClick={handleCardClick} />
          
          {/* 로딩 중 메시지 */}
          {loading && hasMore && <Loading />}
          
          <div ref={observerRef} style={{ height: "20px" }} />
          
          {/* 마지막 도서 메시지 (SCSS 클래스 적용) */}
          {!hasMore && !loading && allBooks.length > 0 && (
            <p className="status-message no-more-books">
              마지막 도서입니다. 🥳
            </p>
          )}
          
          {/* 초기 로딩 실패/데이터 없음 메시지 (SCSS 클래스 적용) */}
          {!loading && allBooks.length === 0 && (
             <p className="status-message error-message">
              도서 목록을 불러오는 데 실패했거나 데이터가 없습니다. 🙁
            </p>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default MainPage;