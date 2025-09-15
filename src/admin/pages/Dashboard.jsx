function Dashboard() {
  return (
    <div className="dashboard-page">
      <h2 className="dashboard-title">대시보드</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <p>회원 수</p>
          </div>
          <div className="stat-info">1,250</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <p>총 매출</p>
          </div>
          <div className="stat-info">₩ 12,500,000</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <p>재고상태</p>
          </div>
          <div className="stat-info">320</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <p>주문 수</p>
          </div>
          <div className="stat-info">890</div>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <p>판매</p>
          </div>
          <div className="stat-info">오늘: 30</div>
          <div className="stat-info">이번 주 : 210</div>
          <div className="stat-info">이번 달 : 1,050</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <p>판매 추이</p>
          </div>
          <div className="stat-info">그래프</div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
