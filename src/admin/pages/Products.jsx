import { useState, useEffect, useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";
import { alertComfirm, alertSuccess } from "../../utils/alert";
import ProductsTable from "../components/ProductsTable";
import ProductModal from "../components/ProductModal";
import ProductCreateModal from "../components/ProductCreateModal";

function Products() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [errors, setErrors] = useState({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // 더미 데이터
  useEffect(() => {
    const dummyBooks = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `책 ${i + 1}`,
      author: "저자",
      publisher: "출판사",
      price: Math.floor(Math.random() * 100000),
      stock: Math.floor(Math.random() * 10),
      category: i % 2 === 0 ? "카테고리1" : "카테고리2",
      image_url: "/sample-book.jpg",
    }));
    setBooks(dummyBooks);
    setTotalPages(10);
  }, [currentPage]);

  // 상세 모달 열기
  const openDetailModal = (book) => {
    setSelectedBook(book);
    setIsEditMode(false);
    setErrors({});
    setIsModalOpen(true);
  };

  // 등록 모달 열기
  const openCreateModal = () => {
    setSelectedBook({
      id: null,
      name: "",
      author: "",
      publisher: "",
      price: 0,
      stock: 0,
      category: "",
      image_url: "",
    });
    setIsEditMode(true);
    setErrors({});
    setIsCreateOpen(true);
  };

  // 삭제
  const handleDelete = async (id) => {
    const del = await alertComfirm("상품 삭제", "정말 삭제하시겠습니까?");
    if (!del.isConfirmed) return;

    setBooks((prev) => prev.filter((b) => b.id !== id));
    setIsModalOpen(false);

    await alertSuccess("삭제 성공", "삭제가 완료되었습니다");
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    // 상품명
    if (!selectedBook.name?.trim()) {
      newErrors.name = "상품명을 입력하세요.";
    }

    // 저자
    if (!selectedBook.author?.trim()) {
      newErrors.author = "저자를 입력하세요.";
    }

    // 출판사
    if (!selectedBook.publisher?.trim()) {
      newErrors.publisher = "출판사를 입력하세요.";
    }

    // 가격
    const price = Number(selectedBook.price);
    if (selectedBook.price === "" || isNaN(price) || price < 0) {
      newErrors.price = "가격은 0 이상의 숫자여야 합니다.";
    }

    // 재고
    const stock = Number(selectedBook.stock);
    if (selectedBook.stock === "" || isNaN(stock) || stock < 0) {
      newErrors.stock = "재고는 0 이상의 숫자여야 합니다.";
    }

    // 카테고리
    if (!selectedBook.category) {
      newErrors.category = "카테고리를 선택하세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 수정 저장
  const handleEditSave = async () => {
    if (!validateForm()) return;

    const res = await alertComfirm("상품 수정", "수정 하시겠습니까?");
    if (!res.isConfirmed) return;

    setBooks((prev) =>
      prev.map((b) => (b.id === selectedBook.id ? selectedBook : b))
    );

    await alertSuccess("저장 성공", "수정이 완료되었습니다");
    setIsModalOpen(false);
  };

  // 등록 저장
  const handleCreateSave = async () => {
    if (!validateForm()) return;

    const res = await alertComfirm("상품 등록", "등록하시겠습니까?");
    if (!res.isConfirmed) return;

    const newBook = {
      ...selectedBook,
      id: books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1,
    };

    setBooks((prev) => [...prev, newBook]);

    await alertSuccess("등록 성공", "상품이 등록되었습니다");
    setIsCreateOpen(false);
  };

  // 테이블 컬럼 정의
  const columns = useMemo(
    () => [
      { header: "ID", accessorKey: "id" },
      { header: "상품명", accessorKey: "name" },
      { header: "카테고리", accessorKey: "category" },
      { header: "저자", accessorKey: "author" },
      { header: "출판사", accessorKey: "publisher" },
      {
        header: "가격",
        accessorKey: "price",
        cell: (info) => `${Number(info.getValue()).toLocaleString()}원`,
      },
      {
        header: "재고",
        accessorKey: "stock",
        cell: (info) => Number(info.getValue()).toLocaleString(),
      },
    ],
    []
  );

  const table = useReactTable({
    data: books,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="products-page">
      <h2 className="products-page-title">상품관리</h2>

      {/* 상품 등록 버튼 */}
      <div className="products-actions">
        <Button variant="primary" size="md" onClick={openCreateModal}>
          + 상품 등록
        </Button>
      </div>

      {/* 상품 테이블 */}
      <ProductsTable table={table} onRowClick={openDetailModal} />

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* ProductModal.jsx (상세/수정) */}
      {selectedBook && selectedBook.id && (
        <ProductModal
          isOpen={isModalOpen}
          isEditMode={isEditMode}
          selectedBook={selectedBook}
          errors={errors}
          onClose={() => setIsModalOpen(false)}
          onDelete={handleDelete}
          onSave={handleEditSave}
          onEditModeChange={setIsEditMode}
          setSelectedBook={setSelectedBook}
        />
      )}

      {/* ProductCreateModal.jsx (등록) */}
      {selectedBook && !selectedBook.id && (
        <ProductCreateModal
          isOpen={isCreateOpen}
          selectedBook={selectedBook}
          errors={errors}
          onClose={() => setIsCreateOpen(false)}
          onSave={handleCreateSave}
          setSelectedBook={setSelectedBook}
        />
      )}
    </div>
  );
}

export default Products;