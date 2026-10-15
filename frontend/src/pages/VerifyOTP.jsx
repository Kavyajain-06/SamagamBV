import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './VerifyOTP.css'

const API_BASE_URL = 'https://miniature-pancake-4jv5x97564r9cv4v-5000.app.github.dev/api/auth'

function VerifyOTP() {
  const [email, setEmail] = useState(
    sessionStorage.getItem('signupEmail') || ''
  )
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate= useNavigate()

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!email) {
      setMessage('Please enter your email address again.')
      return
    }

    if (!/^\d{6}$/.test(otp)) {
      setMessage('Please enter the complete six-digit OTP.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${API_BASE_URL}/signup/verify-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, otp }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'OTP verification failed.')
        return
      }

      sessionStorage.setItem('signupEmail', email)
      navigate('/create-account')
    } catch (error) {
      setMessage(
        'Unable to connect to the server. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="verify-page">
      <section className="verify-card">
        <h1>Verify your email</h1>

        <p>
          Enter the six-digit code sent to your Banasthali email.
        </p>

        <form onSubmit={handleVerifyOTP}>
          <label htmlFor="verify-email">College email</label>
          <input
            id="verify-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@banasthali.in"
            required
          />

          <label htmlFor="verify-otp">Enter OTP</label>
          <input
            id="verify-otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            placeholder="123456"
            required
          />

          {message && (
            <p role="status" className="verify-message">
              {message}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default VerifyOTP