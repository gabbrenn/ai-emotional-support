import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Mood from './pages/Mood';
import PlaceholderPage from './pages/PlaceholderPage';
import StatusPage from './pages/StatusPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/status" element={<StatusPage />} />

        {/* Protected App Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/mood" element={<Mood />} />
          <Route
            path="/resources"
            element={
              <PlaceholderPage
                title="Wellness Resources"
                description="Grounding exercises, coping strategies, and mental health helplines"
                icon="🌱"
              />
            }
          />
          <Route
            path="/profile"
            element={
              <PlaceholderPage
                title="Account & Profile"
                description="Manage your account settings and preferences"
                icon="⚙️"
              />
            }
          />
        </Route>

        {/* Default route: redirect to /dashboard (which redirects to /login if unauth) */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
