import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaComments } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './SideNav.css';

const SideNav = ({ activeItem }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  return (
    <nav className="sidenav">
      <div className="sidenav-user">
        {user.avatar && <img src={user.avatar} alt="Avatar" className="avatar" />}
        <p>{user.username}</p>
      </div>

      <div className="sidenav-links">
        <Link to="/profile" className={`nav-link ${activeItem === 'profile' ? 'active' : ''}`}>
          <FaUser className="icon" />
          Profile
        </Link>

        <Link to="/chat" className={`nav-link ${activeItem === 'chat' ? 'active' : ''}`}>
          <FaComments className="icon" />
          Chat
        </Link>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="icon" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default SideNav;