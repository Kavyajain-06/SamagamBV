import { Link } from 'react-router-dom'
import './LandingPage.css'

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}


function Brand() {
  return (
    <a className="brand" href="#explore" aria-label="Samagam BV home">
      <div className="brand-logo" aria-hidden="true">
        <svg
          viewBox="0 0 40 40"
          width="30"
          height="30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="4" y="4" width="32" height="32" rx="8" fill="#EFF6FF" />
          <path
            d="M11 17L20 11L29 17"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 18V27H26V18"
            stroke="#0A0F1D"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M18 27V22H22V27"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="brand-copy">
        <div className="brand-name">
          Samagam <span>BV</span>
        </div>
        <div className="brand-tagline">
          COLLABORATIVE DIGITAL ECOSYSTEM
        </div>
      </div>
    </a>
  )
}


function Navigation() {
  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <Brand />

        <div className="nav-actions">
          <Link className="signin-link" to="/login">
            Sign In
          </Link>
          <Link className="join-button" to="/signup">
            Join the Campus <ArrowIcon />
          </Link>
        </div>
      </nav>
    </header>
  )
}

function ConstellationCard() {
  return (
    <article className="constellation-card floating-slow">
      <div className="card-heading">
        <div className="card-title">
          <span className="status-dot blue-dot" />
          <span>3D Constellation Orbit</span>
        </div>
        <span className="orbit-label">DRAG &amp; ORBIT</span>
      </div>

      <p className="constellation-description">
        Every node represents an active campus cluster. Drag in 3D space to
        discover live study nodes, mentors, and collaborative squads.
      </p>

      <div className="constellation-footer">
        <span>✦ MENTORSHIP NEXUS</span>
        <span>✦ HACK LABS</span>
      </div>
    </article>
  )
}

function StudyHallCard() {
  return (
    <article className="study-card floating-reverse">
      <div className="study-icon" aria-hidden="true">
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 2 3 14h8l-1 8 11-13h-8l0-7Z" />
        </svg>
      </div>

      <div className="study-content">
        <div className="study-heading">
          <h2>Deep Work Study Hall</h2>
          <span className="live-label">
            <span className="live-dot" />
            LIVE NOW
          </span>
        </div>

        <p>
          “Prepping for Linear Algebra Midterm. Pomodoro 50/10 with lofi
          stream.”
        </p>

        <div className="study-meta">
          <span>14 in voice</span>
          <span className="meta-separator">•</span>
          <span>Room #402</span>
        </div>
      </div>
    </article>
  )
}

function TrustBadge() {
  return (
    <div className="trust-badge">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m12 3 8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
      <span>100% Student-Crafted Ecosystem</span>
    </div>
  )
}

function Hero() {
  return (
    <main>
      <section className="hero-section" id="explore">
        <div className="hero-glow glow-blue" />
        <div className="hero-glow glow-pink" />
        <div className="hero-glow glow-lime" />

        <div className="hero-container">
          <div className="hero-copy">
            <h1 className="hero-title">
              <span>College is</span>
              <span className="highlight-line">better when</span>
              <span className="connected-text">you’re</span>
              <span className="connected-text connected-last">
                connected.
              </span>
            </h1>

            <div className="handwritten-note">
              <span className="sparkle">✦</span>
              <span>real peers, zero boring portals!</span>
              <svg
                className="note-arrow"
                viewBox="0 0 52 28"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 18C14 5 31 5 43 12M35 5l9 7-8 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <Link className="explore-button" to="/signup">
              <span>Explore your campus</span>
              <span className="explore-arrow">
                <ArrowIcon />
              </span>
            </Link>
          </div>

          <div className="hero-visual" aria-label="Campus community previews">
            <ConstellationCard />
            <StudyHallCard />
            <TrustBadge />
          </div>
        </div>
      </section>

      <section className="join-section" id="join">
        <p className="join-eyebrow">YOUR CAMPUS. YOUR PEOPLE.</p>
        <h2>
          College is better
          <br />
          <span>together.</span>
        </h2>
        <p className="join-description">
          Find your people, build something meaningful, and make your campus
          experience count.
        </p>
        <Link className="join-button join-button-bottom" to="/signup">
          Explore Samagam <ArrowIcon />
        </Link>
      </section>

      <footer className="site-footer">
        <Brand />
        <p>Built for students, by students.</p>
        <a href="#explore">Back to top ↑</a>
      </footer>
    </main>
  )
}

function LandingPage() {
  return (
    <>
      <Navigation />
      <Hero />
    </>
  )
}

export default LandingPage
