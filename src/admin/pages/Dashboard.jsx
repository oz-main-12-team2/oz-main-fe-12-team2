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
import { FaCalendarDay, FaCalendarWeek, FaChartBar } from "react-icons/fa";
import Loading from "../../components/common/Loading";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState("quantity"); // 'quantity' | 'revenue'

  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      try {
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

        setTimeout(() => setStats(dummyData), 500);
      } catch (error) {
        console.error("대시보드 데이터 로딩 실패", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return <Loading loadingText="데이터를 불러오는 중" />;
  if (!stats) return <div>데이터를 불러올 수 없습니다.</div>;

  return (
    <div className="dashboard-page">
      <h2 className="dashboard-title">대시보드</h2>

      {/* 상단 통계 */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <p className="dashboard-card-title">회원 수</p>
          <p className="dashboard-card-value">{stats.total_users}</p>
        </div>
        <div className="dashboard-card">
          <p className="dashboard-card-title">총 매출</p>
          <p className="dashboard-card-value">
            ₩ {Number(stats.total_revenue).toLocaleString()}
          </p>
        </div>
        <div className="dashboard-card">
          <p className="dashboard-card-title">재고 상태</p>
          <p className="dashboard-card-value">{stats.total_stock}</p>
        </div>
        <div className="dashboard-card">
          <p className="dashboard-card-title">오늘 주문 수</p>
          <p className="dashboard-card-value">{stats.today_orders}</p>
        </div>
      </div>

      {/* 하단 - 판매 + 차트 */}
      <div className="dashboard-section">
        {/* 왼쪽 판매 */}
        <div className="dashboard-sales">
          {[
            { icon: FaCalendarDay, title: "Today", data: stats.daily_sales },
            { icon: FaCalendarWeek, title: "Week", data: stats.weekly_sales },
            { icon: FaChartBar, title: "Month", data: stats.monthly_sales },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div className="dashboard-sales-card" key={idx}>
                <Icon className="dashboard-sales-icon" />
                <div>
                  <p className="dashboard-sales-title">{item.title}</p>
                  <p className="dashboard-sales-qty">{item.data.quantity}건</p>
                  <p className="dashboard-sales-revenue">
                    ₩ {Number(item.data.revenue).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 오른쪽 판매 추이 */}
        <div className="dashboard-chart">
          <div className="dashboard-chart-header">
            <span>판매 추이</span>
            <div className="dashboard-chart-toggle">
              <button
                className={chartType === "quantity" ? "active" : ""}
                onClick={() => setChartType("quantity")}
              >
                건수
              </button>
              <button
                className={chartType === "revenue" ? "active" : ""}
                onClick={() => setChartType("revenue")}
              >
                매출
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={chartType}
                stroke={chartType === "quantity" ? "#3b82f6" : "#10b981"}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;