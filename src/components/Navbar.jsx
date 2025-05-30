// src/components/Navbar.jsx
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Let-Chat</Link>

      {user ? (
        <div className="profile-dropdown">
          <button className="profile-button">
            <img src={user.avatar} alt="avatar" className="profile-avatar" />
            {user.username}
          </button>
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={logout}>Logga ut</button>
          </div>
        </div>
      ) : (
        <Link to="/login">Logga in</Link>
      )}
    </nav>
  )
}

export default Navbar
