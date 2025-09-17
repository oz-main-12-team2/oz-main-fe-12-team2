import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from "../components/layout/Header";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import { BookListCol } from "../components/common/BookListCol.jsx";
import "../styles/cdh/book-daily-best.scss";
import Loading from "../components/common/Loading";

function MainPage() {
  // 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 베스트 책
  const [bestBooks, setBestBooks] = useState([]);

  // 전체 책 (무한 스크롤)
  const [allBooks, setAllBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 가로 스크롤 + 무한 루프 
const BookListRowLoop = ({ books }) => {
  const rowRef = useRef(null);
  const itemWidthRef = useRef(0);

  // 앞뒤 복제 데이터 (앞뒤 최소 3개씩 붙이기)
  const loopBooks = [
    ...books.slice(-3),
    ...books,
    ...books.slice(0, 3),
  ];

  useEffect(() => {
    const container = rowRef.current;
    if (!container) return;

    // 아이템 하나의 너비 계산
    const firstItem = container.querySelector(".book-card");
    if (firstItem) {
      itemWidthRef.current = firstItem.offsetWidth + 10; // 카드 + margin
    }

    // 원본 리스트 시작 위치로 이동
    container.scrollLeft = books.length * itemWidthRef.current;

    const handleWheel = (e) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY;

      const totalItemCount = loopBooks.length;
      const originalCount = books.length;
      const scrollPos = container.scrollLeft;

      const maxScroll =
        (totalItemCount - originalCount) * itemWidthRef.current;

      // 맨 앞으로 갔을 때 → 다시 뒤쪽으로 점프
      if (scrollPos <= itemWidthRef.current) {
        container.scrollLeft =
          originalCount * itemWidthRef.current + scrollPos;
      }
      // 맨 뒤로 갔을 때 → 다시 앞쪽으로 점프
      else if (scrollPos >= maxScroll - itemWidthRef.current) {
        container.scrollLeft =
          scrollPos - originalCount * itemWidthRef.current;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [books, loopBooks]);

  return (
    <div className="book-list-row" ref={rowRef}>
      {loopBooks.map((book, index) => (
        <div key={index} className="book-card">
          <img src={book.image} alt={book.title} />
          <p>{book.title}</p>
        </div>
      ))}
    </div>
  );
};

  // observer target
  const observerRef = useRef(null);

  // localStorage에서 로그인 상태 확인
  useEffect(() => {
    const LoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(LoggedIn);
  }, []);

  // 더미 데이터 로드 함수
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

  // 초기 로드
  useEffect(() => {
    setBestBooks([
      { id: 1, title: "베스트1", image: "src/assets/로고.png" },
      { id: 2, title: "베스트2", image: "src/assets/로고.png" },
      { id: 3, title: "베스트3", image: "src/assets/로고.png" },
      { id: 4, title: "베스트4", image: "src/assets/로고.png" },
      { id: 5, title: "베스트5", image: "src/assets/로고.png" },
      { id: 6, title: "베스트6", image: "src/assets/로고.png" },
      { id: 7, title: "베스트7", image: "src/assets/로고.png" },
      { id: 8, title: "베스트8", image: "src/assets/로고.png" },
      { id: 9, title: "베스트9", image: "src/assets/로고.png" },
      { id: 10, title: "베스트10", image: "src/assets/로고.png" },
    ]);

    fetchBooks(1);
  }, []);

  // observer 콜백
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, loading]
  );

  // observer 등록
  useEffect(() => {
    const option = { threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, option);

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  // page 변경 시 데이터 부르기
  useEffect(() => {
    if (page > 1) fetchBooks(page);
  }, [page]);

  return (
    <div>
      <div className="base-container">
        <h2>MainPage</h2>
        <Header />

        {/* 카테고리 */}
        <div className="Category-container">
          <h3>도서 전체</h3> <br />
          <NavBar />
        </div>

        {/* 로그인 시 NavBar 표시 */}
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
          <br /> <br />
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
          <br />
          <BookListCol books={allBooks} />
          {loading && <Loading />}
          <div ref={observerRef} style={{ height: "20px" }} />
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default MainPage;

