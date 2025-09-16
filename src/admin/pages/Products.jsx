import { useState, useEffect, useMemo } from "react";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import FormGroup from "../../components/common/FormGroup";
import Select from "../../components/common/Select";
import Pagination from "../../components/common/Pagination";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { alertComfirm, alertSuccess } from "../../utils/alert";

function Products() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const dummyBooks = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `책 ${i + 1}`,
      author: "저자",
      publisher: "출판사",
      price: 15000 + i * 1000,
      stock: `${i * 3}`,
      category: i % 2 === 0 ? "프로그래밍" : "소설",
      image_url: "/sample-book.jpg",
    }));
    setBooks(dummyBooks);
    setTotalPages(3);
  }, [currentPage]);

  const openDetailModal = (book) => {
    setSelectedBook(book);
    setIsEditMode(false);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const del = await alertComfirm("상품 삭제", "정말 삭제하시겠습니까?");
    if (!del.isConfirmed) return;

    setBooks((prev) => prev.filter((b) => b.id !== id));
    setIsModalOpen(false);

    await alertSuccess("삭제 성공", "삭제가 완료되었습니다");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedBook.name?.trim()) newErrors.name = "상품명을 입력하세요.";
    if (
      !selectedBook.price ||
      isNaN(selectedBook.price) ||
      selectedBook.price < 0
    )
      newErrors.price = "가격은 0 이상의 숫자여야 합니다.";
    if (
      !selectedBook.stock ||
      isNaN(selectedBook.stock) ||
      selectedBook.stock < 0
    )
      newErrors.stock = "재고는 0 이상의 숫자여야 합니다.";
    if (!selectedBook.category) newErrors.category = "카테고리를 선택하세요.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!validateForm()) return;

    const save = await alertComfirm("상품 저장", "저장 하시겠습니까?");
    if (!save.isConfirmed) return;

    setBooks((prev) =>
      prev.map((b) => (b.id === selectedBook.id ? selectedBook : b))
    );

    await alertSuccess("저장 성공", "저장이 완료되었습니다");
    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => [
      { header: "ID", accessorKey: "id" },
      { header: "상품명", accessorKey: "name" },
      {
        header: "가격",
        accessorKey: "price",
        cell: (info) => `${info.getValue()}원`,
      },
      { header: "재고", accessorKey: "stock" },
      { header: "카테고리", accessorKey: "category" },
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
      <h2 className="products-page-title">상품 관리</h2>

      <div className="products-table-wrap">
        <table className="products-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} onClick={() => openDetailModal(row.original)}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 모달 */}
      {selectedBook && (
        <Modal
          isOpen={isModalOpen}
          title={isEditMode ? "상품 수정" : "상품 상세"}
          onClose={() => setIsModalOpen(false)}
          footer={
            isEditMode ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditMode(false)}
                >
                  취소
                </Button>
                <Button variant="primary" onClick={handleSaveEdit}>
                  저장
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  닫기
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(selectedBook.id)}
                >
                  삭제
                </Button>
                <Button variant="primary" onClick={() => setIsEditMode(true)}>
                  수정
                </Button>
              </>
            )
          }
        >
          {isEditMode ? (
            <>
              {/* 수정모달 */}
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
                    setSelectedBook({
                      ...selectedBook,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="">선택</option>
                  <option value="프로그래밍">프로그래밍</option>
                  <option value="프론트엔드">프론트엔드</option>
                  <option value="소프트웨어공학">소프트웨어공학</option>
                  <option value="소설">소설</option>
                </Select>
              </div>
            </>
          ) : (
            <div className="product-detail">
              <div className="product-detail-left">
                <img
                  src={selectedBook.image_url || "/no-image.jpg"}
                  alt={selectedBook.name}
                  className="product-detail-image"
                  onError={(e) => {
                    e.currentTarget.src = "/no-image.jpg";
                  }}
                />
              </div>

              <div className="product-detail-right">
                <h3 className="product-detail-name">{selectedBook.name}</h3>
                <p className="product-detail-category">
                  {selectedBook.category}
                </p>
                <p className="product-detail-meta">
                  {selectedBook.author} · {selectedBook.publisher}
                </p>
                <p className="product-detail-price">
                  {(selectedBook.price ?? 0).toLocaleString()}원
                </p>
                <p className="product-detail-stock">
                  재고: {selectedBook.stock}권
                </p>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

export default Products;
