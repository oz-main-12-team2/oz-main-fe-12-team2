import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import NavBar from "../components/layout/NavBar";
import Loading from "../components/common/Loading";
import MainBanner from "../components/MainBanner";
import useTitle from "../hooks/useTitle.js";
import { getProducts, getBestSellerProducts } from "../api/products";
import "../styles/bookcardcol.scss";
import "../styles/bookcardrow.scss";
import "../styles/cdh/bookmainpage.scss";

const DEFAULT_IMAGE = "/no-image.jpg";
const S3_BASE_URL =
  "https://oz-main-be-12-team2.s3.ap-northeast-2.amazonaws.com/";

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

//    BookListRowLoop - 일간 베스트 캐러셀 (양방향 무한 루프 애니메이션 적용)
function BookListRowLoop({ books, onCardClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const containerRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const cardWidthWithGap = 320;
  const booksCount = books.length;
  const easeInOutQuad = (t) => {
    t /= 0.5;
    if (t < 1) return 0.5 * t * t;
    t--;
    return -0.5 * (t * (t - 2) - 1);
  };

  // 순방향 루프 애니메이션 함수 (끝 -> 시작)
  const animateLoopToStart = useCallback(() => {
    setIsAutoScrolling(false);
    isAnimatingRef.current = true;

    const container = containerRef.current;
    if (!container) return;

    const startScrollLeft = container.scrollLeft;
    const duration = 1000; // 1초
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutQuad(progress);

      container.scrollLeft = startScrollLeft * (1 - eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        container.scrollLeft = 0;
        setCurrentIndex(0);
        isAnimatingRef.current = false;
        setTimeout(() => {
          setIsAutoScrolling(true);
        }, 500);
      }
    };
    requestAnimationFrame(animate);
  }, []);

  // 역방향 루프 애니메이션 함수 (시작 -> 끝)
  const animateLoopToEnd = useCallback(() => {
    setIsAutoScrolling(false);
    isAnimatingRef.current = true;

    const container = containerRef.current;
    if (!container) return;

    const startScrollLeft = container.scrollLeft;
    const endPosition = (booksCount - 1) * cardWidthWithGap;
    const duration = 1000; // 1초
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutQuad(progress);

      container.scrollLeft =
        startScrollLeft + (endPosition - startScrollLeft) * eased;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        container.scrollLeft = endPosition;
        setCurrentIndex(booksCount - 1);
        isAnimatingRef.current = false;
        setTimeout(() => {
          setIsAutoScrolling(true);
        }, 500);
      }
    };
    requestAnimationFrame(animate);
  }, [booksCount]);

  // 자동 스크롤 로직 (순방향 루프 애니메이션 재사용)
  useEffect(() => {
    if (
      !isAutoScrolling ||
      booksCount === 0 ||
      isDraggingRef.current ||
      isAnimatingRef.current
    )
      return;

    if (autoScrollIntervalRef.current)
      clearInterval(autoScrollIntervalRef.current);

    autoScrollIntervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;

        if (nextIndex >= booksCount) {
          // 1. Stop Auto Scroll
          clearInterval(autoScrollIntervalRef.current);
          autoScrollIntervalRef.current = null;

          // 2. Trigger Loop Animation (End to Start)
          animateLoopToStart();

          return prevIndex;
        }
        return nextIndex;
      });
    }, 3000);

    return () => {
      if (autoScrollIntervalRef.current)
        clearInterval(autoScrollIntervalRef.current);
    };
  }, [isAutoScrolling, booksCount, animateLoopToStart]);

  // currentIndex 변경 시 스크롤 이동
  useEffect(() => {
    if (isAnimatingRef.current || isDraggingRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    const scrollPosition = currentIndex * cardWidthWithGap;
    container.scrollTo({ left: scrollPosition, behavior: "smooth" });
  }, [currentIndex]);

  // ------------------- 사용자 상호작용 로직 -------------------

  // 휠 이벤트 핸들러 (세로 휠 -> 가로 스크롤 변환 + 무한 루프)
  const handleWheel = useCallback(
    (e) => {
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      container.scrollLeft += e.deltaY;

      setIsAutoScrolling(false);
      clearTimeout(container.autoScrollTimeout);
      container.autoScrollTimeout = setTimeout(() => {
        if (!isAnimatingRef.current && !isDraggingRef.current)
          setIsAutoScrolling(true);
      }, 2000);

      clearTimeout(container.wheelSnapTimeout);
      container.wheelSnapTimeout = setTimeout(() => {
        const maxScroll = container.scrollWidth - container.clientWidth;

        // 1. 순방향 루프 (끝까지 스크롤한 경우)
        if (container.scrollLeft >= maxScroll - 50) {
          if (autoScrollIntervalRef.current)
            clearInterval(autoScrollIntervalRef.current);
          animateLoopToStart();
          return;
        }

        // 2. 역방향 루프 (시작점보다 왼쪽으로 스크롤한 경우)
        if (container.scrollLeft < 50) {
          if (autoScrollIntervalRef.current)
            clearInterval(autoScrollIntervalRef.current);
          animateLoopToEnd();
          return;
        }

        // 3. 기본 스냅
        const newIndex = Math.round(container.scrollLeft / cardWidthWithGap);
        setCurrentIndex(newIndex);
      }, 150);
    },
    [cardWidthWithGap, animateLoopToStart, animateLoopToEnd]
  );

  // 마우스 다운 이벤트 핸들러 (드래그 시작)
  const handleMouseDown = useCallback((e) => {
    if (isAnimatingRef.current) {
      e.preventDefault();
      return;
    }

    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }

    isDraggingRef.current = true;
    startXRef.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftRef.current = containerRef.current.scrollLeft;

    containerRef.current.classList.add("dragging");
    setIsAutoScrolling(false);
  }, []);

  // 마우스 이동 이벤트 핸들러 (드래그 중)
  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return;

    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;

    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
  }, []);

  // 마우스 업 이벤트 핸들러 (드래그 종료 + 무한 루프)
  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    containerRef.current.classList.remove("dragging");

    const container = containerRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;

    // 1. 순방향 루프 (끝까지 드래그한 경우)
    if (container.scrollLeft >= maxScroll) {
      animateLoopToStart();
      return;
    }

    // 2. 역방향 루프 (시작점보다 왼쪽으로 드래그한 경우)
    if (container.scrollLeft < 0) {
      animateLoopToEnd();
      return;
    }

    // 3. 기본 스냅
    const newIndex = Math.round(container.scrollLeft / cardWidthWithGap);
    setCurrentIndex(newIndex);

    // 자동 스크롤 재개
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 1000);
  }, [cardWidthWithGap, animateLoopToStart, animateLoopToEnd]);

  // 윈도우 레벨 및 컨테이너에 이벤트 리스너 등록/해제
  useEffect(() => {
    const container = containerRef.current;

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleMouseUp, handleMouseMove, handleWheel]);

  //마우스 오버 / 리브 제어
  const handleMouseEnter = () => setIsAutoScrolling(false);
  const handleMouseLeave = () => {
    if (!isAnimatingRef.current && !isDraggingRef.current)
      setIsAutoScrolling(true);
  };

  const handleImgError = (e) => (e.currentTarget.src = DEFAULT_IMAGE);

  return (
    <div
      className="enhanced-carousel-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="carousel-section-header">
        <h2 className="carousel-section-title">Best 10 일간 베스트</h2>
      </div>

      <div className="enhanced-carousel-container">
        <div
          ref={containerRef}
          className="enhanced-carousel-track"
          onMouseDown={handleMouseDown}
        >
          {books.map((book, index) => (
            <div
              key={book.id}
              className="enhanced-book-card"
              onClick={() => onCardClick(book)}
            >
              <div className="bestseller-badge">{book.rank || index + 1}</div>
              <div className="enhanced-book-image">
                <img
                  src={book.image || DEFAULT_IMAGE}
                  alt={book.name}
                  onError={handleImgError}
                />
              </div>
              <div className="enhanced-book-details">
                <h3>{book.name}</h3>
                <p className="enhanced-book-price">
                  {(Number(book.price ?? 0) || 0).toLocaleString()}원
                </p>
                <p>
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
      </div>
    </div>
  );
}

// MainPage 컴포넌트 (ESLint 경고 처리됨)
function MainPage() {
  useTitle();
  const [bestBooks, setBestBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();
  const bookListRef = useRef(null);
  const handleCardClick = (book) => {
    navigate(`/book/${book.id}`);
  };

  // Infinite Scroll 로딩 함수
  const fetchAllBooks = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page;

    try {
      const data = await getProducts({ page: nextPage, size: 8 });
      const newBooks = data.results || [];

      setAllBooks((prev) => {
        const existingIds = new Set(prev.map((book) => book.id));
        const uniqueNewBooks = newBooks.filter(
          (book) => !existingIds.has(book.id)
        );
        return [...prev, ...uniqueNewBooks];
      });

      setHasMore(!!data.next);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("전체 도서 목록 호출 실패:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  // 초기 데이터 로드 (베스트셀러 & 초기 전체 도서)
  useEffect(() => {
    const fetchBestBooks = async () => {
      try {
        const rankings = await getBestSellerProducts();
        const rankingsArray = Array.isArray(rankings)
          ? rankings
          : Array.isArray(rankings?.rankings)
          ? rankings.rankings
          : [];

        const mappedBooks = rankingsArray.map((ranking) => {
          const pricePerItem =
            ranking.quantity > 0
              ? Math.round(ranking.revenue / ranking.quantity)
              : 0;
          const img = S3_BASE_URL + ranking.image;
          return {
            id: ranking.product_id,
            rank: ranking.rank,
            name: ranking.name,
            category: ranking.category,
            author: ranking.author,
            publisher: ranking.publisher,
            image: img,
            price: pricePerItem,
            stock: ranking.quantity,
            description: ranking.description,
          };
        });
        setBestBooks(mappedBooks);
      } catch (error) {
        console.error("베스트셀러 호출 실패:", error);
        setBestBooks([]);
      }
    };

    const initialLoad = async () => {
      setLoading(true);
      try {
        const data = await getProducts({ page: 1, size: 8 });
        setAllBooks(data.results || []);
        setHasMore(!!data.next);
        setPage(2);
      } catch (e) {
        console.error("초기 도서 목록 로딩 실패:", e);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBestBooks();

    //  ESLint 경고 무시 처리
    if (allBooks.length === 0 && !loading) initialLoad();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 메인배너 전체도서 버튼 클릭
  const handleScrollToAllBooks = () => {
    const headerOffset = 110;

    if (bookListRef.current) {
      const elemTop =
        bookListRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elemTop - headerOffset,
        behavior: "smooth",
      });
    }
  };
  return (
    <>
      <MainBanner
        image="main-banner2.jpg"
        title="책으로 여는 하루"
        subtitle="좋은 책과 함께 오늘을 시작하세요.."
        buttonText="전체 도서 보기"
        buttonClick={handleScrollToAllBooks}
      />
      <div className="main-page-container">
        <div className="base-container">
          {/* 일간 베스트 캐러셀 */}
          <div className="book-daily-best">
            <BookListRowLoop books={bestBooks} onCardClick={handleCardClick} />
          </div>

          {/* 전체 도서 - InfiniteScroll 적용 */}
          <section className="book-list" ref={bookListRef}>
            <h2>전체 도서</h2>
            {allBooks.length > 0 ? (
              <InfiniteScroll
                dataLength={allBooks.length}
                next={fetchAllBooks}
                hasMore={hasMore}
                loader={<Loading key="loading-spinner" />}
                endMessage={
                  !loading && (
                    <p
                      className="status-message no-more-books"
                      style={{ textAlign: "center", padding: "20px 0" }}
                    >
                      <b>마지막 도서입니다.</b>
                    </p>
                  )
                }
                style={{ overflow: "visible" }}
              >
                <BookListCol books={allBooks} onCardClick={handleCardClick} />
              </InfiniteScroll>
            ) : (
              !loading && (
                <p className="status-message error-message">
                  도서 목록을 불러오는 데 실패했거나 데이터가 없습니다. (서버/DB
                  확인 필요)
                </p>
              )
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default MainPage;
