import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/common/Button";
import "../styles/cdh/book-Detail.scss";
import { alertComfirm, alertSuccess, alertError } from "../utils/alert";
import { getProductItem } from "../api/products.js";
import { addCart, getCart } from "../api/cart";
import useCartStore from "../stores/cartStore"; // Zustand Store
import useBuyMove from "../hooks/useBuyMove";

// ⭐️ DEFAULT_IMAGE 상수 정의 (public 폴더의 no-image.jpg를 가리킴)
const DEFAULT_IMAGE = "/no-image.jpg";

const formatPrice = (price) => {
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
        return "가격 미정";
    }
    return numericPrice.toLocaleString("ko-KR", {
        maximumFractionDigits: 0,
    });
};

function BookDetail() {
    const { id } = useParams();

    const [bookDetail, setBookDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 💡 [수정] cartItems (현재 장바구니 목록)와 setCartItems 액션을 모두 가져옵니다.
    const cartItems = useCartStore((state) => state.cartItems);
    const setStoreCartItems = useCartStore((state) => state.setCartItems);
    
    const navigateToCheckout = useBuyMove();

    useEffect(() => {
        if (!id) {
            setError("도서 ID가 유효하지 않습니다.");
            setLoading(false);
            return;
        }

        const loadBookDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await getProductItem(id);
                setBookDetail(res);
            } catch (e) {
                console.error(`도서(ID: ${id}) 정보 불러오기 실패 : `, e);
                setError(
                    e.message || "도서 상세 정보를 불러오는 중 오류가 발생했습니다."
                );
            } finally {
                setLoading(false);
            }
        };

        loadBookDetail();
    }, [id]);

    // 로딩, 에러, 데이터 없음 처리 (기존 코드 유지)
    if (loading)
        return (
            <div className="book-detail-page">
                <div className="base-container">
                    <main className="book-detail-container">
                        <p>도서 정보를 불러오는 중입니다...</p>
                    </main>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="book-detail-page">
                <div className="base-container">
                    <main className="book-detail-container">
                        <p className="error-message">오류 발생: {error}</p>
                    </main>
                </div>
            </div>
        );

    if (!bookDetail)
        return (
            <div className="book-detail-page">
                <div className="base-container">
                    <main className="book-detail-container">
                        <p>요청하신 도서 정보를 찾을 수 없습니다.</p>
                    </main>
                </div>
            </div>
        );

    const book = bookDetail;

    // ... (Description 처리 로직은 그대로 유지) ...
    const descriptionLines = book.description
        ? book.description
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n")
            .replace(/<\/div>/gi, "\n")
            .replace(/\n\s*\n/g, "\n")
            .split("\n")
            .filter((line) => line.trim() !== "")
        : [];

    const PREVIEW_LINE_COUNT = 3;
    const previewLines = descriptionLines.slice(0, PREVIEW_LINE_COUNT);
    const previewDescription = previewLines.join("\n");
    const remainingLines = descriptionLines.slice(PREVIEW_LINE_COUNT);
    const remainingDescription = remainingLines.join("\n");

    let bottomContent = null;

    if (remainingDescription) {
        bottomContent = <p className="description-rest">{remainingDescription}</p>;
    } else {
        const formattedPrice = formatPrice(book.price);
        const fallbackText = `${
            book.name || "이 도서"
        }은 독자 여러분들의 많은 관심과 기대를 바라며 정가: ${formattedPrice}원에 기다리고 있습니다.`;

        bottomContent = (
            <div className="book-metadata-fallback">
                <p className="fallback-message">{fallbackText}</p>
            </div>
        );
    }
    // ... (Description 처리 로직 끝) ...

    // 장바구니 추가 핸들러 (API 호출 및 Zustand 갱신)
    const handleCartAdd = async () => {
        // 💡 1. 장바구니 중복 체크 로직
        const existingItem = cartItems.find(
            // item.book.id와 현재 도서 ID를 비교 (타입이 다를 수 있으므로 toString()으로 비교)
            (item) => item.book.id.toString() === book.id.toString()
        );

        if (existingItem) {
            // 중복일 경우 알림을 띄우고 API 호출을 막습니다.
            await alertError(
                "장바구니 오류",
                `선택하신 도서(${book.name})는 이미 장바구니에 담겨 있습니다.`,
                "확인"
            );
            return; 
        }

        // 2. 장바구니 담기 확인
        const alert = await alertComfirm(
            "장바구니에 담겠습니까?",
            "예를 누르면 장바구니에 상품이 담깁니다"
        );
        if (!alert.isConfirmed) return;

        // 3. API 호출 및 상태 갱신 (중복이 아닐 경우)
        try {
            await addCart({ productId: book.id, quantity: 1 });

            // 장바구니 상태 갱신: 최신 장바구니 목록을 서버에서 다시 가져와 스토어에 반영
            const res = await getCart();
            const items = Array.isArray(res[0]?.items) ? res[0].items : [];

            // API 응답 구조를 스토어 형식에 맞게 매핑
            const mappedItems = items.map((item) => ({
                book: {
                    id: item.product_id,
                    name: item.product_name,
                    category: item.product_category,
                    author: item.product_author,
                    publisher: item.product_publisher,
                    price: Number(item.product_price),
                    stock: item.product_stock,
                    image_url: item.product_image,
                },
                quantity: item.quantity,
            }));

            setStoreCartItems(mappedItems);

            await alertSuccess(
                "장바구니",
                `선택하신 도서(${book.name})가 장바구니에 담겼습니다.`
            );
        } catch (e) {
            console.error("장바구니 추가 실패:", e);
            alertError(
                "장바구니 오류",
                "상품을 장바구니에 추가하는 중 오류가 발생했습니다."
            );
        }
    };

    // 구매하기 핸들러 (useBuyMove 연결)
    const handlebuyAdd = async () => {
        const alert = await alertComfirm(
            "상품을 구매하시겠습니까?",
            "예를 누르면 상품구매를 진행합니다"
        );
        if (!alert.isConfirmed) return;

        const productsToBuy = [
            {
                book: book,
                quantity: 1,
            },
        ];

        console.log(`즉시 구매 이동 호출: 도서 ID ${book.id}`);
        navigateToCheckout(productsToBuy, "direct");
    };

    return (
        <>
            <div className="book-detail-page">
                <div className="base-container">
                    <main className="book-detail-container">
                        <div className="book-detail-image">
                            <img
                                src={book.image || DEFAULT_IMAGE} 
                                alt={book.name}
                                onError={(e) => {
                                    e.currentTarget.src = DEFAULT_IMAGE;
                                }}
                            />
                        </div>

                        <div className="book-detail">
                            <div className="book-detail-up">
                                <h1>{book.name}</h1>
                                <p>
                                    저자: {book.author} | 출판사: {book.publisher}
                                </p>
                            </div>

                            <div className="book-detail-bottom">
                                <section className="book-detail-description">
                                    <h2 className="book-introduction">소 개</h2>
                                    <p className="description-preview">{previewDescription}</p>
                                </section>

                                <div className="bottom-flex-wrapper">
                                    <div className="price-area-wrapper">
                                        <section className="book-price">
                                            <span className="original-price">
                                                가격: {formatPrice(book.price)}원
                                            </span>
                                        </section>
                                    </div>

                                    <div className="book-actions">
                                        <Button
                                            onClick={handleCartAdd}
                                            size="lg"
                                            variant="secondary"
                                        >
                                            장바구니
                                        </Button>
                                        <Button onClick={handlebuyAdd} size="lg" variant="primary">
                                            구매하기
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    {book.description && (
                        <section className="book-summary-section full-width-section">
                            <h2 className="book-summary">상세 정보</h2>
                            {bottomContent}

                            {book.summary && (
                                <p className="summary-original">{book.summary}</p>
                            )}
                        </section>
                    )}
                </div>
            </div>
        </>
    );
}

export default BookDetail;