// 전화번호 포맷 함수
const phoneFormat = (value) => {
  if (!value) return "";

  const onlyNumbers = value.replace(/\D/g, "");

  // 02 지역번호
  if (onlyNumbers.startsWith("02")) {
    return onlyNumbers
      .replace(/(\d{2})(\d{0,4})(\d{0,4})/, (_, p1, p2, p3) =>
        [p1, p2, p3].filter(Boolean).join("-")
      )
      .slice(0, 13); // 최대 길이 제한
  }

  // 그 외 3자리 국번 (휴대폰, 031 같은 지역번호)
  return onlyNumbers
    .replace(/(\d{3})(\d{0,4})(\d{0,4})/, (_, p1, p2, p3) =>
      [p1, p2, p3].filter(Boolean).join("-")
    )
    .slice(0, 13); // 최대 길이 제한
};

export default phoneFormat;
