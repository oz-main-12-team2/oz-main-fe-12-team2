import { useState, useEffect, useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import Pagination from "../../components/common/Pagination";
import StatusCell from "../components/StatusCell";
import OrdersTable from "../components/OrdersTable";
import OrderDetailModal from "../components/OrderDetailModal";
import { alertComfirm, alertSuccess } from "../../utils/alert";

function Orders() {
  const [orders, setOrders] = useState([]); // 주문 목록
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const [selectedOrder, setSelectedOrder] = useState(null); // 상세보기 대상 주문
  const [isDetailOpen, setIsDetailOpen] = useState(false); // 상세 모달 열림 여부
  const [totalOrders, setTotalOrders] = useState(0); // 총 주문 건수

  // 더미 데이터
  useEffect(() => {
    const res = {
      success: true,
      data: {
        orders: Array.from({ length: 20 }, (_, i) => {
          const items = [
            {
              product_id: 1,
              name: `주문 상품 ${i + 1}`,
              quantity: 2,
              unit_price: 45000,
              total_price: 90000,
            },
            {
              product_id: 2,
              name: `주문 상품 ${i + 1}`,
              quantity: 1,
              unit_price: 30000,
              total_price: 30000,
            },
          ];
          return {
            id: 101 + i,
            order_number: 123456789 + i,
            user_id: `유저${1 + i}`,
            name: "이름",
            total_price: items.reduce((acc, cur) => acc + cur.total_price, 0),
            status: ["결제완료", "배송중", "배송완료"][i % 3],
            created_at: new Date(Date.now() - i * 86400000).toISOString(),
            recipient_name: "유저1",
            recipient_phone: "010-1111-2222",
            recipient_address: "서울시 강남구 123",
            payment: {
              method: "카드",
              status: "성공",
              created_at: new Date(Date.now() - i * 3600000).toISOString(),
            },
            items,
          };
        }),
        pagination: {
          page: currentPage,
          size: 10,
          total_pages: 10,
          total_items: 100,
        },
      },
      message: "주문 목록 조회 성공",
    };

    // 상태에 데이터 세팅
    setOrders(res.data.orders);
    setTotalPages(res.data.pagination.total_pages);
    setTotalOrders(res.data.pagination.total_items);
  }, [currentPage]);

  // 주문 상세 모달 열기
  const openDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  // 주문 삭제
  const handleDelete = async (orderNumber) => {
    // 삭제 확인
    const res = await alertComfirm("주문 삭제", "정말 삭제하시겠습니까?");
    if (!res.isConfirmed) return;

    // 상태에서 삭제
    setOrders((prev) => prev.filter((o) => o.order_number !== orderNumber));
    setIsDetailOpen(false);

    // 성공 알림
    await alertSuccess("삭제 성공", "주문이 삭제되었습니다");
  };

  // 테이블 컬럼 정의
  const columns = useMemo(
    () => [
      { header: "주문번호", accessorKey: "order_number" },
      { header: "회원 ID", accessorKey: "user_id" },
      {
        header: "상품명",
        accessorFn: (row) => {
          const firstItem = row.items[0];
          if (!firstItem) return "-";
          const extra = row.items.length > 1 ? ` 외 ${row.items.length - 1}개` : "";
          return `${firstItem.name}${extra}`;
        },
      },
      {
        header: "총 수량",
        accessorFn: (row) => row.items.reduce((acc, item) => acc + item.quantity, 0),
      },
      {
        header: "총 금액",
        accessorKey: "total_price",
        cell: (info) => `${info.getValue().toLocaleString()}원`,
      },
      {
        header: "상태",
        accessorKey: "status",
        cell: ({ row, getValue }) => (
          <StatusCell
            value={getValue()}
            orderNumber={row.original.order_number}
            onChangeStatus={(orderNumber, newStatus) => {
              // 상태 업데이트
              setOrders((prev) =>
                prev.map((order) =>
                  order.order_number === orderNumber ? { ...order, status: newStatus } : order
                )
              );
            }}
          />
        ),
      },
      {
        header: "결제일자",
        accessorKey: "created_at",
        cell: (info) => {
          const date = new Date(info.getValue());
          const year = String(date.getFullYear()).slice(2);
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        },
      },
    ],
    []
  );

  // 테이블 생성
  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="orders-page">
      {/* 페이지 타이틀 */}
      <h2 className="orders-page-title">주문관리</h2>
      <span className="orders-total">Total : {totalOrders.toLocaleString()}건</span>

      {/* 주문 테이블 */}
      <OrdersTable table={table} onRowClick={openDetail} />

      {/* 페이지네이션 */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* 상세 모달 */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Orders;