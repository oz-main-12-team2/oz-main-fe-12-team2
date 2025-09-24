import { useParams } from "react-router-dom";
import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import "../styles/cdh/book-Detail.scss"; // 기존 스타일 유지

function BookDetail() {
  const { id } = useParams();
  const [isCartModalOpen, setCartModalOpen] = useState(false);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);

  const BookDetailDummy = {
    id,
    title: "도서 제목",
    author: "저자",
    publisher: "출판사",
    price: 15000,
    salePrice: 12000,
    image: "/no-image.jpg",
    description: "책에 대한 설명 글...",
  };

  return (
    <>
      <Header />
      <div className="book-detail-page">
        <div className="base-container">
          <main className="book-detail-container">
            <div className="book-detail-image">
              <img src={BookDetailDummy.image} alt={BookDetailDummy.title} />
            </div>

            <div className="book-detail">
              <div className="book-detail-up">
                <h1>{BookDetailDummy.title}</h1>
                <p>
                  저자: {BookDetailDummy.author} | 출판사: {BookDetailDummy.publisher}
                </p>

                <div className="book-price">
                  <span className="original-price">
                    가격: {BookDetailDummy.price.toLocaleString()}원
                  </span>
                </div>
              </div>

              <div className="book-detail-bottom">
                <section className="book-detail-description">
                  <h2 className="book-introduction">책 소개</h2>
                  <p>{BookDetailDummy.description}</p>
                </section>

                <div className="book-actions">
                  <Button onClick={() => setCartModalOpen(true)}>장바구니</Button>
                  <Button onClick={() => setOrderModalOpen(true)}>구매하기</Button>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* 주문 상태 변경 모달 (이미지에 맞춘 텍스트) */}
        <Modal
          isOpen={isOrderModalOpen}
          title="주문상태 변경"
          onClose={() => setOrderModalOpen(false)}
        >
          <p>변경하시겠습니까?</p>
          <div className="custom-modal-actions">
            <button
              className="btn-confirm"
              onClick={() => {
                // 실제 로직 삽입
                alert("주문 상태가 변경되었습니다.");
                setOrderModalOpen(false);
              }}
            >
              예!
            </button>
            <button className="btn-cancel" onClick={() => setOrderModalOpen(false)}>
              아니요
            </button>
          </div>
        </Modal>

        {/* 장바구니 확인 모달 */}
        <Modal isOpen={isCartModalOpen} title="장바구니" onClose={() => setCartModalOpen(false)}>
          <p>선택하신 도서가 장바구니에 담겼습니다.</p>
          <div className="custom-modal-actions">
            <button className="btn-confirm" onClick={() => setCartModalOpen(false)}>
              확인
            </button>
          </div>
        </Modal>
      </div>
      <Footer />
    </>
  );
}

export default BookDetail;
