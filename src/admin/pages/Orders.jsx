import { useState, useEffect, useMemo, useCallback } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import Pagination from "../../components/common/Pagination";
import StatusCell from "../components/StatusCell";
import OrdersTable from "../components/OrdersTable";
import OrderDetailModal from "../components/OrderDetailModal";
import { alertComfirm, alertSuccess } from "../../utils/alert";
import { formatDateShort } from "../../utils/dateFormat";
import { getOrders } from "../../api/admin";
import Loading from "../../components/common/Loading";
import useTitle from "../../hooks/useTitle";

function Orders() {
  useTitle("주문관리");
  const [orders, setOrders] = useState([]); // 주문 목록
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const [selectedOrder, setSelectedOrder] = useState(null); // 상세보기 대상 주문
  const [isDetailOpen, setIsDetailOpen] = useState(false); // 상세 모달 열림 여부
  const [totalOrders, setTotalOrders] = useState(0); // 총 주문 건수
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await getOrders({ page: currentPage, size: 10 });

        setOrders(res.results);
        setTotalPages(Math.ceil(res.count / 10)); // count 기반 페이지 수 계산
        setTotalOrders(res.count);
      } catch (e) {
        console.error("주문 목록 불러오기 실패 : ", e);
        setError("주문 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [currentPage]);

  // 주문 상세 모달 열기
  const openDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  // 주문 삭제
  const handleDelete = useCallback(async (orderNumber) => {
    // 삭제 확인
    const confirm = await alertComfirm("주문 삭제", "정말 삭제하시겠습니까?");
    if (!confirm.isConfirmed) return;

    // 상태에서 삭제
    setOrders((prev) => prev.filter((o) => o.order_number !== orderNumber));
    setIsDetailOpen(false);

    // 성공 알림
    await alertSuccess("삭제 성공", "주문이 삭제되었습니다");
  }, []);

  // 주문 업데이트 (상세 모달에서 수정 시 호출됨)
  const handleUpdate = useCallback((updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    setSelectedOrder(updatedOrder);
  }, []);

  // 테이블 컬럼 정의
  const columns = useMemo(
    () => [
      { header: "주문번호", accessorKey: "order_number" },
      { header: "회원 ID", accessorKey: "user" }, // user_id → user
      {
        header: "주문상품",
        accessorFn: (row) => row.items, // items 전체 전달
        cell: (info) => {
          const items = info.getValue();
          if (!items || items.length === 0) return "-";

          const firstItem = items[0];
          const extra = items.length > 1 ? ` 외 ${items.length - 1}개` : "";

          return (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img
                src={firstItem.product.image_url || "/no-image.jpg"}
                alt={firstItem.product.name}
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
                onError={(e) => {
                  e.currentTarget.src = "/no-image.jpg";
                }}
              />
              <span>{`${firstItem.product.name}${extra}`}</span>
            </div>
          );
        },
      },
      {
        header: "총 수량",
        accessorFn: (row) =>
          row.items.reduce((acc, item) => acc + item.quantity, 0),
      },
      {
        header: "결제금액",
        accessorKey: "total_price",
        cell: (info) => `${Number(info.getValue()).toLocaleString()}원`,
      },
      {
        header: "상태",
        accessorKey: "status",
        cell: ({ row, getValue }) => (
          <StatusCell
            value={getValue()}
            orderId={row.original.id}
            orderData={row.original}
            onChangeStatus={(updatedOrder) => {
              handleUpdate(updatedOrder); // 부모의 handleUpdate 실행
            }}
          />
        ),
      },
      {
        header: "수령인",
        accessorKey: "recipient_name",
      },
      {
        header: "수령인 연락처",
        accessorKey: "recipient_phone",
      },
      {
        header: "배송지",
        accessorKey: "recipient_address",
      },
      {
        header: "결제일자",
        accessorKey: "created_at",
        cell: (info) => formatDateShort(info.getValue()),
      },
    ],
    [handleUpdate]
  );

  // 테이블 생성
  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="orders-page">
      <h2 className="orders-page-title">주문관리</h2>
      <span className="orders-total">
        Total : {totalOrders.toLocaleString()}건
      </span>

      {isLoading && <Loading loadingText="주문 목록 불러오는 중" />}
      {error && <p className="error">{error}</p>}

      {!isLoading && !error && (
        <>
          {/* 주문 테이블 */}
          <OrdersTable table={table} onRowClick={openDetail} />

          {/* 페이지네이션 */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* 상세 모달 */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default Orders;
