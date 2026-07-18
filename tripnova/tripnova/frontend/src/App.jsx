import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ChatPlanner from './pages/ChatPlanner.jsx';
import FloatingAssistant from './components/assistant/FloatingAssistant.jsx';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center text-slate">Loading TripNova…</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { pathname } = useLocation();
  // The full ChatPlanner page already embeds a dedicated conversation panel,
  // so the floating bubble would be redundant there.
  const showFloatingAssistant = !pathname.startsWith('/plan');

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/plan/:tripId?"
          element={
            <PrivateRoute>
              <ChatPlanner />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showFloatingAssistant && <FloatingAssistant />}
    </>
  );
}
