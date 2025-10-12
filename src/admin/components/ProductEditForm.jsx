import { useState, useEffect } from "react";
import FormGroup from "../../components/common/FormGroup";
import Select from "../../components/common/Select";

const categories = [
  "소설",
  "프로그래밍",
  "시/에세이",
  "인문",
  "가정/육아",
  "요리",
  "건강",
  "취미/실용/스포츠",
  "컴퓨터/IT",
  "경제/경영",
  "자기계발",
  "정치/사회",
  "역사/문화",
  "종교",
  "예술/대중문화",
  "중/고등참고서",
  "기술/공학",
  "외국어",
  "과학",
  "취업/수험서",
  "여행",
];

function ProductEditForm({ selectedBook, setSelectedBook, errors }) {
  const [previewUrl, setPreviewUrl] = useState(selectedBook.image || "");
  const [fileName, setFileName] = useState("");

  // 파일 선택 시 미리보기 URL 생성
  useEffect(() => {
    if (selectedBook.imageFile) {
      const objectUrl = URL.createObjectURL(selectedBook.imageFile);
      setPreviewUrl(objectUrl);
      setFileName(selectedBook.imageFile.name);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(selectedBook.image || "");
      setFileName("");
    }
  }, [selectedBook.imageFile, selectedBook.image]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedBook({ ...selectedBook, imageFile: file });
      setFileName(file.name);
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
        {categories.map((cate) => (
          <option key={cate} value={cate}>
            {cate}
          </option>
        ))}
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
        rows={3} // 세로줄
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
        type="text"
        value={Number(selectedBook.price)}
        onChange={(e) =>
          setSelectedBook({ ...selectedBook, price: e.target.value })
        }
        error={errors.price}
      />

      <FormGroup
        label="재고"
        type="text"
        value={Number(selectedBook.stock)}
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
                  setSelectedBook({
                    ...selectedBook,
                    imageFile: null,
                    image: "",
                  })
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
            id="file-upload"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          <label htmlFor="file-upload" className="custom-file-label">
            이미지 선택
          </label>

          {/* 선택된 파일명 표시 */}
          {fileName && <span className="file-name">{fileName}</span>}
        </div>

        {errors.imageFile && <p className="form-error">{errors.imageFile}</p>}
      </div>
    </form>
  );
}

export default ProductEditForm;
