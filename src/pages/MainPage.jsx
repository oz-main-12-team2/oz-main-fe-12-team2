import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from "../components/layout/Header";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import { BookListCol } from "../components/common/BookListCol.jsx";
import "../styles/cdh/book-daily-best.scss";
import Loading from "../components/common/Loading";

function MainPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bestBooks, setBestBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ====== 무한루프 캐러셀 컴포넌트 ======
const BookListRowLoop = ({ books, onCardClick }) => {
  const rowRef = useRef(null);

  const itemWidth = 200 + 12; // 카드 width + margin-right
  const cloneCount = books.length; // 앞뒤로 복제할 개수

  useEffect(() => {
    const container = rowRef.current;
    if (!container || books.length === 0) return;

    // 초기 위치를 원본 데이터 시작 위치로 이동
    container.scrollLeft = itemWidth * cloneCount;

    const handleWheel = (e) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY;

      const totalWidth = itemWidth * books.length;
      const maxScroll = totalWidth * 2; // 앞뒤 복제 1번씩

      // 무한루프 처리
      if (container.scrollLeft <= 0) {
        // 앞쪽 끝 => 뒤쪽 원본으로 점프
        container.scrollLeft += totalWidth;
      } else if (container.scrollLeft >= maxScroll) {
        // 뒤쪽 끝 => 앞쪽 원본으로 점프
        container.scrollLeft -= totalWidth;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [books]);

  if (books.length === 0) return null;

  return (
    <div className="book-list-row" ref={rowRef}>
      {/* 앞쪽 복제 */}
      {books.map((book, i) => (
        <div key={`clone-left-${i}`} className="book-item">
          <img src={book.image} alt={book.title} />
          <p>{book.title}</p>
        </div>
      ))}

      {/* 원본 데이터 */}
      {books.map((book, i) => (
        <div key={`main-${i}`} className="book-item" onClick={() => onCardClick(book)}>
          <img src={book.image} alt={book.title} />
          <p>{book.title}</p>
        </div>
      ))}

      {/* 뒤쪽 복제 */}
      {books.map((book, i) => (
        <div key={`clone-right-${i}`} className="book-item">
          <img src={book.image} alt={book.title} />
          <p>{book.title}</p>
        </div>
      ))}
    </div>
  );
};

  // ====== 무한 스크롤 관련 ======
  const observerRef = useRef(null);

  useEffect(() => {
    const LoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(LoggedIn);
  }, []);

  const fetchBooks = async (pageNum) => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newBooks = Array.from({ length: 10 }, (_, idx) => ({
      id: pageNum * 10 + idx,
      title: `도서 ${pageNum * 10 + idx}`,
      image: "src/assets/로고.png",
    }));

    setAllBooks((prev) => [...prev, ...newBooks]);

    if (pageNum === 5) setHasMore(false);

    setLoading(false);
  };

  useEffect(() => {
    setBestBooks([
      { id: 1, title: "베스트1", image: "이미지링크" },
      { id: 2, title: "베스트2", image: "이미지링크" },
      { id: 3, title: "베스트3", image: "이미지링크" },
      { id: 4, title: "베스트4", image: "이미지링크" },
      { id: 5, title: "베스트5", image: "이미지링크" },
      { id: 6, title: "베스트6", image: "이미지링크" },
      { id: 7, title: "베스트7", image: "이미지링크" },
      { id: 8, title: "베스트8", image: "이미지링크" },
      { id: 9, title: "베스트9", image: "이미지링크" },
      { id: 10, title: "베스트10", image: "이미지링크" },
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
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  useEffect(() => {
    if (page > 1) fetchBooks(page);
  }, [page]);

  // ====== 렌더 ======
  return (
    <div>
      <div className="base-container">
        <h2>MainPage</h2>
        <div>
          <Header />

          {/* 카테고리 */}
          <div className="Category-container">
            <h3>도서 전체</h3> <br />
            <NavBar />
          </div>

          {/* 로그인 시 NavBar */}
          {isLoggedIn && <NavBar />}
          <br />

          {/* 메인 배너 */}
          <section className="main-banner">
            <img
              src="src/assets/로고.png"
              alt="메인 베너"
              className="textimg1"
            />
          </section>
          <br />

          {/* Best10 */}
          <section className="book-daily-best">
            <h2>Best 10 (일간 베스트)</h2>
            <hr />
            <br />
            <BookListRowLoop
              books={bestBooks}
              onCardClick={(book) => console.log("클릭한 책:", book)}
            />
          </section>
          <br />

          {/* 전체 상품 리스트 (무한 스크롤) */}
          <section className="book-list">
            <h2>전체 도서</h2>
            <hr />
            <br />
            <BookListCol books={allBooks} />
            {loading && <Loading />}
            <div ref={observerRef} style={{ height: "20px" }} />
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MainPage;