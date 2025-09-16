import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import Pagination from "../../components/common/Pagination";

function Users() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // 전체 회원수 상태

  // api 시뮬
  useEffect(() => {
    const res = {
      success: true,
      data: {
        users: Array.from({ length: 10 }, (_, i) => ({
          id: (currentPage - 1) * 10 + i + 1,
          email: `user${i + 1}@test.com`,
          name: `유저 ${i + 1}`,
          is_social: i % 3 === 0,
          created_at: "2025-09-10 11:11:11",
          order_count: Math.floor(Math.random() * 10),
          total_spent: Math.floor(Math.random() * 500000),
        })),
        pagination: {
          page: currentPage,
          size: 10,
          total_pages: 10,
          total_items: 100,
        },
      },
      message: "전체 사용자 목록을 불러왔습니다.",
    };

    setUsers(res.data.users);
    setTotalPages(res.data.pagination.total_pages);
    setTotalItems(res.data.pagination.total_items); // 전체 회원 수 저장
  }, [currentPage]);

  const columns = useMemo(
    () => [
      { header: "ID", accessorKey: "id" },
      { header: "이메일", accessorKey: "email" },
      { header: "이름", accessorKey: "name" },
      {
        header: "소셜가입",
        accessorKey: "is_social",
        cell: (info) => (info.getValue() ? "Y" : "N"),
      },
      {
        header: "가입일",
        accessorKey: "created_at",
        cell: (info) =>
          new Date(info.getValue()).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
      },
      { header: "주문수", accessorKey: "order_count" },
      {
        header: "총 구매금액",
        accessorKey: "total_spent",
        cell: (info) => info.getValue().toLocaleString() + "원",
      },
    ],
    []
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="users-page">
      <div className="users-header">
        <h2 className="users-title">회원관리</h2>
        <span className="users-total">전체 회원: {totalItems.toLocaleString()}명</span>
      </div>

      <div className="users-table-wrap">
        <table className="users-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
    </div>
  );
}

export default Users;