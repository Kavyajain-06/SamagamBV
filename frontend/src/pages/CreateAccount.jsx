import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './CreateAccount.css'
const API_BASE_URL =
  'https://miniature-pancake-4jv5x97564r9cv4v-5000.app.github.dev/api/auth'


function CreateAccount() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email] = useState(() => sessionStorage.getItem('signupEmail') || '')
  const [password, setPassword] = useState('')
  const [department, setDepartment] = useState('')
  const [loading, setLoading] = useState(false)
  const [year, setYear] = useState('')
  const [honorAccepted, setHonorAccepted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')

  const strength = useMemo(() => {
    if (!password) return { score: 0, label: 'WAITING INPUT' }

    const hasLength = password.length >= 8
    const hasNumberOrSymbol = /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password)

    let score = 0
    if (hasLength) score += 1
    if (hasNumberOrSymbol) score += 1
    if (hasMixedCase || password.length >= 12) score += 1

    if (password.length < 6) return { score: 1, label: 'WEAK // SHORT' }
    if (score === 3) return { score, label: 'CAMPUS-GRADE SECURE' }
    if (score === 2) return { score, label: 'GOOD RESILIENCE' }
    return { score: Math.max(score, 1), label: 'KEEP GOING' }
  }, [password])

  
const handleSubmit = async (event) => {
  event.preventDefault()
  setMessage('')

  if (!email) {
    setMessage(
      'We could not find your verified email. Please start signup again.'
    )
    return
  }

  if (!name.trim()) {
    setMessage('Please enter your name.')
    return
  }

 
  if (password.length < 8) {
    setMessage('Your password must be at least 8 characters long.')
    return
  }

  if (!honorAccepted) {
    setMessage('Please accept the Campus Honor Code to continue.')
    return
  }

  try {
    setLoading(true)

    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.trim(),
        email,
        password,
      }),
    })

    const data = await response.json()

   
if (!response.ok) {
  setMessage(data.message || 'Unable to create your account.')
  return
}

if (!data.profileToken) {
  setMessage('Account created, but profile setup could not start. Please contact support.')
  return
}

sessionStorage.setItem('profileToken', data.profileToken)
sessionStorage.setItem('signupName', name.trim())

navigate('/complete-profile')

  } catch (error) {
    setMessage('Unable to connect to the server. Please try again.')
  } finally {
    setLoading(false)
  }
}


  return (
    <main className="create-account-page">
      <div className="create-account-shell">
        <Link className="samagam-wordmark" to="/" aria-label="Samagam home">
          <span className="samagam-mark" aria-hidden="true">✦</span>
          <span>SamagamBV</span>
        </Link>

        <div className="create-account-grid">
          <section className="account-form-column">
            <header className="account-heading">
              <h1>
                Build your<br />
                <span>campus identity.</span>
              </h1>
              <span className="heading-sticker">find your people ↗</span>
            </header>

            <div className="account-form-card">
              <div className="account-card-ribbon" />

              <div className="signup-progress" aria-label="Signup progress">
                <div className="progress-step complete">
                  <span className="progress-dot">✓</span>
                  <span>Email Verified</span>
                </div>
                <span className="progress-line active" />
                <div className="progress-step current">
                  <span className="progress-dot">2</span>
                  <span>Create Account</span>
                </div>
                <span className="progress-line" />
                <div className="progress-step">
                  <span className="progress-dot">3</span>
                  <span>Complete Profile</span>
                </div>
                <span className="progress-line" />
                <div className="progress-step">
                  <span className="progress-dot">4</span>
                  <span>Get Started</span>
                </div>
              </div>

              <form className="create-account-form" onSubmit={handleSubmit}>
                <div className="account-field">
                  <label htmlFor="account-name">Full legal name</label>
                  <input
                    id="account-name"
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="account-field">
                  <div className="field-label-row">
                    <label htmlFor="account-email">Student email address</label>
                    <span className="domain-lock">✦ Institutional Domain Lock</span>
                  </div>
                  <input
                    id="account-email"
                    type="email"
                    placeholder="yourid@banasthali.in"
                    value={email}
                    readOnly
                    aria-describedby="verified-email-note"
                  />
                  <span id="verified-email-note" className="verified-note">
                    {email ? '✓ Email verified' : 'Your verified email will appear here.'}
                  </span>
                </div>

                <div className="account-field password-field">
                  <label htmlFor="account-password">Enter password</label>
                  <div className="password-input-wrap">
                    <input
                      id="account-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                    <button
                      className="password-toggle"
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  <div className="password-meter" aria-live="polite">
                    <div className="meter-heading">
                      <span>Password strength</span>
                      <strong className={`strength-label strength-${strength.score}`}>
                        {strength.label}
                      </strong>
                    </div>
                    <div className="meter-bars" aria-label={`Password strength ${strength.score} of 3`}>
                      {[1, 2, 3].map((bar) => (
                        <span key={bar} className={bar <= strength.score ? `meter-fill meter-fill-${strength.score}` : ''} />
                      ))}
                    </div>
                    <div className="password-rules">
                      <span className={password.length >= 8 ? 'rule-met' : ''}>
                        <i>{password.length >= 8 ? '✓' : '○'}</i> At least 8 characters
                      </span>
                      <span className={/[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) ? 'rule-met' : ''}>
                        <i>{/[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) ? '✓' : '○'}</i> Includes a number or symbol
                      </span>
                    </div>
                  </div>
                </div>

           

                <label className="honor-agreement">
                  <input
                    type="checkbox"
                    checked={honorAccepted}
                    onChange={(event) => setHonorAccepted(event.target.checked)}
                  />
                  <span>
                    I agree to the <strong>Campus Honor Code</strong> and verify that all credentials
                    represent my active university registry.
                  </span>
                </label>

                {message && <p className="account-message" role="alert">{message}</p>}

                <button
                  className="create-account-submit"
                  type="submit"
                  disabled={loading}
                >
                  <span>
                    {loading ? 'Creating Account...' : 'Create Campus Account'}
                  </span>
                  <span aria-hidden="true">→</span>
                </button>

                <p className="account-signin">
                  Already part of the network? <Link to="/login">Sign in →</Link>
                </p>
              </form>
            </div>
          </section>

          <aside className="campus-showcase" aria-label="Samagam features">
            <article className="showcase-card pass-card">
              <div className="showcase-copy">
                <span className="showcase-tag blue-tag">Campus access</span>
                <h2>Your Student Pass</h2>
                <p>Get verified, stay connected, access campus features and more.</p>
              </div>
              <div className="student-pass-illustration" aria-hidden="true">
                <div className="pass-topline" />
                <div className="pass-avatar">●</div>
                <div className="pass-lines"><i /><i /><i /></div>
                <div className="pass-qr">▦</div>
              </div>
            </article>

            <article className="showcase-card people-card">
              <div className="showcase-copy">
                <span className="showcase-tag green-tag">Match &amp; connect</span>
                <h2>Find Your People</h2>
                <p>Discover students with similar interests, skills and goals.</p>
              </div>
              <div className="people-illustration" aria-hidden="true">
                <span className="person person-blue"><i /></span>
                <span className="person person-green"><i /></span>
                <b>✦</b>
              </div>
            </article>

            <article className="showcase-card lifestyle-card">
              <div className="showcase-copy">
                <span className="showcase-tag purple-tag">Campus lifestyle</span>
                <h2>Explore &amp; Grow</h2>
                <p>Join events, communities, learn new skills and make the most of your campus life.</p>
              </div>
              <div className="calendar-illustration" aria-hidden="true">
                <div className="calendar-rings"><i /><i /></div>
                <div className="calendar-page">★</div>
              </div>
            </article>

            <div className="campus-stickers" aria-hidden="true">
              <span className="sticker-star">✳</span>
              <span className="sticker-oval sticker-learn">LEARN</span>
              <span className="sticker-spark">✦</span>
              <span className="sticker-oval sticker-connect">CONNECT</span>
              <span className="sticker-burst">✹</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default CreateAccount
