import { useState, useEffect, useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { alertComfirm, alertSuccess } from "../../utils/alert";
import StatusCell from "../components/StatusCell";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);

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

    setOrders(res.data.orders);
    setTotalPages(res.data.pagination.total_pages);
    setTotalOrders(res.data.pagination.total_items);
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
        cell: ({ row, getValue }) => (
          <StatusCell
            value={getValue()}
            orderNumber={row.original.order_number}
            onChangeStatus={(orderNumber, newStatus) => {
              setOrders((prev) =>
                prev.map((order) =>
                  order.order_number === orderNumber
                    ? { ...order, status: newStatus }
                    : order
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

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="orders-page">
      <h2 className="orders-page-title">주문 관리</h2>
      <span className="orders-total">
        Total : {totalOrders.toLocaleString()}건
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
              <span>주문번호</span> {selectedOrder.order_number}
            </p>
            <p>
              <span>회원 ID</span> {selectedOrder.user_id}
            </p>
            <p>
              <span>총 금액</span> {selectedOrder.total_price.toLocaleString()}원
            </p>
            <p>
              <span>상태</span> {selectedOrder.status}
            </p>
            <p>
              <span>주문일</span>{" "}
              {new Date(selectedOrder.created_at).toLocaleString()}
            </p>
          </div>

          {/* 받는 유저정보 */}
          {selectedOrder.recipient_name && (
            <div className="recipient-info">
              <h4>주문 회원</h4>
              <p>
                <span>이름</span> {selectedOrder.recipient_name}
              </p>
              <p>
                <span>전화번호</span> {selectedOrder.recipient_phone}
              </p>
              <p>
                <span>주소</span> {selectedOrder.recipient_address}
              </p>
            </div>
          )}

          {/* 결제 정보 */}
          {selectedOrder.payment && (
            <div className="payment-info">
              <h4>결제 정보</h4>
              <p>
                <span>결제수단</span> {selectedOrder.payment.method}
              </p>
              <p>
                <span>결제상태</span> {selectedOrder.payment.status}
              </p>
              <p>
                <span>결제일자</span>{" "}
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
                <th>총 금액</th>
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
