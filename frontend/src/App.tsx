import { Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './context/AuthContext'
import Nav from './components/Nav'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Planner from './pages/Planner'
import TripPlan from './pages/TripPlan'
import TripGenerationError from './pages/TripGenerationError'
import TripDetail from './pages/TripDetail'
import About from './pages/About'

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="mx-auto max-w-[480px] p-6 text-center text-muted">
        Loading…
      </div>
    )
  }
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <div className="relative min-h-screen bg-[var(--bg)]">
      <div className="page-gradient pointer-events-none absolute inset-x-0 top-0 z-0 h-[55vh]" aria-hidden />
      <div className="relative z-10">
        <Nav />
        <Routes>
          <Route path="/" element={<Planner />} />
          <Route path="/trip/error" element={<TripGenerationError />} />
          <Route path="/trip/:uuid" element={<TripPlan />} />
          <Route path="/my-trips" element={<Home />} />
          <Route path="/my-trips/:id" element={<TripDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}
