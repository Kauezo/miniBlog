import { Link } from "react-router-dom";
import { FaHome, FaUser, FaSignOutAlt, FaPlusSquare } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          FotoPage
        </Link>

        {user ? (
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <FaHome /> <span className="nav-text">Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/create" className="nav-link">
                <FaPlusSquare /> <span className="nav-text">Post</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to={`/profile/${user.uid}`} className="nav-link">
                <FaUser /> <span className="nav-text">Profile</span>
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link logout-btn" onClick={logout}>
                <FaSignOutAlt /> <span className="nav-text">Logout</span>
              </button>
            </li>
          </ul>
        ) : (
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
