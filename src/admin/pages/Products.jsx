import { useState, useEffect, useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";
import { alertComfirm, alertSuccess } from "../../utils/alert";
import ProductsTable from "../components/ProductsTable";
import ProductModal from "../components/ProductModal";
import ProductCreateModal from "../components/ProductCreateModal";
import { getProducts } from "../../api/products";
import { formatDateShort } from "../../utils/dateFormat";
import Loading from "../../components/common/Loading";
import { createProduct, deleteProduct, updateProduct } from "../../api/admin";

function Products() {
  const [books, setBooks] = useState([]); // 상품 목록 데이터
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [isModalOpen, setIsModalOpen] = useState(false); // 상세/수정 모달 열림 boolean
  const [isEditMode, setIsEditMode] = useState(false); // 상세 모달에서 수정 모드 boolean
  const [selectedBook, setSelectedBook] = useState(null); // 선택된 상품 데이터
  const [errors, setErrors] = useState({}); // 폼 입력값 에러 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false); // 상품 등록 모달 열림 boolaen
  const [isLoading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 메시지

  // api 호출 후 상품리스트 업뎃 위한 공통함수
  const refreshProducts = async (page = currentPage) => {
    try {
      const res = await getProducts({
        page,
        size: 8,
        ordering: "-id",
      });
      setBooks(res.results || []);
      setTotalPages(Math.ceil((res.count || 1) / 8));
    } catch (e) {
      console.error("상품 목록 새로고침 실패:", e);
      setError(e.message || "상품 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getProducts({
          page: currentPage,
          size: 8,
          ordering: "-id",
        });
        console.log(res.results);
        setBooks(res.results || []);
        setTotalPages(Math.ceil((res.count || 1) / 10));
      } catch (e) {
        console.error("상품 불러오기 실패 : ", e);
        setError(e.message || "상품 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
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
      description: "",
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

    try {
      await deleteProduct(id);

      // 삭제 후 새로고침
      await refreshProducts();

      setIsModalOpen(false);

      await alertSuccess("상품 삭제 성공", "상품이 삭제되었습니다");
    } catch (e) {
      console.error("상품 삭제 실패:", e);
      setError(e.message || "상품 삭제 중 오류가 발생했습니다.");
    }
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
    if (selectedBook.price === "" || isNaN(price) || price <= 0) {
      newErrors.price = "가격은 1 이상의 숫자여야 합니다.";
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

    // 상품 설명
    if (!selectedBook.description?.trim()) {
      newErrors.description = "상품 설명을 입력하세요.";
    }

    // 이미지 파일 체크
    if (selectedBook.imageFile) {
      const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
      const fileExtension = selectedBook.imageFile.name
        .split(".")
        .pop()
        .toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        newErrors.imageFile =
          "이미지 파일만 업로드 가능합니다 (jpg, jpeg, png, gif, webp, svg).";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 수정 저장
  const handleEditSave = async () => {
    if (!validateForm()) return;

    const res = await alertComfirm("상품 수정", "수정 하시겠습니까?");
    if (!res.isConfirmed) return;

    try {
      await updateProduct(selectedBook.id, selectedBook);

      await refreshProducts(); // 수정 후 새로고침

      await alertSuccess("상품 수정 성공", "수정이 완료되었습니다");
      setIsModalOpen(false);
      setSelectedBook(null);
    } catch (e) {
      console.error("상품 수정 실패:", e);
      setError(e.message || "상품 수정 중 오류가 발생했습니다.");
    }
  };

  // 등록 저장
  const handleCreateSave = async () => {
    if (!validateForm()) return; // 유효성 검사 실패 시 종료

    const res = await alertComfirm("상품 등록", "등록하시겠습니까?");
    if (!res.isConfirmed) return;

    try {
      await createProduct(selectedBook);

      await alertSuccess("상품 등록 성공", "상품이 등록되었습니다");

      await refreshProducts(1); // 등록 후 첫 페이지 새로고침

      setCurrentPage(1); // 첫 페이지로 이동해서 다시 불러오기

      // 모달 닫기 + 선택 초기화
      setIsCreateOpen(false);
      setSelectedBook(null);
    } catch (e) {
      console.error("상품 등록 실패:", e);
      setError(e.message || "상품 등록 중 오류가 발생했습니다.");
    }
  };

  // 테이블 컬럼 정의
  const columns = useMemo(
    () => [
      {
        header: "이미지",
        accessorKey: "image",
        cell: (info) => (
          <img
            src={info.getValue() || "/no-image.jpg"}
            alt="상품 이미지"
            style={{
              width: 40,
              height: 40,
              objectFit: "cover",
              borderRadius: 4,
            }}
            onError={(e) => {
              e.currentTarget.src = "/no-image.jpg"; // 로딩 실패시 noImage
            }}
          />
        ),
      },
      { header: "ID", accessorKey: "id" },
      { header: "상품명", accessorKey: "name" },
      { header: "카테고리", accessorKey: "category" },
      {
        header: "상품 설명",
        accessorKey: "description",
      },
      { header: "저자", accessorKey: "author" },
      { header: "출판사", accessorKey: "publisher" },
      {
        header: "가격",
        accessorKey: "price",
        cell: (info) =>
          `${Number(info.getValue()).toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}원`, // 소수점 제거
      },
      {
        header: "재고",
        accessorKey: "stock",
        cell: (info) => Number(info.getValue()).toLocaleString(),
      },
      {
        header: "등록일",
        accessorKey: "created_at",
        cell: (info) => formatDateShort(info.getValue()),
      },
      {
        header: "상태",
        accessorKey: "status",
        cell: (info) => {
          const value = info.row.original.stock;
          const style = {
            color: value > 0 ? "blue" : "red",
            fontWeight: "600",
          };
          return <span style={style}>{value > 0 ? "판매중" : "품절"}</span>;
        },
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

      {isLoading && <Loading loadingText={"상품 목록 불러오는 중"} />}
      {error && <p className="error">{error}</p>}
      {/* 상품 테이블 */}
      {!isLoading && !error && (
        <>
          {/* 상품 테이블 */}
          <ProductsTable table={table} onRowClick={openDetailModal} />

          {/* 페이지네이션 */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

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
