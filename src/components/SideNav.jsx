import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaComments, FaInbox } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { getConversations } from '../api';
import './SideNav.css';

const SideNav = ({ activeItem }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const res = await getConversations();
        setConversations(res.data);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    };

    fetchConvos();
  }, []);

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
          <span>Profile</span>
        </Link>

        <Link to="/chat" className={`nav-link ${activeItem === 'chat' ? 'active' : ''}`}>
          <FaComments className="icon" />
          <span>Chat</span>
        </Link>

        <Link to="/conversations" className={`nav-link ${activeItem === 'conversations' ? 'active' : ''}`}>
          <FaInbox className="icon" />
          <span>Conversations</span>
        </Link>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="icon" />
          <span>Logout</span>
        </button>
      </div>
        
      {conversations.length > 0 && (
        <div className="sidenav-conversations">
          <h4>Your Conversations</h4>
          <ul className="conversation-list">
            {conversations.map((c) => (
              <li key={c.id}>
                <Link to={`/chat/${c.id}`}>
                  {c.title || `Conversation ${c.id}`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default SideNav;
