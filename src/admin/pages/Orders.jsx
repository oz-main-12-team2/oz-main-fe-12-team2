import { useState, useEffect, useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { alertComfirm, alertSuccess } from "../../utils/alert";
import Select from "../../components/common/Select";

const STATUS_OPTIONS = [
  { value: "결제완료", label: "결제완료" },
  { value: "배송중", label: "배송중" },
  { value: "배송완료", label: "배송완료" },
];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);

  // 더미 데이터
  useEffect(() => {
    // 실제 API 응답 형식 흉내
    const dummyResponse = {
      success: true,
      data: {
        orders: Array.from({ length: 10 }, (_, i) => {
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
            user_id: 1 + i,
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

    setOrders(dummyResponse.data.orders);
    setTotalPages(dummyResponse.data.pagination.total_pages);
    setTotalOrders(dummyResponse.data.pagination.total_items);
  }, [currentPage]);

  // 상세 보기
  const openDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  // 삭제
  const handleDelete = async (orderNumber) => {
    const res = await alertComfirm("주문 삭제", "정말 삭제하시겠습니까?");
    if (!res.isConfirmed) return;

    setOrders((prev) => prev.filter((o) => o.order_number !== orderNumber));
    setIsDetailOpen(false);
    await alertSuccess("삭제 성공", "주문이 삭제되었습니다");
  };

  const columns = useMemo(
    () => [
      { header: "주문번호", accessorKey: "order_number" },
      { header: "회원 ID", accessorKey: "user_id" },
      {
        header: "상품명",
        accessorFn: (row) => {
          const firstItem = row.items[0];
          if (!firstItem) return "-";
          const extra =
            row.items.length > 1 ? ` 외 ${row.items.length - 1}개` : "";
          return `${firstItem.name}${extra}`;
        },
      },
      {
        header: "총 수량",
        accessorFn: (row) =>
          row.items.reduce((acc, item) => acc + item.quantity, 0),
      },
      {
        header: "총 금액",
        accessorKey: "total_price",
        cell: (info) => `${info.getValue().toLocaleString()}원`,
      },
      {
        header: "상태",
        accessorKey: "status",
        // cell 함수 내부에서 setOrders를 사용하므로 setOrders가 렌더마다 변경되지 않음을 이용
        cell: ({ row, getValue }) => {
          return (
            <Select
              value={getValue()}
              onChange={(e) => {
                const newStatus = e.target.value;
                setOrders((prev) =>
                  prev.map((order) =>
                    order.order_number === row.original.order_number
                      ? { ...order, status: newStatus }
                      : order
                  )
                );
                // api 호출 예정
              }}
            >
              <option value="">선택</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          );
        },
      },
      {
        header: "주문일",
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

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="orders-page">
      <h2 className="orders-page-title">주문 관리</h2>
      <span className="orders-total">
        전체 주문: {totalOrders.toLocaleString()}건
      </span>

      {/* 주문 테이블 */}
      <div className="orders-table-wrap">
        <table className="orders-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>{header.column.columnDef.header}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => openDetail(row.original)}
                className="cursor-pointer hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {cell.column.columnDef.cell
                      ? cell.column.columnDef.cell(cell.getContext())
                      : cell.getValue()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 상세 모달 */}
      {selectedOrder && (
        <Modal
          isOpen={isDetailOpen}
          title="주문 상세"
          onClose={() => setIsDetailOpen(false)}
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setIsDetailOpen(false)}
              >
                닫기
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(selectedOrder.order_number)}
              >
                삭제
              </Button>
            </>
          }
        >
          {/* 주문 기본 정보 */}
          <div className="order-info">
            <p>
              <b>주문번호:</b> {selectedOrder.order_number}
            </p>
            <p>
              <b>회원 ID:</b> {selectedOrder.user_id}
            </p>
            <p>
              <b>총 금액:</b> {selectedOrder.total_price.toLocaleString()}원
            </p>
            <p>
              <b>상태:</b> {selectedOrder.status}
            </p>
            <p>
              <b>주문일:</b>{" "}
              {new Date(selectedOrder.created_at).toLocaleString()}
            </p>
          </div>

          {/* 받는 유저정보 */}
          {selectedOrder.recipient_name && (
            <div className="recipient-info">
              <h4>주문 회원</h4>
              <p>
                <b>이름:</b> {selectedOrder.recipient_name}
              </p>
              <p>
                <b>전화번호:</b> {selectedOrder.recipient_phone}
              </p>
              <p>
                <b>주소:</b> {selectedOrder.recipient_address}
              </p>
            </div>
          )}

          {/* 결제 정보 */}
          {selectedOrder.payment && (
            <div className="payment-info">
              <h4>결제 정보</h4>
              <p>
                <b>결제수단:</b> {selectedOrder.payment.method}
              </p>
              <p>
                <b>결제상태:</b> {selectedOrder.payment.status}
              </p>
              <p>
                <b>결제일:</b>{" "}
                {new Date(selectedOrder.payment.created_at).toLocaleString()}
              </p>
            </div>
          )}

          {/* 주문 상품 목록 */}
          <h4>주문 상품</h4>
          <table className="order-items-table">
            <thead>
              <tr>
                <th>상품명</th>
                <th>수량</th>
                <th>단가</th>
                <th>총금액</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items.map((item) => (
                <tr key={item.product_id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit_price.toLocaleString()}원</td>
                  <td>{item.total_price.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}
    </div>
  );
}

export default Orders;
