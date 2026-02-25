import { Routes, Route, Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useAuth } from './context/AuthContext'
import Nav from './components/Nav'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Planner from './pages/Planner'
import TripPlan from './pages/TripPlan'
import TripDetail from './pages/TripDetail'

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <Box className="max-w-[480px] mx-auto p-6 text-center">
        <Typography color="text.secondary">Loading…</Typography>
      </Box>
    )
  }
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Planner />} />
        <Route path="/trip/:uuid" element={<TripPlan />} />
        <Route path="/my-trips" element={<Home />} />
        <Route path="/my-trips/:id" element={<TripDetail />} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
