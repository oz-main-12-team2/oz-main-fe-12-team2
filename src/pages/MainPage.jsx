// src/pages/MainPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// ⭐️ InfiniteScroll 라이브러리 임포트 추가
import InfiniteScroll from "react-infinite-scroll-component";
import NavBar from "../components/layout/NavBar";
import Loading from "../components/common/Loading";
import MainBanner from "../components/MainBanner";
import useTitle from "../hooks/useTitle.js";

import { getProducts } from "../api/products";
import "../styles/cdh/bookmainpage.scss";

const DEFAULT_IMAGE = "/no-image.jpg";

/* BookCard - 세로형 카드 */
export function BookCardCol({ book, onClick }) {
  const handleImgError = (e) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };
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

/* BookListCol - 세로형 리스트 */
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
  useTitle();

  const [bestBooks, setBestBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const navigate = useNavigate();
  const bookListRef = useRef(null);

  const handleCardClick = (book) => {
    navigate(`/book/${book.id}`);
  };

  const handleScrollToBookList = () => {
    const headerHeight = document.querySelector(".header")?.offsetHeight || 0;
    const targetPos = bookListRef.current?.offsetTop || 0;
    const offsetPx = 70;

    window.scrollTo({
      top: targetPos - headerHeight - offsetPx,
      behavior: "smooth",
    });
  };
  
  /* -------------------------
     BookListRowLoop (일간 베스트 캐러셀)
     ------------------------- */
  // BookListRowLoop (수정 완료)
  const BookListRowLoop = ({ books, onCardClick }) => {
    const containerRef = useRef(null);
    const autoScrollIntervalRef = useRef(null);

    const visibleCount = 4; // 한 번에 보여줄 카드 수
    const cardWidth = 300 + 20; // 카드 너비 + gap

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);

    // 루프용 배열: 원본 배열 뒤에 visibleCount만큼 앞쪽 복사
    const extendedBooks = [...books, ...books.slice(0, visibleCount)];

    // 이미지 에러 핸들러
    const handleImgError = (e) => {
      e.currentTarget.src = DEFAULT_IMAGE;
      e.currentTarget.style.opacity = 0.5;
    };

    // 자동 슬라이드
    useEffect(() => {
      if (!isAutoScrolling || books.length === 0) return;

      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 4000);

      return () => clearInterval(autoScrollIntervalRef.current);
    }, [books.length, isAutoScrolling]);

    // currentIndex에 따라 스크롤 이동 + 루프 처리
    useEffect(() => {
      const container = containerRef.current;
      if (!container || books.length === 0) return;

      container.scrollTo({
        left: currentIndex * cardWidth,
        behavior: "smooth",
      });

      if (currentIndex >= books.length) {
        setTimeout(() => {
          container.scrollLeft = 0;
          setCurrentIndex(0);
        }, 300); // 스크롤 애니메이션 후 초기화
      }
    }, [currentIndex, books.length, cardWidth]); // ← cardWidth 안전하게 추가

    // 마우스 휠 -> 가로 스크롤 변환
    useEffect(() => {
      const container = containerRef.current;
      if (!container || books.length === 0) return;

      const handleWheel = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const multiplier = 1;
        container.scrollLeft += e.deltaY * multiplier;

        const newIndex = Math.round(container.scrollLeft / cardWidth);
        setCurrentIndex(newIndex);
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }, [books.length, cardWidth]); // ← cardWidth 추가

    if (!books || books.length === 0)
      return (
        <div className="loading-placeholder">
          베스트셀러 데이터를 불러오는 중...
        </div>
      );

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
            <span className="title-icon-before" />
            Best 10 일간 베스트
          </h2>
        </div>

        <div className="enhanced-carousel-container">
          <div className="gradient-overlay left" />
          <div className="gradient-overlay right" />

          <div ref={containerRef} className="enhanced-carousel-track">
            {extendedBooks.map((book, index) => (
              <div
                key={`${book.id}-${index}`}
                className="enhanced-book-card"
                onClick={() => onCardClick(book)}
              >
                <div className="card-glow" />
                <div className="bestseller-badge">
                  👑 #{(index % books.length) + 1}
                </div>

                <div className="enhanced-book-image">
                  <img
                    src={book.image || DEFAULT_IMAGE}
                    alt={book.name}
                    onError={handleImgError}
                  />
                  <div className="image-decoration decoration-float" />
                  <div className="image-decoration decoration-morph" />
                </div>

                <div className="enhanced-book-details">
                  <h3 className="enhanced-book-title">{book.name}</h3>
                  <p className="enhanced-book-price">
                    {(Number(book.price ?? 0) || 0).toLocaleString()}원
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
                  index === currentIndex % books.length ? "active" : ""
                }`}
                aria-label={`go to ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* 전체 도서 무한 스크롤 */
  const fetchAllBooks = useCallback(async () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);

    try {
      const nextPage = page + 1;
      const data = await getProducts({ page: nextPage, size: 8 });
      const newBooks = data?.results ?? [];

      if (newBooks.length > 0) {
        setAllBooks((prev) => [...prev, ...newBooks]);
        setPage(nextPage);
        setHasMore(!!data.next);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("전체 도서 목록 호출 실패:", error);
      setHasMore(false);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, hasMore, page]);

  /* 초기 데이터 로드 */
  useEffect(() => {
    const fetchBest = async () => {
      try {
        const data = await getProducts({
          page: 1,
          size: 10,
          ordering: "-stock",
        });
        setBestBooks(data.results ?? []);
      } catch (err) {
        console.error("베스트 호출 실패:", err);
        setBestBooks([]);
      }
    };

    const fetchInitialAll = async () => {
      setLoading(true);
      try {
        const data = await getProducts({ page: 1, size: 8 });
        setAllBooks(data.results ?? []);
        setPage(1);
        setHasMore(!!data.next);
      } catch (err) {
        console.error("초기 전체 도서 호출 실패:", err);
        setAllBooks([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBest();
    fetchInitialAll();
  }, []);

  return (
    <>
      <MainBanner
        image="main-banner2.jpg"
        title="책으로 여는 하루"
        subtitle="좋은 책과 함께 오늘을 시작하세요.."
        buttonText="전체 도서 보기"
        buttonClick={handleScrollToBookList}
      />

      <div className="main-page-container">
        <div className="base-container">
          {/* 일간 베스트 */}
          <div className="book-daily-best">
            <BookListRowLoop books={bestBooks} onCardClick={handleCardClick} />
          </div>

          {/* 전체 도서 - InfiniteScroll 적용 */}
          <section className="book-list" ref={bookListRef}>
            <h2>전체 도서</h2>

            <InfiniteScroll
              dataLength={allBooks.length}
              next={fetchAllBooks}
              hasMore={hasMore}
              loader={<Loading />}
              scrollThreshold={0.9}
              style={{ overflow: "visible" }}
            >
              <BookListCol books={allBooks} onCardClick={handleCardClick} />
            </InfiniteScroll>

            {loading && allBooks.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <Loading />
              </div>
            )}

            {!loading && allBooks.length === 0 && (
              <p className="status-message error-message">
                도서 목록을 불러오는 데 실패했거나 데이터가 없습니다.
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default MainPage;
