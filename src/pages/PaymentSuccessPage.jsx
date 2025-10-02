import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import "../styles/paymentsuccess.scss";

const KRW = (n) => Number(n || 0).toLocaleString("ko-KR");

export default function PaymentSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  // state 우선 → 없으면 sessionStorage에서 백업 읽기
  useEffect(() => {
    if (state && typeof state === "object") {
      setData(state);
      return;
    }
    const raw = sessionStorage.getItem("last_payment_success");
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch {
        setData(null);
      }
    }
  }, [state]);

  const subtotal = useMemo(() => {
    if (!data?.items) return 0;
    return data.items.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
  }, [data]);
}