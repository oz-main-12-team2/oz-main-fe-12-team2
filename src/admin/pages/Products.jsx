import { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import { BookListRow } from "../../components/common/BookListRow";

function Products() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // 실제로는 API 호출
    setBooks([
      {
        id: 1,
        name: "자바스크립트 완벽 가이드",
        author: "데이비드 플래너건",
        publisher: "한빛미디어",
        price: 45000,
        stock: 10,
        category: "프로그래밍",
        image_url: "image1-url.jpg",
      },
      {
        id: 2,
        name: "자바스크립트 완벽 가이드2",
        author: "데이비드 플래너건",
        publisher: "한빛미디어",
        price: 45000,
        stock: 10,
        category: "프로그래밍",
        image_url: "image1-url.jpg",
      },
      {
        id: 3,
        name: "자바스크립트 완벽 가이드3",
        author: "데이비드 플래너건",
        publisher: "한빛미디어",
        price: 45000,
        stock: 10,
        category: "프로그래밍",
        image_url: "image1-url.jpg",
      },
      {
        id: 4,
        name: "자바스크립트 완벽 가이드4",
        author: "데이비드 플래너건",
        publisher: "한빛미디어",
        price: 45000,
        stock: 10,
        category: "프로그래밍",
        image_url: "image1-url.jpg",
      },
      {
        id: 5,
        name: "자바스크립트 완벽 가이드5",
        author: "데이비드 플래너건",
        publisher: "한빛미디어",
        price: 45000,
        stock: 10,
        category: "프로그래밍",
        image_url: "image1-url.jpg",
      },
    ]);
  }, []);

  const handleEdit = () => {
    console.log("수정 클릭");
  };

  const handleDelete = () => {
    console.log("삭제 클릭");
  };

  return (
    <div className="products-page">
      <h2 className="products-page-title">상품 관리</h2>
      <div className="products-actions">
        <Button variant="primary" onClick={() => console.log("상품 추가 클릭")}>
          + 상품 추가
        </Button>
      </div>
      <BookListRow
        books={books}
        onCardClick={(book) => console.log("클릭한 책:", book)}
        buttonActions={() => (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleEdit()}
            >
              수정
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDelete()}
            >
              삭제
            </Button>
          </>
        )}
      />
    </div>
  );
}

export default Products;
