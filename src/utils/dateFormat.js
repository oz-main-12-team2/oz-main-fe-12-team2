// yy-mm-dd 형식으로 변환
export function formatDateShort(dateString) {
  if (!dateString) return;

  const date = new Date(dateString);
  if (isNaN(date)) return "-";

  const year = String(date.getFullYear()).slice(2); // 25
  const month = String(date.getMonth() + 1).padStart(2, "0"); //09
  const day = String(date.getDate()).padStart(2, "0"); // 20

  return `${year}-${month}-${day}`;
}