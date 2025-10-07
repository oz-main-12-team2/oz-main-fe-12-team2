import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// ⭐️ InfiniteScroll 라이브러리 임포트 추가
import InfiniteScroll from 'react-infinite-scroll-component';
import NavBar from "../components/layout/NavBar";
import Loading from "../components/common/Loading";
import MainBanner from "../components/MainBanner";
import useTitle from "../hooks/useTitle.js";

// API 호출 함수 import
import { getProducts } from "../api/products";

// 스타일 파일들은 외부에서 import
import "../styles/bookcardcol.scss";
import "../styles/bookcardrow.scss";
import "../styles/cdh/bookmainpage.scss";

const DEFAULT_IMAGE = "/no-image.jpg";

/* BookCard - 세로형 카드 (상품리스트) */
export function BookCardCol({ book, onClick }) {
  const handleImgError = (e) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  // 백엔드 데이터 필드(book.price)와 매칭
  const price = (Number(book.price ?? 0) || 0).toLocaleString();

  return (
    <div className="book-card-col" onClick={() => onClick && onClick(book)}>
      <div className="book-card-image">
        {/* 필드: book.image */}
        <img
          src={book.image || DEFAULT_IMAGE}
          alt={book.name}
          onError={handleImgError}
        />
      </div>
      <div className="book-card-content">
        {/* 필드: book.name */}
        <h3 className="book-title">{book.name}</h3>
        {/* 필드: book.category */}
        <p className="book-category">{book.category}</p>
        {/* 필드: book.author, book.publisher */}
        <p className="book-author">{`${book.author} · ${book.publisher}`}</p>
        <p className="book-price">{price}원</p>
      </div>
    </div>
  );
}

/* BookCard - 가로형 카드 (장바구니/주문내역 등) */
export function BookCardRow({ book, onClick, children }) {
  const handleImgError = (e) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  // 백엔드 데이터 필드(book.price)와 매칭
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
        {/* 필드: book.stock */}
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
      {/* key를 book.id로 설정하여 React가 요소를 효율적으로 관리하도록 함 */}
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

  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();
  const bookListRef = useRef(null);
  // ⭐️ observerRef 제거됨
  const autoScrollIntervalRef = useRef(null);

  /* 도서 클릭 -> 상세 페이지 이동 */
  const handleCardClick = (book) => {
    // 백엔드 응답 필드인 book.id 사용
    navigate(`/book/${book.id}`);
  };

  /* 일간 베스트 캐러셀 (UI 개선 적용) */
  const BookListRowLoop = ({ books, onCardClick }) => {
    const containerRef = useRef(null);

    // 이미지 에러 핸들러 (캐러셀 카드 전용)
    const handleImgError = (e) => {
      e.currentTarget.src = DEFAULT_IMAGE;
      e.currentTarget.style.opacity = 0.5; // 이미지 대체 시 약간 흐리게
    };

    // 자동 스크롤 (기존 로직 유지)
    useEffect(() => {
      if (!isAutoScrolling || books.length === 0) return;
      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % books.length);
      }, 4000);
      return () => clearInterval(autoScrollIntervalRef.current);
    }, [books.length]);

    // index 바뀔 때 스크롤 (기존 로직 유지)
    useEffect(() => {
      if (containerRef.current && books.length > 0) {
        const cardWidth = 320; // CSS에 맞춰 확인 필요
        containerRef.current.scrollTo({
          left: currentIndex * cardWidth,
          behavior: "smooth",
        });
      }
    }, [books.length, currentIndex]); // currentIndex 의존성 추가

    // 마우스 휠로 이동 (기존 로직 유지)
    useEffect(() => {
      const container = containerRef.current;
      if (!container || books.length === 0) return;

      const handleWheel = (e) => {
        e.preventDefault();
        if (e.deltaY > 0) {
          setCurrentIndex((prev) => (prev + 1) % books.length);
        } else {
          setCurrentIndex((prev) => (prev === 0 ? books.length - 1 : prev - 1));
        }
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }, [books.length]);

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
            <span className="title-icon-before"></span>
            Best 10 일간 베스트
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

                {/* UI 깨짐의 주 원인인 복잡한 대체 UI를 제거하고, 이미지 태그만 남깁니다. */}
                <div className="enhanced-book-image">
                  {/* 데코레이션은 SCSS로 처리하고, 실제 이미지만 남겨 UI를 단순화 */}
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

          {/* 인디케이터 및 스크롤 정보는 그대로 유지 */}
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
        </div>
      </div>
    );
  };

  /* 전체 도서 무한 스크롤 (API 호출 적용) */
  // ⭐️ page 상태를 증가시키며 다음 페이지를 로드합니다.
  const fetchAllBooks = useCallback(async () => {
    const nextPage = page + 1;
    
    if (loading || !hasMore) return; 

    setLoading(true);

    try {
      const data = await getProducts({ page: nextPage, size: 8 });
      const newBooks = data.results;

      setAllBooks((prev) => [...prev, ...newBooks]);
      setPage(nextPage); // ⭐️ 성공 시에만 페이지 증가
      
      // 다음 페이지가 있는지 여부를 서버 응답(data.next)을 보고 판단합니다.
      setHasMore(!!data.next); 
      
    } catch (error) {
      console.error("전체 도서 목록 호출 실패:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  /* 초기 데이터 로드 (베스트셀러와 첫 페이지 전체 도서) */
  useEffect(() => {
    // 1. 베스트셀러 데이터 호출
    const fetchBestBooks = async () => {
      try {
        const data = await getProducts({
          page: 1,
          size: 10,
          ordering: "-stock",
        });
        setBestBooks(data.results);
      } catch (error) {
        console.error("베스트셀러 호출 실패:", error);
        setBestBooks([]);
      }
    };

    // 2. 전체 도서 목록 첫 페이지(page=1) 로드
    const fetchInitialBooks = async () => {
        try {
            const data = await getProducts({ page: 1, size: 20 });
            setAllBooks(data.results);
            setPage(1); // 초기 페이지는 1로 설정
            setHasMore(!!data.next);
        } catch (error) {
            console.error("초기 도서 목록 호출 실패:", error);
            setAllBooks([]);
            setHasMore(false);
        }
    };
    
    fetchBestBooks();
    fetchInitialBooks();

  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // ⭐️ 기존 Intersection Observer 관련 useEffect 로직은 제거되었습니다.

  useEffect(() => {
    return () => {
      if (autoScrollIntervalRef.current)
        clearInterval(autoScrollIntervalRef.current);
    };
  }, []);

  /* 렌더링 */
  return (
    <>
      <MainBanner
        image="main-banner.jpg"
        title="책으로 여는 하루"
        subtitle="좋은 책과 함께 오늘을 시작하세요.."
        buttonText="전체 도서 보기"
        buttonClick={() =>
          bookListRef.current?.scrollIntoView({ behavior: "smooth" })
        }
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
              dataLength={allBooks.length}         // 현재 목록의 아이템 개수
              next={fetchAllBooks}                  // 스크롤 시 호출할 다음 데이터 로드 함수
              hasMore={hasMore}                     // 더 로드할 데이터가 있는지 여부
              loader={<Loading />}                  // 로딩 중 표시할 컴포넌트
              endMessage={
                <p className="status-message no-more-books">
                  <b>마지막 도서입니다.</b>
                </p>
              }
            >
              <BookListCol books={allBooks} onCardClick={handleCardClick} />
            </InfiniteScroll>

            {/* 초기 로딩 실패/데이터 없음 메시지 */}
            {/* loading 상태 확인 로직을 좀 더 단순화합니다. */}
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