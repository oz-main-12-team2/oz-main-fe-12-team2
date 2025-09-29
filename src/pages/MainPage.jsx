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

  // ====== 기본적이고 확실한 캐러셀 ======
  const BookListRowLoop = ({ books, onCardClick }) => {
    const containerRef = useRef(null);

    // 자동 스크롤
    useEffect(() => {
      if (!isAutoScrolling) return;

      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const nextIndex = (prev + 1) % books.length;
          return nextIndex;
        });
      }, 3000);

      return () => {
        if (autoScrollIntervalRef.current) {
          clearInterval(autoScrollIntervalRef.current);
        }
      };
    }, [isAutoScrolling, books.length]);

    // 컨테이너 스크롤 위치 업데이트
    useEffect(() => {
      if (containerRef.current) {
        const scrollLeft = currentIndex * 350; // 카드 너비 + 갭
        containerRef.current.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }, [currentIndex]);

    // 마우스 휠 이벤트
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleWheel = (e) => {
        e.preventDefault();
        
        // 휠 방향에 따라 인덱스 변경
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

    return (
      <div 
        className="carousel-wrapper"
        onMouseEnter={() => setIsAutoScrolling(false)}
        onMouseLeave={() => setIsAutoScrolling(true)}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          📚 Best 10 일간 베스트
        </h2>

        <div className="carousel-container">
          {/* 이전 버튼 */}
          <button 
            className="nav-button prev" 
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(255,255,255,0.8)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ‹
          </button>

          {/* 캐러셀 컨테이너 */}
          <div 
            ref={containerRef}
            className="carousel-track"
            style={{
              display: 'flex',
              overflow: 'hidden',
              gap: '20px',
              padding: '20px',
              scrollBehavior: 'smooth'
            }}
          >
            {books.map((book, index) => (
              <div
                key={book.id}
                className="book-card"
                onClick={() => onCardClick(book)}
                style={{
                  flex: '0 0 300px',
                  height: '400px',
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-10px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0px)';
                }}
              >
                {/* 베스트 배지 */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: 'gold',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  zIndex: 2
                }}>
                  #{index + 1}
                </div>

                {/* 책 이미지 영역 */}
                <div style={{
                  height: '250px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '15px 15px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '60px'
                }}>
                  📚
                </div>

                {/* 책 정보 */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    color: '#333'
                  }}>
                    {book.title}
                  </h3>
                  <p style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#007bff'
                  }}>
                    {book.price.toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 다음 버튼 */}
          <button 
            className="nav-button next" 
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(255,255,255,0.8)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ›
          </button>
        </div>

        {/* 도트 인디케이터 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '20px'
        }}>
          {books.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentIndex ? '#007bff' : '#ccc',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* 상태 표시 */}
        <div style={{
          textAlign: 'center',
          marginTop: '15px',
          fontSize: '14px',
          color: '#666'
        }}>
          <span>{isAutoScrolling ? '자동 스크롤 중' : '일시 정지됨'}</span>
          <span style={{ margin: '0 10px' }}>|</span>
          <span>{currentIndex + 1} / {books.length}</span>
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
      image: "src/assets/logo.png",
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
    <div>
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
        {/* 기능 우선 캐러셀 */}
        <div style={{ 
          position: 'relative',
          maxWidth: '1200px', 
          margin: '0 auto',
          padding: '40px 20px'
        }}>
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