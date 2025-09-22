import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button"; 
import "../styles/cdh/book-detail.scss";

function BookDetail() {
    const { id } = useParams();

    // 임시 더미 데이터.
    const BookDetailDummy = {
        id,
        title: "도서 제목",
        author: "저자",
        publisher: "출판사",
        pubDate: "2024-09-01",
        price: 15000,
        salePrice: 12000,
        image: "/no-image.jpg",
        description:
        "책에 대한 설명 글 책에 대한 설명 글 책에 대한 설명 글 책에 대한 설명 글 책에 대한 설명 글 책에 대한 설명 글책에 대한 설명 글 책에 대한 설명 글 책에 대한 설명 글 책에 대한 설명 글 책에 대한 설명 글 책에 대한 설명 글",
    }

    return (
        <div className="book-detail-page">
            <div className="base-container">
            <Header />
            
            <main className="book-detail-container">
                {/* 도서 이미지 */}
                <div className="book-detail-image">
                    <img src={BookDetailDummy.image} alt={BookDetailDummy.title} />
                </div>
            <div className="book-detail">
                {/* 도서 기본 정보 */}
                <div className="book-detail-up">
                    <h1>{BookDetailDummy.title}</h1>
                    <p>
                        저자: {BookDetailDummy.author} | 출판사: {BookDetailDummy.publisher} | 출판일: {" "}
                        {BookDetailDummy.pubDate}
                    </p>

                    {/* 가격 */}
                    <div className="book-price">
                        <span className="original-price">가격: {BookDetailDummy.price.toLocaleString()}원</span>
                        <span className="sale-price"></span>
                    </div>
            </div>

            <div className="book-detail-bottom">
            {/* 상세 설명 */}
            <section className="book-detail-description">
                <h2 className="book-introduction">책 소개</h2> 
                
                <p>{BookDetailDummy.description}</p>                
            </section>
                    {/* 구매 버튼 */}
                    <div className="book-actions">
                        {/* 구매하기 버튼 결제 페이지와 연결고리 필요 */}
                        <Button variant="secondary" size="lg" type="button" onClick={() => alert("구매하시겠습니까?")}>구매하기</Button> 
                        <Button variant="secondary" size="lg" type="button" onClick={() => alert("장바구니에 추가됨")}>장바구니에 넣기</Button>
                    </div>
                    </div>
                </div>
                {/* 추후 API 요청으로 해당 책의 상세정보 가져오기 */}
                {/* 제목, 저자, 가격, 설명 등 혹은 정해진 내용으로 */}
            </main>

                </div>
                <Footer />
        </div>
    );
}

export default BookDetail;