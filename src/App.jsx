import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MockBackendProvider, useMockBackend } from './context/MockBackendContext';
import { TelemetryProvider } from './context/TelemetryContext';

// Common
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import TeacherSignup from './pages/auth/TeacherSignup';
import StudentSignup from './pages/auth/StudentSignup';

// Teacher
import TeacherDashboard from './pages/teacher/Dashboard';
import ClassAnalytics from './pages/teacher/ClassAnalytics';
import StudentBehavior from './pages/teacher/BehaviorAnalytics';
import StudentProfile from './pages/teacher/StudentProfile';
import CourseManagement from './pages/teacher/CourseManagement';
import RealTimeMonitor from './pages/teacher/RealTimeMonitor';
import VideoAnalytics from './pages/teacher/VideoAnalytics';
import AdvancedAnalytics from './pages/teacher/AdvancedAnalytics';

// Student
import StudentDashboard from './pages/student/Dashboard';
import LearningProgress from './pages/student/LearningProgress';
import VideoPlayer from './pages/student/VideoPlayer';
import Leaderboards from './pages/student/Leaderboards';
import AIReport from './pages/student/AIReport';

function AppRoutes() {
  const { currentUser } = useMockBackend();

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to={currentUser.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} />} />
        <Route path="/signup/teacher" element={!currentUser ? <TeacherSignup /> : <Navigate to="/teacher/dashboard" />} />
        <Route path="/signup/student" element={!currentUser ? <StudentSignup /> : <Navigate to="/student/dashboard" />} />
        
        {/* App Routes */}
        <Route path="/" element={
          currentUser ? <Layout user={currentUser} /> : <Navigate to="/login" />
        }>
          {/* Teacher Routes */}
          {currentUser?.role === 'teacher' && (
            <>
              <Route index element={<Navigate to="/teacher/dashboard" />} />
              <Route path="teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="teacher/analytics" element={<ClassAnalytics />} />
              <Route path="teacher/live" element={<RealTimeMonitor />} />
              <Route path="teacher/video-analytics" element={<VideoAnalytics />} />
              <Route path="teacher/advanced" element={<AdvancedAnalytics />} />
              <Route path="teacher/behavior" element={<StudentBehavior />} />
              <Route path="teacher/student/:id" element={<StudentProfile />} />
              <Route path="teacher/courses" element={<CourseManagement />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/teacher/dashboard" />} />
            </>
          )}

          {/* Student Routes */}
          {currentUser?.role === 'student' && (
            <>
              <Route index element={<Navigate to="/student/dashboard" />} />
              <Route path="student/dashboard" element={<StudentDashboard />} />
              <Route path="student/progress" element={<LearningProgress />} />
              <Route path="student/video/:id" element={<VideoPlayer />} />
              <Route path="student/leaderboard" element={<Leaderboards />} />
              <Route path="student/report" element={<AIReport />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/student/dashboard" />} />
            </>
          )}
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <MockBackendProvider>
      <TelemetryProvider>
        <AppRoutes />
      </TelemetryProvider>
    </MockBackendProvider>
  );
}

export default App;
