import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import HomePage from './Components/HomePage.jsx';
import AuthPage from './Components/Register.jsx';
import MainPage from './Components/MainPage.jsx';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('accessToken');
  
  // Check if user is authenticated (has token or user in state)
  if (!user && !token) {
    return <Navigate to="/auth?mode=login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route 
        path="/main" 
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
