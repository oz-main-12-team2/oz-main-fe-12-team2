import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import ProductEditForm from "./ProductEditForm";

function ProductCreateModal({
  isOpen,
  selectedBook,
  errors,
  onClose,
  onSave,
  setSelectedBook,
}) {
  return (
    <Modal
      isOpen={isOpen}
      title="상품 등록"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" onClick={onSave}>
            등록
          </Button>
        </>
      }
    >
      {/* 등록은 상세보기 필요x 폼만 보이게 */}
      <ProductEditForm
        selectedBook={selectedBook}
        setSelectedBook={setSelectedBook}
        errors={errors}
      />
    </Modal>
  );
}

export default ProductCreateModal;