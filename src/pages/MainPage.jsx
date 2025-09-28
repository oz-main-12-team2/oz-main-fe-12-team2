import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import Loading from "../components/common/Loading";
import MainBanner from "../components/MainBanner";

import "../../styles/bookcardcol.scss";
import "../../styles/bookcardrow.scss";
import "../styles/cdh/bookmainpage.scss";

// 기본 이미지 대체
const DEFAULT_IMAGE = "/no-image.jpg";

// 세로형 카드 (상품리스트)
export function BookCardCol({ book, onClick }) {
  const handleImgError = (e) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  return (
    <div
      className="book-card-col"
      onClick={() => onClick && onClick(book)}
    >
      <div className="book-card-image">
        <img
          src={book.image_url || DEFAULT_IMAGE}
          alt={book.name}
          onError={handleImgError}
        />
      </div>

      <div className="book-card-content">
        <h3 className="book-title">{book.name}</h3>
        <p className="book-category">{book.category}</p>
        <p className="book-author">{`${book.author} · ${book.publisher}`}</p>
        <p className="book-price">{(book.price ?? 0).toLocaleString()}원</p>
      </div>
    </div>
  );
}

// 가로형 카드 (장바구니/주문내역)
export function BookCardRow({ book, onClick, children }) {
  const handleImgError = (e) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  return (
    <div className="book-card-row" onClick={() => onClick && onClick(book)}>
      <div className="book-card-row-image">
        <img
          src={book.image_url || DEFAULT_IMAGE}
          alt={book.name}
          onError={handleImgError}
        />
      </div>

      <div className="book-card-row-content">
        <h3 className="book-title">{book.name}</h3>
        <p className="book-category">{book.category}</p>
        <p className="book-author">{`${book.author} · ${book.publisher}`}</p>
        <p className="book-price">{(book.price ?? 0).toLocaleString()}원</p>
        <p className="book-stock">재고: {book.stock}권</p>
      </div>

      {children && <div className="book-card-row-actions">{children}</div>}
    </div>
  );
}

// 세로형 리스트
export function BookListCol({ books, onCardClick }) {
  return (
    <div className="book-list-col">
      {books.map((book) => (
        <BookCardCol key={book.id} book={book} onClick={onCardClick} />
      ))}
    </div>
  );
}

// ====== MainPage ======
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

  // ====== 책 클릭 핸들러 ======
  const handleCardClick = (book) => {
    navigate(`/book/${book.id}`);
  };

  // ====== 개선된 캐러셀 ======
  const BookListRowLoop = ({ books, onCardClick }) => {
    const containerRef = useRef(null);

    useEffect(() => {
      if (!isAutoScrolling || books.length === 0) return;

      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % books.length);
      }, 4000);

      return () => clearInterval(autoScrollIntervalRef.current);
    }, [isAutoScrolling, books.length]);

    useEffect(() => {
      if (containerRef.current && books.length > 0) {
        const cardWidth = 320;
        containerRef.current.scrollTo({
          left: currentIndex * cardWidth,
          behavior: 'smooth'
        });
      }
    }, [currentIndex, books.length]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container || books.length === 0) return;

      const handleWheel = (e) => {
        e.preventDefault();
        if (e.deltaY > 0) {
          setCurrentIndex(prev => (prev + 1) % books.length);
        } else {
          setCurrentIndex(prev => prev === 0 ? books.length - 1 : prev - 1);
        }
      };

      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }, [books.length]);

    const handlePrev = () => setCurrentIndex(prev => prev === 0 ? books.length - 1 : prev - 1);
    const handleNext = () => setCurrentIndex(prev => (prev + 1) % books.length);
    const handleDotClick = (index) => setCurrentIndex(index);

    if (!books || books.length === 0) return <div>도서 데이터를 불러오는 중...</div>;

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

          <div className="navigation-controls">
            <button className="nav-btn prev-btn" onClick={handlePrev}>‹</button>
            <button className="nav-btn next-btn" onClick={handleNext}>›</button>
          </div>

          <div ref={containerRef} className="enhanced-carousel-track">
            {books.map((book, index) => (
              <div key={book.id} className="enhanced-book-card" onClick={() => onCardClick(book)}>
                <div className="card-glow" />
                <div className="bestseller-badge">👑 #{index + 1}</div>

                <div className="enhanced-book-image">
                  <div className="image-decoration decoration-float" />
                  <div className="image-decoration decoration-morph" />

                  <div className="book-placeholder">
                    <div className="book-icon">📚</div>
                    <div className="image-not-available-text">Image Not Available</div>
                  </div>
                </div>

                <div className="enhanced-book-details">
                  <h3 className="enhanced-book-title">{book.name}</h3>
                  <p className="enhanced-book-price">💰 {book.price.toLocaleString()}원</p>
                  <p className="enhanced-book-category">{book.category}</p>
                  <p className="enhanced-book-author">{book.author} · {book.publisher}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="dot-indicators">
            {books.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`dot-indicator ${index === currentIndex ? 'active' : ''}`}
              />
            ))}
          </div>

          <div className="auto-scroll-indicator">
            <span>{isAutoScrolling ? '🔄 자동 스크롤 중' : '⏸️ 일시 정지됨'}</span>
            <span>|</span>
            <span>{currentIndex + 1} / {books.length}</span>
          </div>
        </div>
      </div>
    );
  };

  // ====== 전체 도서 무한 스크롤 ======
  const fetchBooks = async (pageNum) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newBooks = Array.from({ length: 10 }, (_, idx) => ({
      id: pageNum * 10 + idx,
      name: `도서 ${pageNum * 10 + idx}`,
      image_url: "no-image.jpg",
      category: "IT/컴퓨터",
      author: "홍길동",
      publisher: "좋은출판사",
      price: 20000 + idx * 1000,
      stock: 10 + idx
    }));

    setAllBooks(prev => [...prev, ...newBooks]);
    if (pageNum === 5) setHasMore(false);
    setLoading(false);
  };


  useEffect(() => {


    // 일간 베스트 10 초기 세팅
    setBestBooks([
      { id: 1, name: "인공지능과 미래 사회", image_url: "no-image.jpg", price: 15000, category: "IT/인공지능", author: "김철수", publisher: "미래출판사" },
      { id: 2, name: "웹 개발의 모든 것", image_url: "no-image.jpg", price: 22000, category: "IT/웹", author: "이영희", publisher: "웹출판사" },
      { id: 3, name: "데이터 사이언스 입문", image_url: "no-image.jpg", price: 18000, category: "IT/데이터", author: "박민수", publisher: "데이터북스" },
      { id: 4, name: "리액트 완벽 가이드", image_url: "no-image.jpg", price: 25000, category: "IT/프론트엔드", author: "최지훈", publisher: "코딩출판사" },
      { id: 5, name: "파이썬으로 배우는 머신러닝", image_url: "no-image.jpg", price: 28000, category: "IT/인공지능", author: "강수진", publisher: "머신러닝북스" },
      { id: 6, name: "클라우드 컴퓨팅 실무", image_url: "no-image.jpg", price: 20000, category: "IT/클라우드", author: "정우성", publisher: "클라우드출판사" },
      { id: 7, name: "블록체인 기술의 이해", image_url: "no-image.jpg", price: 24000, category: "IT/블록체인", author: "김현우", publisher: "블록체인북스" },
      { id: 8, name: "모바일 앱 개발", image_url: "no-image.jpg", price: 26000, category: "IT/모바일", author: "이서윤", publisher: "앱북스" },
      { id: 9, name: "DevOps 실전 가이드", image_url: "no-image.jpg", price: 23000, category: "IT/DevOps", author: "박지민", publisher: "IT출판사" },
      { id: 10, name: "사이버 보안 완전정복", image_url: "no-image.jpg", price: 27000, category: "IT/보안", author: "최은서", publisher: "보안출판사" },
    ]);

    fetchBooks(1);
  }, []);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) setPage(prev => prev + 1);
  }, [hasMore, loading]);

  useEffect(() => {
    const option = { threshold: 1.0 };
    const observerTarget = observerRef.current;
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerTarget) observer.observe(observerTarget);
    return () => { if (observerTarget) observer.unobserve(observerTarget); };
  }, [handleObserver]);

  useEffect(() => {
    if (page > 1) fetchBooks(page);
  }, [page]);

  useEffect(() => {
    return () => { if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current); };
  }, []);

  return (
    <div className="main-page-container">
      <Header />

      <MainBanner
        image="main-banner.jpg"
        title="책으로 여는 하루"
        subtitle="좋은 책과 함께 오늘을 시작하세요.."
        buttonText="전체 도서 보기"
        buttonClick={() => { bookListRef.current?.scrollIntoView({ behavior: "smooth" }); }}
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
