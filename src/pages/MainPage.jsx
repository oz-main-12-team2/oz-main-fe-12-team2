import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import { BookListCol } from "../components/common/BookListCol.jsx";
import "../styles/cdh/bookmainpage.scss";
import Loading from "../components/common/Loading";
import MainBanner from "../components/MainBanner";

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

  // 책 클릭 핸들러
  const handleCardClick = (book) => {
    navigate(`/book/${book.id}`);
  };

  // ====== 개선된 캐러셀 ======
  const BookListRowLoop = ({ books, onCardClick }) => {
    const containerRef = useRef(null);

    // 자동 스크롤
    useEffect(() => {
      if (!isAutoScrolling || books.length === 0) return;

      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const nextIndex = (prev + 1) % books.length;
          return nextIndex;
        });
      }, 4000); // 4초로 조정

      return () => {
        if (autoScrollIntervalRef.current) {
          clearInterval(autoScrollIntervalRef.current);
        }
      };
    }, [isAutoScrolling, books.length]);

    // 컨테이너 스크롤 위치 업데이트
    useEffect(() => {
      if (containerRef.current && books.length > 0) {
        const cardWidth = 320; // 카드 너비 + 갭
        const scrollLeft = currentIndex * cardWidth;
        containerRef.current.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }, [currentIndex, books.length]);

    // 마우스 휠 이벤트
    useEffect(() => {
      const container = containerRef.current;
      if (!container || books.length === 0) return;

      const handleWheel = (e) => {
        e.preventDefault();
        
        if (e.deltaY > 0) {
          // 아래로 스크롤 = 다음
          setCurrentIndex(prev => (prev + 1) % books.length);
        } else {
          // 위로 스크롤 = 이전
          setCurrentIndex(prev => prev === 0 ? books.length - 1 : prev - 1);
        }
      };

      container.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }, [books.length]);

    // 네비게이션 버튼
    const handlePrev = () => {
      setCurrentIndex(prev => prev === 0 ? books.length - 1 : prev - 1);
    };

    const handleNext = () => {
      setCurrentIndex(prev => (prev + 1) % books.length);
    };

    // 도트 클릭
    const handleDotClick = (index) => {
      setCurrentIndex(index);
    };

    if (!books || books.length === 0) {
      return (
        <div className="carousel-loading">
          도서 데이터를 불러오는 중...
        </div>
      );
    }

    return (
      <div 
        className="enhanced-carousel-wrapper"
        onMouseEnter={() => setIsAutoScrolling(false)}
        onMouseLeave={() => setIsAutoScrolling(true)}
      >
        {/* 배경 장식 요소들 */}
        <div className="background-decoration decoration-1" />
        <div className="background-decoration decoration-2" />

        {/* 섹션 헤더 */}
        <div className="carousel-section-header">
          <h2 className="carousel-section-title">
            <span className="title-icon-before">📚</span>
            Best 10 일간 베스트
            <span className="title-icon-after">✨</span>
          </h2>
        </div>

        <div className="enhanced-carousel-container">
          {/* 그라디언트 오버레이 */}
          <div className="gradient-overlay left"></div>
          <div className="gradient-overlay right"></div>

          {/* 네비게이션 컨트롤 */}
          <div className="navigation-controls">
            <button className="nav-btn prev-btn" onClick={handlePrev}>
              ‹
            </button>
            <button className="nav-btn next-btn" onClick={handleNext}>
              ›
            </button>
          </div>

          {/* 캐러셀 트랙 */}
          <div 
            ref={containerRef}
            className="enhanced-carousel-track"
          >
            {books.map((book, index) => (
              <div
                key={book.id}
                className="enhanced-book-card"
                onClick={() => onCardClick(book)}
              >
                {/* 카드 글로우 효과 */}
                <div className="card-glow" />

                {/* 베스트셀러 배지 */}
                <div className="bestseller-badge">
                  👑 #{index + 1}
                </div>

                {/* 책 이미지 컨테이너 */}
                <div className="enhanced-book-image">
                  {/* 배경 장식 요소들 */}
                  <div className="image-decoration decoration-float" />
                  <div className="image-decoration decoration-morph" />

                  {/* Image Not Available 표시 */}
                  <div className="book-placeholder">
                    <div className="book-icon">📚</div>
                    <div className="image-not-available-text">
                      Image Not Available
                    </div>
                  </div>
                </div>

                {/* 책 상세 정보 */}
                <div className="enhanced-book-details">
                  <h3 className="enhanced-book-title">
                    {book.title}
                  </h3>
                  <p className="enhanced-book-price">
                    <span className="price-icon">💰</span>
                    {book.price.toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 도트 인디케이터 */}
          <div className="dot-indicators">
            {books.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`dot-indicator ${index === currentIndex ? 'active' : ''}`}
              />
            ))}
          </div>

          {/* 자동 스크롤 상태 표시 */}
          <div className="auto-scroll-indicator">
            <span className="auto-scroll-status">
              {isAutoScrolling ? '🔄 자동 스크롤 중' : '⏸️ 일시 정지됨'}
            </span>
            <span className="indicator-divider">|</span>
            <span className="current-book-indicator">
              {currentIndex + 1} / {books.length}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ====== 무한 스크롤 관련 (기존 로직 유지) ======
  const fetchBooks = async (pageNum) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newBooks = Array.from({ length: 10 }, (_, idx) => ({
      id: pageNum * 10 + idx,
      title: `도서 ${pageNum * 10 + idx}`,
      image: "no-image.jpg",
    }));

    setAllBooks((prev) => [...prev, ...newBooks]);
    if (pageNum === 5) setHasMore(false);
    setLoading(false);
  };


  useEffect(() => {


    // 일간 베스트 10 초기 세팅
    setBestBooks([
      { id: 1, title: "인공지능과 미래 사회", image: "no-image.jpg", price: 15000 },
      { id: 2, title: "웹 개발의 모든 것", image: "no-image.jpg", price: 22000 },
      { id: 3, title: "데이터 사이언스 입문", image: "no-image.jpg", price: 18000 },
      { id: 4, title: "리액트 완벽 가이드", image: "no-image.jpg", price: 25000 },
      { id: 5, title: "파이썬으로 배우는 머신러닝", image: "no-image.jpg", price: 28000 },
      { id: 6, title: "클라우드 컴퓨팅 실무", image: "no-image.jpg", price: 20000 },
      { id: 7, title: "블록체인 기술의 이해", image: "no-image.jpg", price: 24000 },
      { id: 8, title: "모바일 앱 개발", image: "no-image.jpg", price: 26000 },
      { id: 9, title: "DevOps 실전 가이드", image: "no-image.jpg", price: 23000 },
      { id: 10, title: "사이버 보안 완전정복", image: "no-image.jpg", price: 27000 },
    ]);

    fetchBooks(1);
  }, []);

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
    return () => {
      if (observerTarget) observer.unobserve(observerTarget);
    };
  }, [handleObserver]);

  useEffect(() => {
    if (page > 1) fetchBooks(page);
  }, [page]);

  // 정리
  useEffect(() => {
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="main-page-container">
      <Header />

      <MainBanner
        image="main-banner.jpg"
        title="책으로 여는 하루"
        subtitle="좋은 책과 함께 오늘을 시작하세요."
        buttonText="전체 도서 보기"
        buttonClick={() => {
          if (bookListRef.current) {
            bookListRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />

      <div className="base-container">
        {/* 개선된 일간 베스트 캐러셀 */}
        <div className="book-daily-best">
          <BookListRowLoop books={bestBooks} onCardClick={handleCardClick} />
        </div>

        {/* 전체 상품 리스트 */}
        <section className="book-list" ref={bookListRef}>
          <h2>전체 도서</h2>
          <BookListCol books={allBooks} onCardClick={handleCardClick} />
          {loading && <Loading />}
          <div ref={observerRef} style={{ height: "20px" }} />
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default MainPage;