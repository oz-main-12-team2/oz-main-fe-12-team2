import { useState, useEffect } from "react";
import FormGroup from "../../components/common/FormGroup";
import Select from "../../components/common/Select";

function ProductEditForm({ selectedBook, setSelectedBook, errors }) {
  const [previewUrl, setPreviewUrl] = useState("");

  // 파일 선택 시 미리보기 URL 생성
  useEffect(() => {
    if (selectedBook.imageFile) {
      const objectUrl = URL.createObjectURL(selectedBook.imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // 메모리 누수 방지
    } else {
      setPreviewUrl("");
    }
  }, [selectedBook.imageFile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedBook({ ...selectedBook, imageFile: file });
    }
  };

  return (
    <form className="edit-form" onSubmit={(e) => e.preventDefault()}>
      <FormGroup
        label="상품명"
        type="text"
        value={selectedBook.name}
        onChange={(e) =>
          setSelectedBook({ ...selectedBook, name: e.target.value })
        }
        error={errors.name}
      />

      {/* 카테고리 */}
      <Select
        label="카테고리"
        value={selectedBook.category}
        error={errors.category}
        onChange={(e) =>
          setSelectedBook({ ...selectedBook, category: e.target.value })
        }
      >
        <option value="">선택</option>
        <option value="카테고리1">카테고리1</option>
        <option value="카테고리2">카테고리2</option>
        <option value="카테고리3">카테고리3</option>
        <option value="카테고리4">카테고리4</option>
      </Select>

      {/* 상품 설명 */}
      <FormGroup
        label="상품 설명"
        type="textarea"
        value={selectedBook.description || ""}
        onChange={(e) =>
          setSelectedBook({ ...selectedBook, description: e.target.value })
        }
        error={errors.description}
        rows={3} // 세로 줄 수
      />

      <FormGroup
        label="저자"
        type="text"
        value={selectedBook.author}
        onChange={(e) =>
          setSelectedBook({ ...selectedBook, author: e.target.value })
        }
        error={errors.author}
      />

      <FormGroup
        label="출판사"
        type="text"
        value={selectedBook.publisher}
        onChange={(e) =>
          setSelectedBook({ ...selectedBook, publisher: e.target.value })
        }
        error={errors.publisher}
      />

      <FormGroup
        label="가격"
        type="number"
        value={selectedBook.price}
        onChange={(e) =>
          setSelectedBook({ ...selectedBook, price: e.target.value })
        }
        error={errors.price}
      />

      <FormGroup
        label="재고"
        type="number"
        value={selectedBook.stock}
        onChange={(e) =>
          setSelectedBook({ ...selectedBook, stock: e.target.value })
        }
        error={errors.stock}
      />

      {/* 이미지 업로드 */}
      <div className="form-group image-upload-group">
        <label className="form-label">상품 이미지</label>

        <div className="image-upload-row">
          {/* 미리보기 먼저 배치 */}
          {previewUrl && (
            <div className="image-preview">
              <button
                type="button"
                className="remove-button"
                onClick={() =>
                  setSelectedBook({ ...selectedBook, imageFile: null })
                }
              >
                ✕
              </button>
              <img src={previewUrl} alt="미리보기" />
            </div>
          )}

          {/* 파일선택 버튼 오른쪽 */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        {errors.imageFile && <p className="form-error">{errors.imageFile}</p>}
      </div>
    </form>
  );
}

export default ProductEditForm;
