import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from "../components/layout/Header";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import {BookListRow} from "../components/common/BookListRow.jsx";
import {BookListCol} from "../components/common/BookListCol.jsx";
import "../styles/cdh/mainpage/book-daily-best.scss"
import Loading from "../components/common/Loading";

// 일간 베스트 횡스크롤
// const dailyBestBooks = [
//   { id: 1, title: "책1", author: "작가1"},
//   { id: 2, title: "책2", author: "작가2"},
//   { id: 3, title: "책3", author: "작가3"},
//   { id: 4, title: "책4", author: "작가4"},
//   { id: 5, title: "책5", author: "작가5"},
// ]

function MainPage() {
  // 로그인 상태 ( 임시( true/false ) 추후 auth.js와 연동필요 )
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  // 베스트 책
  const [bestBooks, setBestBooks] = useState([]);
  
  // 전체 책 ( 무한 스크롤 )
  const [allBooks, setAllBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // observer target
  const observerRef = useRef(null);

  // localStorage에서 로그인 상태 확인용
  useEffect(() => {
    const LoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(LoggedIn);
  }, []);

  // 더미 데이터 로드 함수( API 연동 시 fetch )
  const fetchBooks = async (pageNum) => {
    setLoading(true);

    // 실제 API 호출가정
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 지연 시뮬레이션

    const newBooks = Array.from({ length: 10 }, (_, idx) => ({
      id: pageNum * 10 + idx,
      title: `도서 ${pageNum * 10 + idx}`,
      imge: "src/assets/로고.png",
    }));

    setAllBooks((prev) => [...prev, ...newBooks]);

    if (pageNum === 5) {
      // 페이지 5까지 데이터 있다고 가정
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    // 첫 로드
    setBestBooks([
      { id: 1, title: "베스트1", image: "이미지링크"},
      { id: 2, title: "베스트2", image: "이미지링크"},
      { id: 3, title: "베스트3", image: "이미지링크"},
      { id: 4, title: "베스트4", image: "이미지링크"},
      { id: 5, title: "베스트5", image: "이미지링크"},
      { id: 6, title: "베스트5", image: "이미지링크"},
      { id: 7, title: "베스트5", image: "이미지링크"},
      { id: 8, title: "베스트5", image: "이미지링크"},
      { id: 9, title: "베스트5", image: "이미지링크"},
      { id: 10, title: "베스트5", image: "이미지링크"},
    ]);

      fetchBooks(1);
  }, []);

  // observer 콜백
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading){
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, loading]
  );

  // observer 등록
  useEffect(() => {
    const option = { threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, option);

    // ref의 현재 값을 지역 변수에 저장.
    // const currentObserverElement = observerRef.current;

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    // 클린업 함수에서 저장된 변수를 사용
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [handleObserver]); // handleObserver가 변경될 때 이펙트를 다시 실행

  // page 변경 시 데이터 부르기
  useEffect(() => {
    if (page > 1) {
      fetchBooks(page);
    }
  }, [page]);

  return (
    <div>
      <div className="base-container">
        <h2>MainPage</h2>
      </div>
      <div>
      <Header />
      {/* 로그인 시 NavBar 표시 */}
      {isLoggedIn && <NavBar />}

      {/* 메인 배너 */}
      <section className="main-banner">
        <img src="src/assets/로고.png" alt="메인 베너" />
      </section>

      {/* Best10 */}
      <section className="book-daily-best">
        <h2>Best 10 (일간 베스트)</h2>
        <BookListRow
          books={bestBooks}
          onCardClick={(book) => console.log("클릭한 책:", book)}
        />
      </section>


      {/* 전체 상품 리스트 (무한 스크롤) */}
      <section className="book-list">
        <h2>전체 도서</h2>
        <BookListCol books={allBooks} />
        {loading && <Loading />}
        <div ref={observerRef} style={{height: "20px"}} />
      </section>

      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
