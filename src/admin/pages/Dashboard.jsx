import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Loading from "../../components/common/Loading";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // 더미데이터
        const dummyData = {
          total_users: 42,
          total_revenue: "12500000.00",
          total_stock: 320,
          today_orders: 5,
          daily_sales: { quantity: 30, revenue: "150000.00" },
          weekly_sales: { quantity: 210, revenue: "1050000.00" },
          monthly_sales: { quantity: 1050, revenue: "5250000.00" },
          trend: [
            { date: "2025-09-01", quantity: 12, revenue: "65000.00" },
            { date: "2025-09-02", quantity: 20, revenue: "98000.00" },
            { date: "2025-09-03", quantity: 15, revenue: "72000.00" },
            { date: "2025-09-04", quantity: 25, revenue: "120000.00" },
            { date: "2025-09-05", quantity: 30, revenue: "150000.00" },
            { date: "2025-09-06", quantity: 28, revenue: "142000.00" },
            { date: "2025-09-07", quantity: 35, revenue: "175000.00" },
          ],
        };

        // 0.5초 로딩 딜레이 주고 데이터 설정
        setTimeout(() => setStats(dummyData), 500);
      } catch (error) {
        console.error("대시보드 데이터 로딩 실패", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return <Loading loadingText={"데이터를 불러오는중"} />;
  if (!stats) return <div>데이터를 불러올 수 없습니다.</div>;

  return (
    <div className="dashboard-page">
      <h2 className="dashboard-title">대시보드</h2>

      {/* 통계 카드 */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-header">회원 수</p>
          <p className="stat-info">{stats.total_users}</p>
        </div>

        <div className="stat-card">
          <p className="stat-header">총 매출</p>
          <p className="stat-info">
            ₩ {Number(stats.total_revenue).toLocaleString()}
          </p>
        </div>

        <div className="stat-card">
          <p className="stat-header">재고 상태</p>
          <p className="stat-info">{stats.total_stock}</p>
        </div>

        <div className="stat-card">
          <p className="stat-header">오늘 주문 수</p>
          <p className="stat-info">{stats.today_orders}</p>
        </div>
      </div>

      {/* 판매 통계 */}
      <div className="stats-grid">
        <div className="stat-card sales-card">
          <p className="stat-header">판매</p>
          <div className="sales-item">
            <span>오늘</span>
            <span>
              <span className="sales-qty">{stats.daily_sales.quantity}건</span>
              <span className="sales-revenue">
                ₩ {Number(stats.daily_sales.revenue).toLocaleString()}
              </span>
            </span>
          </div>
          <div className="sales-item">
            <span>이번주</span>
            <span>
              <span className="sales-qty">{stats.weekly_sales.quantity}건</span>
              <span className="sales-revenue">
                ₩ {Number(stats.weekly_sales.revenue).toLocaleString()}
              </span>
            </span>
          </div>
          <div className="sales-item">
            <span>이번달</span>
            <span>
              <span className="sales-qty">{stats.monthly_sales.quantity}건</span>
              <span className="sales-revenue">
                ₩ {Number(stats.monthly_sales.revenue).toLocaleString()}
              </span>
            </span>
          </div>
        </div>

        {/* 판매 추이 그래프 */}
        <div className="stat-card">
          <p className="stat-header">판매 추이</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => date.slice(5)} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
