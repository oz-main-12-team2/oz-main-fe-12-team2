import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// import NavBar from "../components/layout/NavBar"; 
import Loading from "../components/common/Loading";
import MainBanner from "../components/MainBanner";
import useTitle from "../hooks/useTitle.js";

import { getProducts, getBestSellerProducts } from "../api/products"; 

import "../styles/bookcardcol.scss";
import "../styles/bookcardrow.scss";
import "../styles/cdh/bookmainpage.scss";

const DEFAULT_IMAGE = "/no-image.jpg";

/* BookCard - 세로형 카드 (상품리스트) */
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

/* BookCard - 가로형 카드 (장바구니/주문내역 등) */
export function BookCardRow({ book, onClick, children }) {
    const handleImgError = (e) => {
        e.currentTarget.src = DEFAULT_IMAGE;
    };
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
            {books.map((book) => (
                <BookCardCol key={book.id} book={book} onClick={onCardClick} /> 
            ))}
        </div>
    );
}


/* BookListRowLoop - 일간 베스트 캐러셀 (자식 컴포넌트) */
function BookListRowLoop({ books, onCardClick, onHoverChange }) { 
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const containerRef = useRef(null);
    const autoScrollIntervalRef = useRef(null);

    // 캐러셀 자동 스크롤 로직 (기존 유지)
    useEffect(() => {
        if (isAutoScrolling && books.length > 0) {
            if (autoScrollIntervalRef.current) {
                clearInterval(autoScrollIntervalRef.current);
            }
            
            autoScrollIntervalRef.current = setInterval(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % books.length);
            }, 5000); 
        } else if (autoScrollIntervalRef.current) {
            clearInterval(autoScrollIntervalRef.current);
        }

        return () => {
            if (autoScrollIntervalRef.current) {
                clearInterval(autoScrollIntervalRef.current);
            }
        };
    }, [isAutoScrolling, books.length]);

    const handleImgError = (e) => {
        e.currentTarget.src = DEFAULT_IMAGE;
    };

    if (!books || books.length === 0)
        return (
            <div className="enhanced-carousel-wrapper no-data">
                <div className="carousel-section-header">
                    <h2 className="carousel-section-title">
                        <span className="title-icon-before"></span>
                        Best 10 일간 베스트
                        <span className="title-icon-after">✨</span>
                    </h2>
                </div>
                <div className="no-data-message">
                    현재 판매 데이터가 없어 베스트셀러 목록을 표시할 수 없습니다. 
                    <p className="no-data-subtext">서버/DB에 통계 데이터를 채워넣어 주세요!</p>
                </div>
            </div>
        );

    return (
        <div
            className="enhanced-carousel-wrapper"
            onMouseEnter={() => {
                setIsAutoScrolling(false);
                onHoverChange && onHoverChange(true); 
            }}
            onMouseLeave={() => {
                setIsAutoScrolling(true);
                onHoverChange && onHoverChange(false);
            }}
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
                            <div className="bestseller-badge">👑 #{book.rank || index + 1}</div>

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
                                    💰 {(Number(book.price ?? 0) || 0).toLocaleString()}원
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
                                index === currentIndex ? "active" : ""
                            }`}
                        />
                    ))}
                </div>
            </div>
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
    
    const [isScrollLocked, setIsScrollLocked] = useState(false); 

    const navigate = useNavigate();
    const bookListRef = useRef(null);
    const observerRef = useRef(null);
    

    /* 도서 클릭 -> 상세 페이지 이동 */
    const handleCardClick = (book) => {
        navigate(`/book/${book.id}`);
    };

    /* 스크롤 잠금 핸들러 (useCallback 유지) */
    const handleSetScrollLocked = useCallback((isLocked) => {
        setIsScrollLocked(isLocked);
    }, []); 

    /* Body Scroll Lock Effect (기존 유지) */
    useEffect(() => {
        document.body.style.overflow = isScrollLocked ? 'hidden' : 'unset';
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isScrollLocked]); 

    /* 💡 [수정] 전체 도서 무한 스크롤 API (useCallback 적용) */
    // 내부에서 사용하는 모든 상태/상수/함수를 종속성에 포함합니다.
    const fetchAllBooks = useCallback(async (pageNum) => {
        if (loading || !hasMore) return;
        setLoading(true);
        
        try {
            const data = await getProducts({ page: pageNum, size: 8 });
            const newBooks = data.results || []; 
            
            setAllBooks((prev) => {
                const existingIds = new Set(prev.map(book => book.id));
                const uniqueNewBooks = newBooks.filter(book => !existingIds.has(book.id));
                return [...prev, ...uniqueNewBooks];
            });
            
            setHasMore(!!data.next);
        } catch (error) {
            console.error("전체 도서 목록 호출 실패:", error);
            if (error.code === 404 || error.code === 'NETWORK_ERROR') {
                setHasMore(false); 
            }
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore]); //  종속성: loading, hasMore

    /* 초기 데이터 로드 (베스트셀러와 첫 페이지 전체 도서) - (fetchAllBooks 추가) */
    useEffect(() => {
        const fetchBestBooks = async () => {
            // ... (BestSeller fetching logic is long, omitted for brevity) ...
            try {
                const rankings = await getBestSellerProducts();
                const rankingsArray = Array.isArray(rankings) 
                    ? rankings 
                    : Array.isArray(rankings?.rankings) 
                        ? rankings.rankings 
                        : []; 

                const mappedBooks = rankingsArray.map(ranking => {
                    const pricePerItem = 
                        ranking.quantity > 0 
                            ? Math.round(ranking.revenue / ranking.quantity) 
                            : 0; 

                    return {
                        id: ranking.product_id,     
                        rank: ranking.rank,         
                        name: ranking.name,
                        category: ranking.category,
                        author: ranking.author,
                        publisher: ranking.publisher,
                        image: ranking.image,
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

        fetchBestBooks();
        if (page === 1) fetchAllBooks(1); 
    }, [fetchAllBooks, page]); //  종속성: fetchAllBooks, page 추가 (page=1일 때만 호출)

    /* 무한 스크롤 옵저버 - (기존 유지) */
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
        return () => observer.disconnect();
    }, [handleObserver]);

    /*  [수정] 페이지 증가 시 데이터 호출 (fetchAllBooks 추가) */
    useEffect(() => {
        if (page > 1) fetchAllBooks(page); 
    }, [page, fetchAllBooks]); //  종속성: page, fetchAllBooks 추가

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
                    {/* 일간 베스트: 분리된 컴포넌트 호출 */}
                    <div className="book-daily-best">
                        <BookListRowLoop 
                            books={bestBooks} 
                            onCardClick={handleCardClick} 
                            onHoverChange={handleSetScrollLocked}
                        />
                    </div>

                    {/* 전체 도서 */}
                    <section className="book-list" ref={bookListRef}>
                        <h2>전체 도서</h2>
                        <BookListCol books={allBooks} onCardClick={handleCardClick} />

                        {/* 로딩 중 메시지 */}
                        {loading && hasMore && <Loading />}

                        {/* 무한 스크롤 트리거 */}
                        <div ref={observerRef} style={{ height: "20px" }} />

                        {/* 마지막 도서 메시지 */}
                        {!hasMore && !loading && allBooks.length > 0 && (
                            <p className="status-message no-more-books">
                                마지막 도서입니다.
                            </p>
                        )}

                        {/* 초기 로딩 실패/데이터 없음 메시지 */}
                        {!loading && allBooks.length === 0 && (
                            <p className="status-message error-message">
                                도서 목록을 불러오는 데 실패했거나 데이터가 없습니다. (서버/DB 확인 필요)
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}

export default MainPage;