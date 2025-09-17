import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import ProductEditForm from "./ProductEditForm";
import ProductDetail from "./ProductDetail";

function ProductModal({
  isOpen,
  isEditMode,
  selectedBook,
  errors,
  onClose,
  onDelete,
  onSave,
  onEditModeChange,
  setSelectedBook,
}) {
  return (
    <Modal
      isOpen={isOpen}
      title={isEditMode ? "상품 수정" : "상품 상세"}
      onClose={onClose}
      footer={
        isEditMode ? (
          <>
            <Button variant="secondary" onClick={() => onEditModeChange(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={onSave}>
              저장
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose}>
              닫기
            </Button>
            <Button variant="danger" onClick={() => onDelete(selectedBook.id)}>
              삭제
            </Button>
            <Button variant="primary" onClick={() => onEditModeChange(true)}>
              수정
            </Button>
          </>
        )
      }
    >
      {isEditMode ? (
        <ProductEditForm
          selectedBook={selectedBook}
          setSelectedBook={setSelectedBook}
          errors={errors}
        />
      ) : (
        <ProductDetail selectedBook={selectedBook} />
      )}
    </Modal>
  );
}

export default ProductModal;