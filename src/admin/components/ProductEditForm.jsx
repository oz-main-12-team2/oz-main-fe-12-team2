import FormGroup from "../../components/common/FormGroup";
import Select from "../../components/common/Select";

function ProductEditForm({ selectedBook, setSelectedBook, errors }) {
  return (
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
        <option value="카테고리1">카테고리1</option>
        <option value="카테고리2">카테고리2</option>
        <option value="카테고리3">카테고리3</option>
        <option value="카테고리4">카테고리4</option>
      </Select>

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
    </div>
  );
}

export default ProductEditForm;
