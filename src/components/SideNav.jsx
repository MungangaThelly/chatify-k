import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaComments } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './SideNav.css';

const SideNav = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
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
        <Link to="/chat">
          <FaComments className="icon" />
          Chat
        </Link>

        <Link to="/profile">
          <FaUser className="icon" />
          Profil
        </Link>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="icon" />
          Logga ut
        </button>
      </div>
    </nav>
  );
};

export default SideNav;
