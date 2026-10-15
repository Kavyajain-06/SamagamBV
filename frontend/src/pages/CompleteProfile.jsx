
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './CreateAccount.css'

const API_BASE_URL =
  'https://miniature-pancake-4jv5x97564r9cv4v-5000.app.github.dev/api/auth'

const DEPARTMENTS = ['CSE', 'ECE', 'EE', 'ME', 'CE', 'IT', 'Other']
const YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4+']

function CompleteProfile() {
  const navigate = useNavigate()

  const [department, setDepartment] = useState('')
  const [yearOfStudy, setYearOfStudy] = useState('')
  const [skills, setSkills] = useState([])
  const [offeringSkills, setOfferingSkills] = useState([])
  const [seekingSkills, setSeekingSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const profileToken = sessionStorage.getItem('profileToken')

    if (!profileToken) {
      navigate('/signup')
      return
    }

    async function fetchSkills() {
      try {
        const response = await fetch(`${API_BASE_URL}/profile/skills`, {
          headers: {
            Authorization: `Bearer ${profileToken}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Could not load skills.')
        }

        setSkills(data.skills || [])
      } catch (err) {
        setError(err.message || 'Could not load skills. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [navigate])

  function toggleSkill(skillId, type) {
    const updateSkills =
      type === 'offering' ? setOfferingSkills : setSeekingSkills

    updateSkills((current) =>
      current.includes(skillId)
        ? current.filter((id) => id !== skillId)
        : [...current, skillId]
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!department || !yearOfStudy) {
      setError('Please select your department and year of study.')
      return
    }

    if (offeringSkills.length === 0 && seekingSkills.length === 0) {
      setError('Choose at least one skill to teach or learn.')
      return
    }

    const profileToken = sessionStorage.getItem('profileToken')

    if (!profileToken) {
      navigate('/signup')
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`${API_BASE_URL}/profile/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${profileToken}`,
        },
        body: JSON.stringify({
          department,
          yearOfStudy,
          offeringSkills,
          seekingSkills,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Could not save your profile.')
      }

      sessionStorage.removeItem('profileToken')
      sessionStorage.removeItem('signupEmail')
      sessionStorage.removeItem('signupName')
      sessionStorage.setItem('profileCompleted', 'true')

      navigate('/signup-success')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
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
                  Make your<br />
                  <span>campus identity.</span>
                </h1>
                <span className="heading-sticker">find your people ↗</span>
              </header>

              <div className="account-form-card">
                <div className="account-card-ribbon" />
                <p>Getting your campus ready...</p>
                <p>Loading skills you can share and learn.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    )
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
                Make your<br />
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

                <div className="progress-step complete">
                  <span className="progress-dot">✓</span>
                  <span>Create Account</span>
                </div>
                <span className="progress-line active" />

                <div className="progress-step current">
                  <span className="progress-dot">3</span>
                  <span>Complete Profile</span>
                </div>
                <span className="progress-line" />

                <div className="progress-step">
                  <span className="progress-dot">4</span>
                  <span>Get Started</span>
                </div>
              </div>

              <header className="account-heading">
                <h2>
                  Tell us about<br />
                  <span>your campus life.</span>
                </h2>
                <p>
                  Choose what you study, what you can teach,
                  and what you want to learn.
                </p>
              </header>

              <form className="create-account-form" onSubmit={handleSubmit}>
                <fieldset className="account-field selector-field">
                  <legend>01 / Your department</legend>

                  <div className="choice-group department-choices">
                    {DEPARTMENTS.map((item) => (
                      <button
                        type="button"
                        key={item}
                        className={`choice-pill ${
                          department === item ? 'selected' : ''
                        }`}
                        aria-pressed={department === item}
                        onClick={() => setDepartment(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="account-field selector-field">
                  <legend>02 / Year of study</legend>

                  <div className="choice-group year-choices">
                    {YEARS.map((item) => (
                      <button
                        type="button"
                        key={item}
                        className={`choice-pill ${
                          yearOfStudy === item ? 'selected' : ''
                        }`}
                        aria-pressed={yearOfStudy === item}
                        onClick={() => setYearOfStudy(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="account-field selector-field">
                  <legend>03 / Skills I can share</legend>
                  <p className="profile-field-hint">
                    Pick the things you can teach or help someone with.
                  </p>

                  <div className="choice-group skill-choices">
                    {skills.map((skill) => (
                      <button
                        type="button"
                        key={`offering-${skill.id}`}
                        className={`choice-pill ${
                          offeringSkills.includes(skill.id) ? 'selected' : ''
                        }`}
                        aria-pressed={offeringSkills.includes(skill.id)}
                        onClick={() => toggleSkill(skill.id, 'offering')}
                      >
                        {skill.name}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="account-field selector-field">
                  <legend>04 / Skills I want to learn</legend>
                  <p className="profile-field-hint">
                    Find people who can help you level up.
                  </p>

                  <div className="choice-group skill-choices">
                    {skills.map((skill) => (
                      <button
                        type="button"
                        key={`seeking-${skill.id}`}
                        className={`choice-pill ${
                          seekingSkills.includes(skill.id) ? 'selected' : ''
                        }`}
                        aria-pressed={seekingSkills.includes(skill.id)}
                        onClick={() => toggleSkill(skill.id, 'seeking')}
                      >
                        {skill.name}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {error && (
                  <p className="account-message" role="alert">
                    {error}
                  </p>
                )}

                <button
                  className="create-account-submit"
                  type="submit"
                  disabled={saving}
                >
                  <span>
                    {saving ? 'Saving Your Profile...' : 'Complete My Profile'}
                  </span>
                  <span aria-hidden="true">→</span>
                </button>

                <p className="account-signin">
                  Your campus journey starts here.
                </p>
              </form>
            </div>
          </section>

          <aside className="campus-showcase" aria-label="Samagam features">
            <article className="showcase-card pass-card">
              <div className="showcase-copy">
                <span className="showcase-tag blue-tag">Campus access</span>
                <h2>Your Student Pass</h2>
                <p>
                  Get verified, stay connected, access campus features and more.
                </p>
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
                <p>
                  Discover students with similar interests, skills and goals.
                </p>
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
                <p>
                  Join events, communities, learn new skills and make the most
                  of your campus life.
                </p>
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

export default CompleteProfile
