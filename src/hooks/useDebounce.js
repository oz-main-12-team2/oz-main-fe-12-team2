import { useState, useEffect } from "react";

function useDebounce(val, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(val);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(val);
    }, delay);

    return () => clearTimeout(handler); // 클린업, 값이 변경되기 전에 이전 timeout 제거
  }, [val, delay]);

  return debouncedValue;
}

export default useDebounce;