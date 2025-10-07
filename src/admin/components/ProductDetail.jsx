function ProductDetail({ selectedBook }) {
  return (
    <div className="product-detail">
      <div className="product-detail-left">
        <img
          src={selectedBook.image || "/no-image.jpg"}
          alt={selectedBook.name}
          className="product-detail-image"
          onError={(e) => {
            e.currentTarget.src = "/no-image.jpg";
          }}
        />
      </div>

      <div className="product-detail-right">
        <h3 className="product-detail-name">{selectedBook.name}</h3>
        <p className="product-detail-category">{selectedBook.category}</p>
        <p className="product-detail-meta">
          {selectedBook.author} · {selectedBook.publisher}
        </p>
        <p className="product-detail-price">
          {Math.floor(Number(selectedBook.price ?? 0)).toLocaleString()}원
        </p>
        <p className="product-detail-stock">재고: {selectedBook.stock}권</p>
        <p className="product-detail-description">
          {selectedBook.description || "설명 없음"}
        </p>
      </div>
    </div>
  );
}

export default ProductDetail;
