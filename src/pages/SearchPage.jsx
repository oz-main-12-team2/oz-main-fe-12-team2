import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../api/products";
import { BookListCol } from "../components/common/BookListCol";
import Loading from "../components/common/Loading";
import "../styles/searchpage.scss";
import Button from "../components/common/Button";
import { FiCreditCard } from "react-icons/fi";
import { LuShoppingCart } from "react-icons/lu";
import useTitle from "../hooks/useTitle";
import { addCart, getCart } from "../api/cart";
import { alertComfirm, alertError } from "../utils/alert";
import useCartStore from "../stores/cartStore";
import useBuyMove from "../hooks/useBuyMove";
import { AiOutlineStop } from "react-icons/ai";
import useUserStore from "../stores/userStore";
import InfiniteScroll from "react-infinite-scroll-component";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(["전체"]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const setCartItems = useCartStore((state) => state.setCartItems);
  const cartItems = useCartStore((state) => state.cartItems);
  const user = useUserStore((state) => state.user);
  const loginCheck = !!user;
  const [totalCount, setTotalCount] = useState(0);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부

  const navigate = useNavigate();
  const buyMove = useBuyMove();

  useTitle(`${query} - 검색결과`);

  // 페이지 단위로 상품 불러오기 함수
  const loadProducts = useCallback(
    async (category, requestedPage = 1, isNewSearch = false) => {
      if (!query) {
        setBooks([]);
        setHasMore(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params =
          category && category !== "전체"
            ? {
                query,
                category,
                ordering: "-id",
                page: requestedPage,
                size: 20,
              }
            : {
                query,
                ordering: "-id",
                page: requestedPage,
                size: 20,
              };

        const res = await getProducts(params);
        const newResults = res.results || [];
        setTotalCount(res.count);
        setBooks((prevBooks) =>
          isNewSearch ? newResults : [...prevBooks, ...newResults]
        );

        setHasMore(Boolean(res.next) && newResults.length > 0);

        if ((!category || category === "전체") && requestedPage === 1) {
          const allCategory = newResults.map((b) => b.category);
          const uniqueCategory = allCategory.filter(
            (val, i) => allCategory.indexOf(val) === i
          );
          setCategories(["전체", ...uniqueCategory]);
        }
      } catch {
        setError("검색 결과를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [query]
  );

  // 검색어/카테고리 변경 시 초기화 및 첫페이지 로드
  useEffect(() => {
    setBooks([]);
    setPage(1);
    setHasMore(true);
    loadProducts(selectedCategory, 1, true);
  }, [selectedCategory, query, loadProducts]);

  // 무한스크롤 다음 페이지 불러오기 함수
  const getMoreBooks = () => {
    if (hasMore && !isLoading) {
      const nextPage = page + 1;
      loadProducts(selectedCategory, nextPage);
      setPage(nextPage);
    }
  };

  const handleCardClick = (book) => {
    navigate(`/book/${book.id}`);
  };

  const handleAddToCart = async (book) => {
    const hasCartCheck = cartItems.find((item) => item.product_id === book.id);

    if (hasCartCheck) {
      await alertError("장바구니 추가 실패", "이미 장바구니에 담긴 상품입니다");
      return;
    }

    const newItem = {
      ...book,
      price: Number(book.price) || 0,
      stock: book.stock || 0,
      image_url: book.image || null,
    };

    try {
      const alert = await alertComfirm(
        "장바구니 추가",
        "정말 추가 하시겠습니까?"
      );
      if (!alert.isConfirmed) return;

      await addCart({ productId: book.id, quantity: 1 });

      setCartItems([...cartItems, newItem]);

      const res = await getCart();
      setCartItems(res[0]?.items || []);

      const alert2 = await alertComfirm(
        "장바구니에 추가 성공",
        "장바구니로 이동하시겠습니까?"
      );
      if (!alert2.isConfirmed) return;

      navigate("/cart");
    } catch {
      alertError("장바구니 추가 오류", "장바구니 추가 중 오류가 발생했습니다.");
    }
  };

  const handleBuyNow = async (book) => {
    const buyProduct = [
      {
        book: {
          ...book,
          price: Number(book.price) || 0,
          stock: book.stock || 0,
          image_url: book.image || null,
        },
        quantity: 1,
      },
    ];

    try {
      const alert = await alertComfirm(
        "바로 구매",
        "이 상품을 바로 구매하시겠습니까?"
      );
      if (!alert.isConfirmed) return;

      buyMove(buyProduct, "direct");
    } catch {
      alertError("구매 오류", "상품 구매 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div className="base-container">
        <div className="search-page">
          <div className="search-header">
            <div className="search-info">
              "{query}" 검색 결과
              <span className="count">{totalCount}건</span>
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div className="category-filter">
            {categories.map((cate) => (
              <button
                key={cate}
                className={selectedCategory === cate ? "active" : ""}
                onClick={() => setSelectedCategory(cate)}
              >
                {cate}
              </button>
            ))}
          </div>

          {isLoading && books.length === 0 ? (
            <Loading loadingText="도서 검색 중" size={60} />
          ) : error ? (
            <p className="book-list-col-empty">{error}</p>
          ) : (
            <InfiniteScroll
              dataLength={books.length}
              next={getMoreBooks}
              hasMore={hasMore}
              loader={<Loading loadingText="도서 더 불러오는 중" size={60} />}
              scrollThreshold="95%"
            >
              <BookListCol
                books={books}
                onCardClick={handleCardClick}
                actions={(book) => {
                  const isSoldOut = book.stock === 0;
                  return (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!loginCheck) {
                            alertError(
                              "로그인 필요",
                              "로그인 후 이용해 주세요."
                            );
                            return;
                          }
                          handleAddToCart(book);
                        }}
                      >
                        <LuShoppingCart className="button-icon cart-icon" />
                        장바구니
                      </Button>
                      {isSoldOut ? (
                        <Button variant="primary" size="md" disabled>
                          <AiOutlineStop size={16} />
                          품절
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="md"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!loginCheck) {
                              alertError(
                                "로그인 필요",
                                "로그인 후 이용해 주세요"
                              );
                              return;
                            }
                            handleBuyNow(book);
                          }}
                        >
                          <FiCreditCard className="button-icon" />
                          바로구매
                        </Button>
                      )}
                    </div>
                  );
                }}
              />
            </InfiniteScroll>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchPage;
