import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

const API_BASE_URL = 
  'https://miniature-pancake-4jv5x97564r9cv4v-5000.app.github.dev/api/auth'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail.endsWith('@banasthali.in')) {
      setMessage('Please use your Banasthali college email.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Login failed. Please check your credentials.')
        return
      }

      if (!data.token) {
        setMessage('Login succeeded, but no authentication token was returned.')
        return
      }

      sessionStorage.setItem('authToken', data.token)
      sessionStorage.setItem('userName', data.user?.name || '')
      sessionStorage.setItem('userEmail', data.user?.email || normalizedEmail)

      navigate('/dashboard')
    } catch (error) {
      setMessage('Could not connect to SamagamBV. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-shell">
        <header className="login-ticker">
          <Link to="/" className="login-brand">SamagamBV</Link>
          <span className="login-ticker-label">YOUR CAMPUS. CONNECTED.</span>
        </header>

        <div className="login-layout">
          <section className="login-main">
            <div className="login-heading">
              <p className="login-eyebrow">CAMPUS ACCESS</p>
              <h1>
                Welcome back to your campus{' '}
                <span>connected.</span>
              </h1>
              <p className="login-subtitle">
                Your people, your skills, your campus life — all in one place.
              </p>
            </div>

            <div className="login-card">
              <form onSubmit={handleSubmit}>
                <div className="login-field">
                  <div className="login-label-row">
                    <label htmlFor="campus-email">CAMPUS INSTITUTIONAL EMAIL</label>
                    <span>COLLEGE ID</span>
                  </div>
                  <input
                    id="campus-email"
                    type="email"
                    autoComplete="username"
                    placeholder="student@banasthali.in"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="login-field">
                  <div className="login-label-row">
                    <label htmlFor="campus-password">SECURITY PASSPHRASE</label>
                    <span>PRIVATE</span>
                  </div>

                  <div className="login-password-wrap">
                    <input
                      id="campus-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                    <button
                      className="login-password-toggle"
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                </div>

                {message && (
                  <p className="login-message" role="alert">{message}</p>
                )}

                <button className="login-submit" type="submit" disabled={loading}>
                  <span>
                    {loading ? 'VALIDATING CAMPUS ACCESS...' : 'SIGN IN TO CAMPUS'}
                  </span>
                  <span aria-hidden="true">{loading ? '…' : '↗'}</span>
                </button>
              </form>

              <div className="login-card-footer">
                <span>New to the campus network?</span>
                <Link to="/signup">JOIN SamagamBV ↗</Link>
              </div>
            </div>

            <p className="login-footnote">
              ACCESS FOR VERIFIED BANASTHALI VIDYAPITH EMAILS
            </p>
          </section>

          <aside className="login-aside">
            <div className="login-aside-top">
              <span>THE CAMPUS NETWORK</span>
              <span className="login-live-dot" />
            </div>

            <div className="login-hero-art" aria-label="Samagam campus community illustration">
              <div className="login-art-orbit orbit-one" />
              <div className="login-art-orbit orbit-two" />
              <div className="login-art-center">S.</div>
              <div className="login-art-sticker sticker-top">MEET<br />YOUR PEOPLE</div>
              <div className="login-art-sticker sticker-bottom">SKILLS<br />IN MOTION ↗</div>
              <span className="login-art-star star-one">✳</span>
              <span className="login-art-star star-two">✳</span>
            </div>

            <div className="login-aside-copy">
              <p className="login-eyebrow">MORE THAN A NOTICE BOARD</p>
              <h2>Good things happen when campus connects.</h2>
              <p>Find collaborators. Share what you know. Discover what's happening around you.</p>
            </div>

            <div className="login-aside-footer">
              <span>PEOPLE × SKILLS × OPPORTUNITIES</span>
              <span>BV / 2026</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Login