import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useMockBackend } from '../../context/MockBackendContext';

export default function StudentSignup() {
  const { registerStudent } = useMockBackend();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [joinCode, setJoinCode] = useState('AI-ML-B-2026'); // Pre-fill valid dev-code for ease
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const res = await registerStudent({ name, joinCode, email, studentId, department });
    setLoading(false);
    
    if (res.success) {
      setStep(2);
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="auth-page flex justify-center items-center bg-background">
      <div className="card w-full max-w-[450px]">
        
        {step === 1 && (
          <form onSubmit={handleRegister}>
            <h2 className="text-center mb-6">Student Registration</h2>
            
            {error && <div className="p-3 mb-4 rounded bg-danger/10 border border-danger text-danger text-sm">{error}</div>}
            
            <div className="form-group mb-6">
              <label className="form-label text-accent">Class Join Code</label>
              <input 
                required 
                type="text" 
                className="form-control text-center text-lg tracking-widest" 
                placeholder="Enter the code from your teacher" 
                value={joinCode} 
                onChange={e => setJoinCode(e.target.value)} 
              />
            </div>

            <hr className="border-t border-border my-6" />

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input required type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input required type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="form-group">
                <label className="form-label">Student ID</label>
                <input required type="text" className="form-control" value={studentId} onChange={e => setStudentId(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input required type="text" className="form-control" value={department} onChange={e => setDepartment(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Verifying Code...' : 'Join Class & Register'}
            </button>
            <div className="text-center text-sm text-muted mt-4">
              Already registered? <Link to="/login" className="text-accent font-semibold">Login</Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="text-center">
            <CheckCircle2 size={64} className="text-success mx-auto mb-6" />
            <h2 className="mb-2">Successfully Joined!</h2>
            <p className="text-muted mb-6">You have been added to your instructor's cluster.</p>
            <button onClick={() => navigate('/student/dashboard')} className="btn btn-primary w-full">Go to Student Dashboard</button>
          </div>
        )}

      </div>
    </div>
  );
}
