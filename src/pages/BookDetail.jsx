import { useParams } from "react-router-dom";
import Button from "../components/common/Button";
import "../styles/cdh/book-Detail.scss";
import { alertComfirm, alertSuccess } from "../utils/alert";
function BookDetail() {
  const { id } = useParams();

  const handleCartAdd = async () => {
    // 1. 확인창 (alertComfirm)
    const alert = await alertComfirm("장바구니에 담겠습니까?", "예를 누르면 장바구니에 상품이 담깁니다");
    if (!alert.isConfirmed) return;
    
    console.log("API호출경로: 장바구니 추가");
    // API 호출 성공 시:
    
    // 2. 성공 알림창 (alertSuccess)
    await alertSuccess("장바구니", "선택하신 도서가 장바구니에 담겼습니다.");
  };

  const handlebuyAdd = async () => {
    // 1. 확인창 (alertComfirm)
    const alert = await alertComfirm("상품을 구매하시겠습니까?", "예를 누르면 상품구매를 진행합니다");
    if (!alert.isConfirmed) return;
    
    // 구매 로직 (API 호출 등)
    console.log("구매 API 호출");
    
    // 2. 성공 알림창 (alertSuccess)
    await alertSuccess("구매 완료", "선택하신 도서의 구매가 완료되었습니다.");
  };

  const BookDetailDummy = {
    id,
    title: "도서 제목",
    author: "저자",
    publisher: "출판사",
    price: 15000,
    salePrice: 12000,
    image: "/no-image.jpg",
    description: "책에 대한 설명 글...책에 대한 설명 글...책에 대한 설명 글...책에 대한 설명 글...책에 대한 설명 글...책에 대한 설명 글...책에 대한 설명 글...책에 대한 설명 글...책에 대한 설명 글...책에 대한 설명 글...책에 대한 설명 글...책에 대한 설명 글...책에 대한 설명 글...",
    summary: "이 책은 주인공이 겪는 시련과 성장을 중심으로 전개됩니다. 어릴 적 꿈을 찾아 떠난 긴 여정 속에서 예상치 못한 친구들을 만나고, 그들과 함께 세상을 변화시키는 거대한 임무를 수행하게 됩니다. 독자들에게 깊은 감동과 함께 삶의 의미를 되새기게 하는 역작입니다. 이 줄거리 내용이 버튼 아래에 새로운 공간으로 표시됩니다.이 책은 주인공이 겪는 시련과 성장을 중심으로 전개됩니다. 어릴 적 꿈을 찾아 떠난 긴 여정 속에서 예상치 못한 친구들을 만나고, 그들과 함께 세상을 변화시키는 거대한 임무를 수행하게 됩니다. 독자들에게 깊은 감동과 함께 삶의 의미를 되새기게 하는 역작입니다. 이 줄거리 내용이 버튼 아래에 새로운 공간으로 표시됩니다.이 책은 주인공이 겪는 시련과 성장을 중심으로 전개됩니다. 어릴 적 꿈을 찾아 떠난 긴 여정 속에서 예상치 못한 친구들을 만나고, 그들과 함께 세상을 변화시키는 거대한 임무를 수행하게 됩니다. 독자들에게 깊은 감동과 함께 삶의 의미를 되새기게 하는 역작입니다. 이 줄거리 내용이 버튼 아래에 새로운 공간으로 표시됩니다.이 책은 주인공이 겪는 시련과 성장을 중심으로 전개됩니다. 어릴 적 꿈을 찾아 떠난 긴 여정 속에서 예상치 못한 친구들을 만나고, 그들과 함께 세상을 변화시키는 거대한 임무를 수행하게 됩니다. 독자들에게 깊은 감동과 함께 삶의 의미를 되새기게 하는 역작입니다. 이 줄거리 내용이 버튼 아래에 새로운 공간으로 표시됩니다.",
  };

  return (
    <>
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
              </div>

              <div className="book-detail-bottom">
                
                <section className="book-detail-description">
                  <h2 className="book-introduction">소 개</h2>
                  <p>{BookDetailDummy.description}</p>
                </section>

                <div className="bottom-flex-wrapper">
                  
                  <div className="price-area-wrapper">
                    <section className="book-price">
                      <span className="original-price">
                        가격: {BookDetailDummy.price.toLocaleString()}원
                      </span>
                    </section>
                  </div>
                  
                  <div className="book-actions">
                    <Button onClick={handleCartAdd} size="lg" variant="secondary">장바구니</Button>
                    <Button onClick={handlebuyAdd} size="lg" variant="primary">구매하기</Button>
                  </div>
                  
                </div>
              </div>
            </div>
          </main>
          
          <section className="book-summary-section full-width-section">
            <h2 className="book-summary-title">줄 거 리</h2>
            <p>{BookDetailDummy.summary}</p>
          </section>
        </div>
      </div>
    </>
  );
}

export default BookDetail;