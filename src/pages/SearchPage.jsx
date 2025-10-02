import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
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

  const navigate = useNavigate();
  const buyMove = useBuyMove();

  useTitle(`${query} - 검색결과`);

  const loadProducts = useCallback(
    async (category) => {
      if (!query) {
        setBooks([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params =
          category && category !== "전체"
            ? { query, category, ordering: "-id" }
            : { query, ordering: "-id" };

        const res = await getProducts(params);
        setBooks(res.results || []);

        if (!category || category === "전체") {
          const allCategory = res.results.map((b) => b.category);

          // 중복 제거
          const uniqueCategory = allCategory.filter(
            (val, i) => allCategory.indexOf(val) === i
          );

          setCategories(["전체", ...uniqueCategory]);
        }
      } catch (e) {
        console.error("상품 검색 실패:", e);
        setError("검색 결과를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    loadProducts(selectedCategory);
  }, [selectedCategory, loadProducts]);

  const handleCardClick = (book) => {
    navigate(`/book/${book.id}`);
  };

  const handleAddToCart = async (book) => {
    const hasCartCheck = cartItems.find((item) => item.product_id === book.id);

    if (hasCartCheck) {
      await alertError("장바구니 추가 실패", "이미 장바구니에 담긴 상품입니다");
      return;
    }

    // 상태에 바로 추가
    const newItem = {
      product_id: book.id,
      product_name: book.product_name || book.name,
      product_price: book.product_price || book.price,
      product_author: book.product_author,
      product_publisher: book.product_publisher,
      product_stock: book.product_stock || 0,
      product_image: book.product_image || null,
      quantity: 1,
    };

    try {
      const alert = await alertComfirm(
        "장바구니 추가",
        "정말 추가 하시겠습니까?"
      );
      if (!alert.isConfirmed) return;

      await addCart({ productId: book.id, quantity: 1 });

      setCartItems([...cartItems, newItem]); // 전역상태 업데이트

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
    // 상품 정보를 구매용 구조로 생성
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

      // 결제 페이지로 이동하며 구매 상품 정보 전달
      buyMove(buyProduct, "direct");
    } catch {
      alertError("구매 오류", "상품 구매 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Header />
      <div className="base-container">
        <div className="search-page">
          <div className="search-header">
            <div className="search-info">
              "{query}" 검색 결과
              <span className="count">{books.length}건</span>
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

          {isLoading ? (
            <Loading loadingText="도서 검색 중" size={60} />
          ) : error ? (
            <p className="book-list-col-empty">{error}</p>
          ) : (
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
                          alertError("로그인 필요", "로그인 후 이용해 주세요.");
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
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SearchPage;
