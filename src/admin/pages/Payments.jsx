import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { formatDateShort } from "../../utils/dateFormat";
import { getPayments } from "../../api/admin";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import Pagination from "../../components/common/Pagination";
import useTitle from "../../hooks/useTitle";
import Loading from "../../components/common/Loading";
import PaymentDetailModal from "../components/PaymentDetailModal";

function Payments() {
  useTitle("결제관리");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleStatusChange = (status) => {
    setPaymentStatus(status);
  };

  const statusOptions = [
    { key: "all", label: "전체" },
    { key: "대기", label: "대기" },
    { key: "성공", label: "성공" },
    { key: "실패", label: "실패" },
    { key: "취소", label: "취소" },
  ];

  useEffect(() => {
    async function loadPayments() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await getPayments({
          page: currentPage,
          page_size: 10,
          status: paymentStatus,
          created_at_gte: startDate,
          created_at_lte: endDate,
        });

        setPayments(res.results);
        setTotalPages(Math.ceil(res.count / 10));
        setTotalPayments(res.count);
      } catch {
        setError("결제 내역을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPayments();
  }, [currentPage, paymentStatus, startDate, endDate]);

  const handleRowClick = (payment) => {
    setSelectedPayment(payment);
    setIsDetailOpen(true);
  };

  const handleUpdate = (updatedPayment) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === updatedPayment.id ? updatedPayment : p))
    );
  };

  const columns = useMemo(
    () => [
      {
        header: "결제번호",
        accessorKey: "transaction_id",
        cell: (info) => info.getValue() || "-",
      },
      { header: "주문번호", accessorKey: "order_id" },
      {
        header: "회원 ID",
        accessorKey: "user",
        cell: (info) => {
          const user = info.getValue();
          return user.email;
        },
      },
      {
        header: "결제금액",
        accessorKey: "total_price",
        cell: (info) => {
          const value = Number(info.getValue() || 0);
          return `${value.toLocaleString()}원`;
        },
      },
      { header: "결제수단", accessorKey: "method" },
      {
        header: "상태",
        accessorKey: "status",
        cell: (info) => {
          const value = info.getValue();
          return <span className={`status-text ${value}`}>{value}</span>;
        },
      },
      {
        header: "결제일자",
        accessorKey: "created_at",
        cell: (info) => formatDateShort(info.getValue()),
      },
    ],
    []
  );

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="payments-page">
      <h2 className="payments-page-title">결제관리</h2>
      <div className="payments-header">
        <div className="payments-total-wrap">
          <span>Total : {totalPayments.toLocaleString()}건</span>
        </div>
        <div className="payments-action-wrap">
          {/* 상태 토글 */}
          <div className="filter-group">
            <span className="filter-label">결제 상태</span>
            <div className="toggle-wrap">
              {statusOptions.map((option) => (
                <div
                  key={option.key}
                  className={`toggle-button ${
                    paymentStatus === option.key ? "active" : ""
                  }`}
                  onClick={() => handleStatusChange(option.key)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>

          {/* 조회 기간 */}
          <div className="filter-group">
            <span className="filter-label">조회 기간</span>
            <div className="date-range-picker">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="시작일"
                dateFormat="yyyy-MM-dd"
                isClearable
                withPortal
                className="payments-datepicker"
                locale={ko}
              />

              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="종료일"
                dateFormat="yyyy-MM-dd"
                isClearable
                withPortal
                className="payments-datepicker"
                locale={ko}
              />
            </div>
          </div>
        </div>
      </div>

      {isLoading && <Loading loadingText={"결제내역 불러오는중"} size={60} />}
      {error && <p className="error">{error}</p>}

      {!isLoading && !error && (
        <>
          <div className="payments-table-wrap">
            <table className="payments-table">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
      <PaymentDetailModal
        isOpen={isDetailOpen}
        payment={selectedPayment}
        onClose={() => setIsDetailOpen(false)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default Payments;
