import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from '@/config/api'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email || !form.password) {
      alert('Email and password are required')
      return
    }

    try {
      setSubmitting(true)

      const response = await axios.post('/login', form)
      const { token } = response.data

      if (token) {
        login(token)
        navigate('/')
      }
    } catch (err) {
      console.error('Login error:', err.response?.data)
      if (err.response?.data?.error?.issues) {
        err.response.data.error.issues.forEach(issue => {
          console.error(`${issue.path.join('.')}: ${issue.message}`)
        })
      }
      alert(
        err.response
          ? err.response.data.message || 'Login failed'
          : err.message,
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <h1>Log In</h1>

      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <Button disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log In'}
        </Button>

        <p className="text-sm">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
        </p>
      </form>
    </>
  )
}
