import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../context/AuthContext'
//import './Login.css'

const Login = () => {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('https://chatify-api.up.railway.app/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        // Fångar specifikt "Invalid credentials"
        setError(data.message || 'Fel användarnamn eller lösenord')
        return
      }

      // Decode JWT
      const decoded = jwtDecode(data.token)

      const userData = {
        id: decoded.id,
        username: decoded.username,
        avatar: decoded.avatar || 'https://i.pravatar.cc/200',
        token: data.token
      }

      // Spara user till localStorage
      localStorage.setItem('user', JSON.stringify(userData))

      // Uppdatera context
      setUser(userData)

      // Redirect
      navigate('/chat', { replace: true })
    } catch (err) {
      setError('Något gick fel. Kontrollera din uppkoppling.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h2>Logga in</h2>

      {error && <p className="error">⚠️ {error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          id="username"
          name="username"
          placeholder="Användarnamn"
          required
          onChange={handleChange}
          value={formData.username}
          autoComplete="username"
        />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Lösenord"
          required
          onChange={handleChange}
          value={formData.password}
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loggar in...' : 'Logga in'}
        </button>
      </form>

      <div className="auth-footer">
        Har du inget konto? <Link to="/register">Registrera dig här</Link>
      </div>
    </div>
  )
}

export default Login
