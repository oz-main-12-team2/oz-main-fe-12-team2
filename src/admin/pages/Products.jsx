import { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import { BookListRow } from "../../components/common/BookListRow";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import FormGroup from "../../components/common/FormGroup";
import Select from "../../components/common/Select";

function Products() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // 유효성 검사 에러 상태
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const dummyBooks = [
      {
        id: 1,
        name: "자바스크립트 완벽 가이드",
        author: "데이비드 플래너건",
        publisher: "한빛미디어",
        price: 45000,
        stock: "10",
        category: "프로그래밍",
        image_url: "image1-url.jpg",
      },
      {
        id: 2,
        name: "클린 코드",
        author: "로버트 마틴",
        publisher: "인사이트",
        price: 33000,
        stock: "5",
        category: "프로그래밍",
        image_url: "image2-url.jpg",
      },
    ];
    setBooks(dummyBooks);
    setTotalPages(3);
  }, []);

  // 수정 버튼 클릭 시
  const handleEdit = (book) => {
    setSelectedBook(book);
    setErrors({});
    setIsEditModalOpen(true);
  };

  // 삭제 버튼 클릭시
  const handleDelete = (book) => {
    console.log("삭제 클릭", book);
  };

  // 유효성 검사 함수
  const validateForm = () => {
    const newErrors = {};

    // 상품명
    if (!selectedBook.name || !selectedBook.name.trim()) {
      newErrors.name = "상품명을 입력하세요.";
    }

    // 가격: 숫자만, 0 이상
    if (
      selectedBook.price === "" ||
      isNaN(Number(selectedBook.price)) ||
      Number(selectedBook.price) < 0
    ) {
      newErrors.price = "가격은 0 이상의 숫자여야 합니다.";
    }

    // 재고: 숫자만, 0 이상
    if (
      selectedBook.stock === "" ||
      isNaN(Number(selectedBook.stock)) ||
      Number(selectedBook.stock) < 0
    ) {
      newErrors.stock = "재고 수량은 0 이상의 숫자여야 합니다.";
    }

    // 카테고리
    if (!selectedBook.category) {
      newErrors.category = "카테고리를 선택하세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 수정 저장
  const handleSaveEdit = () => {
    if (!validateForm()) return; // 에러가 있으면 API 호출 막기

    // 숫자로 변환해서 저장
    const updatedBook = {
      ...selectedBook,
      price: Number(selectedBook.price),
      stock: Number(selectedBook.stock),
    };

    console.log("수정 데이터:", updatedBook);

    // 예시로 API 호출 후 books 업데이트
    setBooks((prevBooks) =>
      prevBooks.map((b) => (b.id === updatedBook.id ? updatedBook : b))
    );

    setIsEditModalOpen(false);
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
        buttonActions={(book) => (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleEdit(book)}
            >
              수정
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDelete(book)}
            >
              삭제
            </Button>
          </>
        )}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 수정 모달 */}
      <Modal
        isOpen={isEditModalOpen}
        title="상품 수정"
        onClose={() => setIsEditModalOpen(false)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              취소
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              저장
            </Button>
          </>
        }
      >
        {selectedBook && (
          <div className="edit-form">
            <FormGroup
              label="상품명"
              type="text"
              value={selectedBook.name}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, name: e.target.value })
              }
              error={errors.name}
            />

            <FormGroup
              label="가격"
              type="text"
              value={selectedBook.price}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, price: e.target.value })
              }
              error={errors.price}
            />

            <FormGroup
              label="재고"
              type="text"
              value={selectedBook.stock}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, stock: e.target.value })
              }
              error={errors.stock}
            />

            <Select
              label="카테고리"
              value={selectedBook.category}
              error={errors.category}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, category: e.target.value })
              }
            >
              <option value="">선택</option>
              <option value="프로그래밍">프로그래밍</option>
              <option value="프론트엔드">프론트엔드</option>
              <option value="소프트웨어공학">소프트웨어공학</option>
              <option value="소설">소설</option>
            </Select>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Products;