
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import Signup from './pages/Signup'
import VerifyOTP from './pages/VerifyOTP'
import CreateAccount from './pages/CreateAccount'
import CompleteProfile from './pages/CompleteProfile'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StudentProfile from './pages/StudentProfile'

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('authToken')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
