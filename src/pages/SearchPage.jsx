import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { getProducts } from "../api/products";
import { BookListCol } from "../components/common/BookListCol";
import Loading from "../components/common/Loading";
import "../styles/searchpage.scss";
import Button from "../components/common/Button";
import { FiCreditCard } from "react-icons/fi";
import { LuShoppingCart } from "react-icons/lu";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(["전체"]);
  const [selectedCategory, setSelectedCategory] = useState("전체");

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
    window.location.href = `/book/${book.id}`;
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
              actions={(book) => (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("장바 클릭 : ", book);
                    }}
                  >
                    <LuShoppingCart className="button-icon cart-icon" /> 장바구니
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("구매 클릭 : ", book);
                    }}
                  >
                    <FiCreditCard className="button-icon" />
                    바로구매
                  </Button>
                </div>
              )}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SearchPage;
