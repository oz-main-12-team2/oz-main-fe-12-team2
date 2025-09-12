import { Link } from "react-router-dom";
import "../../styles/navbar.scss";

function NavBar() {
  return (
    <div className="navbar">
      <div className="navbar-list">
        <div className="navbar-item"><Link to="/best" className="navbar-link">BEST</Link></div>
        <div className="navbar-item"><Link to="/best" className="navbar-link">NEW</Link></div>
        <div className="navbar-item"><Link to="/best" className="navbar-link">소설</Link></div>
        <div className="navbar-item"><Link to="/best" className="navbar-link">종교</Link></div>
        <div className="navbar-item"><Link to="/best" className="navbar-link">IT</Link></div>
        <div className="navbar-item"><Link to="/best" className="navbar-link">인문</Link></div>
        <div className="navbar-item"><Link to="/best" className="navbar-link">건강</Link></div>
        <div className="navbar-item"><Link to="/best" className="navbar-link">요리</Link></div>
        <div className="navbar-item"><Link to="/best" className="navbar-link">가정/육아</Link></div>
        <div className="navbar-item"><Link to="/best" className="navbar-link">기술/공학</Link></div>
        <div className="navbar-item"><Link to="/best" className="navbar-link">카테고리별</Link></div>
      </div>
    </div>
  );
}

export default NavBar;