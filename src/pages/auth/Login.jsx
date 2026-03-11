import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart2 } from 'lucide-react';
import { useMockBackend } from '../../context/MockBackendContext';

export default function Login() {
  const { login } = useMockBackend();
  const [role, setRole] = useState('teacher'); // 'teacher' or 'student'
  const [email, setEmail] = useState(role === 'teacher' ? 'teacher@edu.com' : 'student@edu.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Auto-fill dev credentials for easier prototyping
  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    if (newRole === 'teacher') {
      setEmail('teacher@edu.com');
      setPassword('password');
    } else {
      setEmail('student@edu.com');
      setPassword('password');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const res = await login(email, password);
    setLoading(false);
    
    if (res.success) {
      if (res.user.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left flex-col justify-center items-center text-center p-8 hidden md:flex">
          <BarChart2 size={64} color="var(--accent)" className="mb-8" />
          <h1 className="text-white text-4xl mb-4 font-bold">
            AI-Powered Learning
          </h1>
          <p className="text-white/80 text-lg max-w-md mx-auto mb-12">
            Elevate education with deep analytics, behavioral tracking, and personalized insights for both teachers and students.
          </p>
          
          <div className="grid grid-cols-2 gap-4 opacity-80 max-w-sm mx-auto w-full">
             <div className="card bg-white/10 border-none p-4 w-full">
                <div className="w-full h-12 bg-accent rounded mb-2"></div>
                <div className="w-3/5 h-2 bg-white rounded"></div>
             </div>
             <div className="card bg-white/10 border-none p-4 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-success"></div>
                  <div className="w-16 h-2 bg-white rounded"></div>
                </div>
                <div className="w-4/5 h-2 bg-white/50 rounded"></div>
             </div>
          </div>
      </div>
      
      <div className="auth-right">
        <div className="auth-card card">
          <h2 className="text-center mb-6">Welcome Back</h2>
          
          <div className="role-toggle">
            <div 
              className={`role-toggle-btn ${role === 'teacher' ? 'active' : ''}`}
              onClick={() => handleRoleSwitch('teacher')}
            >
              Teacher
            </div>
            <div 
              className={`role-toggle-btn ${role === 'student' ? 'active' : ''}`}
              onClick={() => handleRoleSwitch('student')}
            >
              Student
            </div>
          </div>

          <form onSubmit={handleLogin}>
            {error && <div className="p-3 mb-4 rounded bg-danger/10 border border-danger text-danger text-sm">{error}</div>}
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="Enter your email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mb-6">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Enter your password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full mb-4" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
            
            <div className="flex justify-between text-sm text-muted">
              <a href="#" className="hover:text-primary">Forgot Password?</a>
              <Link to={role === 'teacher' ? '/signup/teacher' : '/signup/student'} className="text-accent font-semibold">
                Create Account
              </Link>
            </div>
          </form>

          {role === 'student' && (
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-center text-sm text-muted mb-4">Have a class code?</p>
              <Link to="/signup/student" className="btn btn-outline w-full text-center block" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Join Class Cluster
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
