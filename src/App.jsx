import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Classes from './pages/Classes';
import Sessions from './pages/Sessions';
import Calendar from './pages/Calendar';
import Progress from './pages/Progress';
import Sync from './pages/Sync';
import Tips from './pages/Tips';
import AIInsights from './pages/AIInsights';
import Profile from './pages/Profile';
import CourseSchedule from './pages/CourseSchedule';
import LectureReminder from './components/LectureReminder';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('App mounted');
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      console.log('Token:', token, 'User data:', userData);
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    }
  }, []);

  const handleLogin = (token, userData) => {
    console.log('handleLogin called with token:', token, 'userData:', userData);
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      console.log('Auth state updated, isAuthenticated:', true);
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error clearing auth state:', error);
    }
  };

  console.log('App rendering, isAuthenticated:', isAuthenticated, 'user:', user);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
      {isAuthenticated && <LectureReminder />}
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/attendance" element={isAuthenticated ? <Attendance user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/classes" element={isAuthenticated ? <Classes user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/sessions" element={isAuthenticated ? <Sessions user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/calendar" element={isAuthenticated ? <Calendar user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/progress" element={isAuthenticated ? <Progress user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/sync" element={isAuthenticated ? <Sync user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/tips" element={isAuthenticated ? <Tips user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/ai-insights" element={isAuthenticated ? <AIInsights user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/course-schedule" element={isAuthenticated ? <CourseSchedule user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
