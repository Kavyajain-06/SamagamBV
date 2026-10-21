import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Dashboard.css'
import banasthaliLogo from '../assets/banasthali-logo.png'

function Dashboard() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const userName = sessionStorage.getItem('userName') || 'Student'
  const userEmail = sessionStorage.getItem('userEmail') || ''
  const initial = userName.charAt(0).toUpperCase()

  function handleLogout() {
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('userName')
    sessionStorage.removeItem('userEmail')
    navigate('/login', { replace: true })
  }

  function closeSidebar() {
    setSidebarOpen(false)
  }

  function toggleSidebar() {
    if (window.matchMedia('(max-width: 900px)').matches) {
      setSidebarOpen(prev => !prev)
    } else {
      setSidebarCollapsed(prev => !prev)
    }
  }

  return (
    <div
      className={`dashboard-page ${
        sidebarCollapsed ? 'sidebar-collapsed' : ''
      }`}
    >
      {sidebarOpen && (
        <button
          type="button"
          className="dashboard-overlay"
          aria-label="Close navigation"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen ? 'sidebar-open' : ''
        }`}
        aria-label="Main navigation"
      >
        <div className="dashboard-brand">
          <span className="dashboard-brand-mark">✦</span>
          <span className="dashboard-brand-name">SamagamBV</span>
          <span className="dashboard-badge">BV-26</span>
        </div>

        <nav className="dashboard-nav">
          <Link
            className="dashboard-nav-link active"
            to="/dashboard"
            onClick={closeSidebar}
            title="Home"
          >
            <span className="dashboard-nav-icon" aria-hidden="true">▦</span>
            <span className="dashboard-nav-label">Home</span>
          </Link>

          <a
            className="dashboard-nav-link"
            href="#notices"
            onClick={closeSidebar}
            title="Notice Board"
          >
            <span className="dashboard-nav-icon" aria-hidden="true">◉</span>
            <span className="dashboard-nav-label">Notice Board</span>
          </a>

          <a
            className="dashboard-nav-link"
            href="#skills"
            onClick={closeSidebar}
            title="Skill Exchange"
          >
            <span className="dashboard-nav-icon" aria-hidden="true">⇄</span>
            <span className="dashboard-nav-label">Skill Exchange</span>
          </a>

          <Link
            className="dashboard-nav-link"
            to="/profile"
            onClick={closeSidebar}
            title="View Profile"
          >
            <span className="dashboard-nav-icon" aria-hidden="true">♙</span>
            <span className="dashboard-nav-label">View Profile</span>
          </Link>
        </nav>

        <div className="dashboard-sidebar-bottom">
          <div className="dashboard-mini-profile">
            <div className="dashboard-avatar">{initial}</div>

            <div className="dashboard-user-copy">
              <strong>{userName}</strong>
              <span>{userEmail || 'Samagam student'}</span>
            </div>
          </div>

          <button
            type="button"
            className="dashboard-logout"
            onClick={handleLogout}
            title="Log out"
          >
            <span aria-hidden="true">↗</span>
            <span className="dashboard-logout-label">Log out</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            type="button"
            className="dashboard-menu-button"
            onClick={toggleSidebar}
            aria-label={
              sidebarOpen || !sidebarCollapsed
                ? 'Collapse or close navigation'
                : 'Expand navigation'
            }
            aria-expanded={
              window.matchMedia('(max-width: 900px)').matches
                ? sidebarOpen
                : !sidebarCollapsed
            }
            title="Toggle sidebar"
          >
            ☰
          </button>

          <span className="dashboard-breadcrumb">CAMPUS / HOME</span>

          <div className="dashboard-topbar-actions">
            <span className="dashboard-topbar-label">
              YOUR CAMPUS. CONNECTED.
            </span>

            <button
              type="button"
              className="dashboard-topbar-avatar"
              onClick={() => navigate('/profile')}
              aria-label="View your profile"
            >
              {initial}
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          {/* Welcome section */}
          <section className="dashboard-hero">
            <div className="dashboard-hero-copy">
              <p className="dashboard-eyebrow">
                YOUR CAMPUS, CONNECTED.
              </p>

              <h1>Hey, {userName.split(' ')[0]}!</h1>

              <p className="dashboard-hero-tagline">
                Your campus. Your people.
              </p>

              <p className="dashboard-hero-description"></p>

              <div className="dashboard-hero-actions">
                <a
                  className="dashboard-primary-button"
                  href="#quick-access"
                >
                  EXPLORE CAMPUS <span>→</span>
                </a>

                <Link
                  className="dashboard-secondary-button"
                  to="/profile"
                >
                  VIEW PROFILE ↗
                </Link>
              </div>
            </div>

            {/* Banasthali Vidyapith logo card */}
            <div className="dashboard-campus-art banasthali-card">
              <img
                className="banasthali-emblem"
                src={banasthaliLogo}
                alt="Banasthali Vidyapith emblem"
              />

              <p className="banasthali-tagline">
                सा विद्या या विमुक्तये
              </p>
            </div>
          </section>

          {/* Quick access cards */}
          <section
            className="dashboard-quick-grid"
            id="quick-access"
          >
            <a className="dashboard-shortcut" href="#notices">
              <span className="dashboard-shortcut-icon">◉</span>
              <span className="dashboard-shortcut-label">UPDATES</span>
              <h2>Notice Board</h2>
              <p>Stay in the loop with campus announcements.</p>
              <span className="dashboard-shortcut-footer">
                View notices →
              </span>
            </a>

            <a
              className="dashboard-shortcut skills-shortcut"
              href="#skills"
            >
              <span className="dashboard-shortcut-icon">⇄</span>
              <span className="dashboard-shortcut-label">
                GROW TOGETHER
              </span>
              <h2>Skill Exchange</h2>
              <p>Share what you know. Learn something new.</p>
              <span className="dashboard-shortcut-footer">
                Find a skill buddy →
              </span>
            </a>

            <Link
              className="dashboard-shortcut messages-shortcut"
              to="/profile"
            >
              <span className="dashboard-shortcut-icon">✉</span>
              <span className="dashboard-shortcut-label">
                YOUR COMMUNITY
              </span>
              <h2>My Profile</h2>
              <p>Show others your skills and interests.</p>
              <span className="dashboard-shortcut-footer">
                View profile →
              </span>
            </Link>
          </section>

          {/* Dashboard sections */}
          <section className="dashboard-lower-grid">
            <article
              className="dashboard-section-card"
              id="notices"
            >
              <div className="dashboard-section-heading">
                <div>
                  <p className="dashboard-eyebrow">CAMPUS UPDATES</p>
                  <h2>Notice Board</h2>
                </div>

                <span className="dashboard-section-symbol">↗</span>
              </div>

              <p className="dashboard-empty-note">
                Campus notices will appear here when they are available.
              </p>
            </article>

            <article
              className="dashboard-section-card"
              id="skills"
            >
              <div className="dashboard-section-heading">
                <div>
                  <p className="dashboard-eyebrow">LEARN & SHARE</p>
                  <h2>Skill Exchange</h2>
                </div>

                <span className="dashboard-section-symbol">⇄</span>
              </div>

              <p className="dashboard-empty-note">
                Find student skill matches and collaboration opportunities
                here.
              </p>

              <Link className="dashboard-text-link" to="/profile">
                Update your skills →
              </Link>
            </article>
          </section>

          <footer className="dashboard-footer">
            <span>SAMAGAMBV / CAMPUS NETWORK</span>
            <span>BUILT FOR STUDENTS, TOGETHER ✦</span>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default Dashboard