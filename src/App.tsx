import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './hooks/useUser'
import Landing from './pages/Landing'
import UserSelect from './pages/UserSelect'
import AppShell from './components/AppShell'
import Home from './pages/Home'
import AddWorkout from './pages/AddWorkout'
import EditWorkout from './pages/EditWorkout'
import History from './pages/History'
import Progress from './pages/Progress'
import Records from './pages/Records'
import Import from './pages/Import'

export default function App() {
  const { role, login, logout } = useUser()

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing / marketing page */}
        <Route path="/" element={<Landing />} />

        {/* User selection (login) */}
        <Route
          path="/login"
          element={
            role ? <Navigate to="/app" replace /> : <UserSelect onSelect={login} />
          }
        />

        {/* App — requires user selection */}
        <Route
          path="/app/*"
          element={
            role ? (
              <AppShell role={role} onLogout={logout}>
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="add" element={<AddWorkout />} />
                  <Route path="edit/:id" element={<EditWorkout />} />
                  <Route path="history" element={<History />} />
                  <Route path="progress" element={<Progress />} />
                  <Route path="records" element={<Records />} />
                  <Route path="import" element={<Import />} />
                </Routes>
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
