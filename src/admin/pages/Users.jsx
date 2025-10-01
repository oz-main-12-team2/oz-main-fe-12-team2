import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import Pagination from "../../components/common/Pagination";
import { deleteUser, getAdminUsers, toggleUserActive } from "../../api/admin";
import Loading from "../../components/common/Loading";
import UserModal from "../components/UserModal";
import { alertComfirm, alertSuccess } from "../../utils/alert";
import { formatDateShort } from "../../utils/dateFormat";
import useTitle from "../../hooks/useTitle";

function Users() {
  useTitle("회원관리");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // 전체 회원수 상태
  const [isLoading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [isModalOpen, setIsModalOpen] = useState(false); //모달오픈 여부 상태
  const [selectedUser, setSelectedUser] = useState(null); //선택한 유저정보를 저장하는 상태
  const pageSize = 10;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getAdminUsers(currentPage, pageSize);

        setUsers(res.results || []);
        setTotalItems(res.count || 0);

        // 페이지 개수 계산
        setTotalPages(Math.ceil((res.count || 1) / pageSize));
      } catch (e) {
        console.error("유저 불러오기 실패 : ", e);
        setError(e.message || "유저 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentPage]);

  // 회원 상세 보기 모달 열기
  const openUserModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // is_active 토글
  const handleToggleActive = async () => {
    const confirm = await alertComfirm(
      "회원 상태 변경",
      selectedUser.is_active
        ? "이 회원을 비활성화할까요?"
        : "이 회원을 활성화할까요?"
    );
    if (!confirm.isConfirmed) return;

    try {
      const toggleUpdate = await toggleUserActive(
        selectedUser.id,
        !selectedUser.is_active
      );
      setSelectedUser(toggleUpdate);
      setUsers((prev) =>
        prev.map((u) => (u.id === toggleUpdate.id ? toggleUpdate : u))
      );
      await alertSuccess(
        "회원 상태 변경",
        `'${toggleUpdate.name}' 회원 상태가 변경되었습니다.`
      );
    } catch (e) {
      console.error(e);
    }
  };

  // 회원 삭제
  const handleDelete = async () => {
    const confirm = await alertComfirm(
      "회원 탈퇴",
      "정말로 이 회원을 탈퇴시키겠습니까?"
    );
    if (!confirm.isConfirmed) return;

    try {
      await deleteUser(selectedUser.id);

      await alertSuccess(
        "회원 탈퇴",
        `'${selectedUser.name}' 회원이 삭제되었습니다.`
      );

      // 목록에서 삭제된 유저 제거
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));

      // 모달 닫기
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (e) {
      console.error("회원 삭제 실패:", e);
    }
  };

  const columns = useMemo(
    () => [
      { header: "ID", accessorKey: "id" },
      { header: "이메일", accessorKey: "email" },
      { header: "이름", accessorKey: "name" },
      { header: "주소", accessorKey: "address" },
      {
        header: "소셜로그인",
        accessorKey: "is_social",
        cell: (info) => (info.getValue() ? "Y" : "N"),
      },
      {
        header: "관리자",
        accessorKey: "is_admin",
        cell: (info) => (info.getValue() ? "Y" : "N"),
      },
      {
        header: "가입일자",
        accessorKey: "created_at",
        cell: (info) => formatDateShort(info.getValue()),
      },
      {
        header: "수정일",
        accessorKey: "updated_at",
        cell: (info) => formatDateShort(info.getValue()),
      },
      {
        header: "활성화",
        accessorKey: "is_active",
        cell: (info) => (info.getValue() ? "활성" : "비활성"),
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
        <span className="users-total">
          Total : {totalItems.toLocaleString()}명
        </span>
      </div>

      {isLoading && <Loading loadingText={"회원목록 불러오는중"} />}
      {error && <p className="error">{error}</p>}

      {!isLoading && !error && (
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} onClick={() => openUserModal(row.original)}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length}>회원이 없습니다</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 회원 상세 모달 */}
      {selectedUser && (
        <UserModal
          isOpen={isModalOpen}
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onToggleActive={handleToggleActive}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Users;
