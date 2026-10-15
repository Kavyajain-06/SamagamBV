import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Signup.css'

const API_BASE_URL = 'https://miniature-pancake-4jv5x97564r9cv4v-5000.app.github.dev/api/auth'

function Signup() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRequestOTP = async (e) => {
    e.preventDefault()
    setMessage('')

    const normalizedEmail = email.trim().toLowerCase()

    if (!/^[^\s@]+@banasthali\.in$/i.test(normalizedEmail)) {
      setMessage('Please use your Banasthali email address.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${API_BASE_URL}/signup/request-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: normalizedEmail }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Unable to send OTP.')
        return
      }

      sessionStorage.setItem('signupEmail', normalizedEmail)
      navigate('/verify-otp')
    } catch (error) {
      setMessage(
        'Could not connect to the server. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="signup-page">
      <section className="signup-card">
        <p className="signup-brand">SAMAGAM BV</p>

        <h1>Your campus era starts here.</h1>

        <p className="signup-description">
          Create your account using your Banasthali college email.
          We will send you a verification code.
        </p>

        <form onSubmit={handleRequestOTP}>
          <label htmlFor="signup-email">College email</label>

          <input
            id="signup-email"
            type="email"
            placeholder="you@banasthali.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          {message && (
            <p className="signup-message" role="alert">
              {message}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <p className="signup-footer">
          Already have an account?{' '}
          <a href="/login">Log in</a>
        </p>
      </section>
    </main>
  )
}

export default Signup