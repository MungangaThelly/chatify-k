import { useNavigate } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import './SideNav.css'

const SideNav = () => {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth <= 768 && !e.target.closest('.sidenav')) {
        setIsExpanded(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  return (
    <div
      className={`sidenav ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onClick={() => setIsExpanded(true)}
    >
      {/* 👤 User Info */}
      <div className="user-section">
        <img
          src={user.avatar || 'https://i.pravatar.cc/200'}
          alt="User avatar"
          className="user-avatar"
        />
        <span className="user-name">{user.username}</span>
      </div>

      {/* 🚪 Logout */}
      <button
        onClick={handleLogout}
        className="logout-btn"
        aria-label="Logga ut"
      >
        <FaSignOutAlt className="logout-icon" />
        <span className="logout-text">Logga ut</span>
      </button>
    </div>
  )
}

export default SideNav
