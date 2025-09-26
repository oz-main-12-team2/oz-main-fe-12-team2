import { useEffect, useState, useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { FaCalendarDay, FaCalendarWeek, FaChartBar } from "react-icons/fa";
import Loading from "../../components/common/Loading";
import { getDashboardStats } from "../../api/admin";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState("quantity");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (e) {
        console.error("대시보드 데이터 로딩 실패 : ", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const chartData = useMemo(() => {
    if (!stats) return [];
    return [
      {
        id: chartType === "quantity" ? "건수" : "매출",
        color: chartType === "quantity" ? "#3b82f6" : "#10b981",
        data: stats.trend.map((d) => ({
          x: d.date.slice(5),
          y: chartType === "quantity" ? d.quantity : Number(d.revenue),
          date: d.date,
        })),
      },
    ];
  }, [stats, chartType]);

  if (isLoading) return <Loading loadingText="대시보드 불러오는 중" />;
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
          <p className="dashboard-card-value"> {Number(stats.total_stock).toLocaleString()}</p>
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

        {/* 오른쪽 판매 추이 그래프 */}
        <div className="dashboard-chart">
          <div className="dashboard-chart-header">
            <span>월간 판매추이</span>
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

          <div style={{ height: 320 }}>
            <ResponsiveLine
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: "auto", max: "auto" }}
              curve="monotoneX"
              axisBottom={{
                tickRotation: -30,
              }}
              colors={{ datum: "color" }}
              lineWidth={3}
              enablePoints={true}
              pointSize={8}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              enableArea={true}
              areaOpacity={0.1}
              useMesh={true}
              tooltip={({ point }) => (
                <div
                  style={{
                    background: "white",
                    minWidth: "100px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    fontSize: "0.9rem",
                    color: "#0f172a",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                    {point.data.date.slice(5)} {/* 09-22 형태 */}
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "1rem",
                    }}
                  >
                    {chartType === "quantity"
                      ? `${point.data.yFormatted} 건`
                      : `${Number(point.data.y).toLocaleString()}`}
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
