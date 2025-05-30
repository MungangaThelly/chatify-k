import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const ProfileDropdown = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="profile-dropdown" ref={ref}>
      <button className="profile-button" onClick={() => setOpen(!open)}>
        <img
          src={user.avatar || 'https://i.pravatar.cc/40'}
          alt={user.username}
          className="profile-avatar"
        />
        <span>{user.username}</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="dropdown-menu">
          <button onClick={handleLogout} className="dropdown-item">
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
