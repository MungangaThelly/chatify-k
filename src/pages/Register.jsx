import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: 'https://i.pravatar.cc/200',
    csrfToken: ""

  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    const res = await register(formData)
    if (res.success) {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } else {
      setError(res.error)
    }
  }

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Registration successful! Redirecting...</p>}

      <form onSubmit={handleSubmit}>
        <input id="username" name="username" placeholder="Username" required onChange={handleChange} value={formData.username} autoComplete="new-username"/>
        <input id="email" name="email" type="email" placeholder="Email" required onChange={handleChange} value={formData.email} autoComplete="new-emai"/>
        <input id="password" name="password" type="password" placeholder="Password" required onChange={handleChange} value={formData.password} autoComplete="new-password" />
        <button type="submit">Register</button>
      </form>
      <div className="auth-footer">
        Har du redan ett konto? <Link to="/login">Logga in här</Link>
      </div>
    </div>
  )
}

export default Register
