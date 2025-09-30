import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import { BookListCol } from "../components/common/BookListCol.jsx";
import "../styles/cdh/book-daily-best.scss";
import Loading from "../components/common/Loading";
import MainBanner from "../components/MainBanner";
import useTitle from "../hooks/useTitle.js";

function MainPage() {
  useTitle();
  const [bestBooks, setBestBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const bookListRef = useRef(null);
  const observerRef = useRef(null);

  // 책 클릭 핸들러
  const handleCardClick = (book) => {
    navigate(`/book/${book.id}`);
  };

  // ====== 무한루프 캐러셀 (Best 10 전용) ======
  const BookListRowLoop = ({ books, onCardClick }) => {
    const rowRef = useRef(null);
    const itemWidth = 200 + 24; // 카드 width + gap
    const totalWidth = itemWidth * books.length;

    // 무한 루프용 데이터 (앞뒤 복제)
    const loopedBooks = [...books, ...books, ...books];

    useEffect(() => {
      const container = rowRef.current;
      if (!container) return;

      // 시작 위치 (가운데 원본 리스트)
      container.scrollLeft = totalWidth;

      // 무한 루프 스크롤 처리
      const handleScroll = () => {
        if (container.scrollLeft <= 0) {
          container.scrollLeft = totalWidth;
        } else if (container.scrollLeft >= totalWidth * 2) {
          container.scrollLeft = totalWidth;
        }
      };

      // 마우스 휠 → 가로 스크롤
      const handleWheel = (e) => {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      };

      container.addEventListener("scroll", handleScroll);
      container.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        container.removeEventListener("scroll", handleScroll);
        container.removeEventListener("wheel", handleWheel);
      };
    }, [totalWidth]);

    return (
      <div className="book-list-row" ref={rowRef}>
        {loopedBooks.map((book, i) => (
          <div
            key={`${book.id}-${i}`}
            className="book-item"
            onClick={() => onCardClick(book)}
          >
            <div className="book-image">
              <img src={book.image} alt={book.title} />
            </div>
            <div className="book-list-details">
              <p className="book-title">{book.title}</p>
              <p className="book-price">{book.price.toLocaleString()}원</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ====== 무한 스크롤 관련 ======
  const fetchBooks = async (pageNum) => {
    setLoading(true);

    // 로딩 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newBooks = Array.from({ length: 10 }, (_, idx) => ({
      id: pageNum * 10 + idx,
      title: `도서 ${pageNum * 10 + idx}`,
      image: "src/assets/logo.png",
    }));

    setAllBooks((prev) => [...prev, ...newBooks]);
    if (pageNum === 5) setHasMore(false);

    setLoading(false);
  };

  useEffect(() => {
    // 일간 베스트 10 초기 세팅
    setBestBooks([
      { id: 1, title: "베스트1", image: "no-image.jpg", price: 15000 },
      { id: 2, title: "베스트2", image: "no-image.jpg", price: 11000 },
      { id: 3, title: "베스트3", image: "no-image.jpg", price: 23000 },
      { id: 4, title: "베스트4", image: "no-image.jpg", price: 17000 },
      { id: 5, title: "베스트5", image: "no-image.jpg", price: 26000 },
      { id: 6, title: "베스트6", image: "no-image.jpg", price: 12000 },
      { id: 7, title: "베스트7", image: "no-image.jpg", price: 16000 },
      { id: 8, title: "베스트8", image: "no-image.jpg", price: 15500 },
      { id: 9, title: "베스트9", image: "no-image.jpg", price: 17500 },
      { id: 10, title: "베스트10", image: "no-image.jpg", price: 18000 },
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

  return (
    <div>
      <Header />

      {/* 메인 배너 */}
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
        {/* Best10 (무한 캐러셀) */}
        <section className="book-daily-best">
          <h2>Best 10 (일간 베스트)</h2>
          <BookListRowLoop books={bestBooks} onCardClick={handleCardClick} />
        </section>

        {/* 전체 상품 리스트 (무한 스크롤) */}
        <h2>전체 도서</h2>
        <section className="book-list" ref={bookListRef}>
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
