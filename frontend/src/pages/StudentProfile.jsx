
import { Link } from 'react-router-dom'

function StudentProfile() {
  const userName = sessionStorage.getItem('userName') || 'Student'
  const userEmail = sessionStorage.getItem('userEmail') || ''

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <Link to="/dashboard">← Back to Dashboard</Link>

      <h1>My Campus Profile</h1>
      <p>Your Samagam student profile will appear here.</p>

      <section>
        <h2>{userName}</h2>
        <p>{userEmail}</p>
      </section>

      <p>
        Next, we'll connect your saved department, year of study,
        skills you can share, and skills you want to learn.
      </p>
    </main>
  )
}

export default StudentProfile
