import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useMockBackend } from '../../context/MockBackendContext';

export default function TeacherSignup() {
  const { registerTeacher, createCluster } = useMockBackend();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Teacher Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [institution, setInstitution] = useState('');

  // Cluster Info
  const [clusterName, setClusterName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [semester, setSemester] = useState('');

  const [generatedCode, setGeneratedCode] = useState(null);

  const handleNext = async (e) => {
    e.preventDefault();
    setLoading(true);
    await registerTeacher({ name, email, department, institution });
    setLoading(false);
    setStep(2);
  };

  const handleCreateCluster = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await createCluster({ clusterName, courseName, semester });
    setLoading(false);
    if (res.success) {
      setGeneratedCode(res.cluster.code);
      setStep(3);
    }
  };

  return (
    <div className="auth-page flex justify-center items-center bg-background">
      <div className="card w-full max-w-[500px]">
        
        {step === 1 && (
          <form onSubmit={handleNext}>
            <h2 className="text-center mb-6">Teacher Registration</h2>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input required type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input required type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input required type="text" className="form-control" value={department} onChange={e => setDepartment(e.target.value)} />
            </div>
            <div className="form-group mb-6">
              <label className="form-label">University / Institution</label>
              <input required type="text" className="form-control" value={institution} onChange={e => setInstitution(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary w-full mb-4" disabled={loading}>
              {loading ? 'Registering...' : 'Continue to Class Setup'}
            </button>
            <div className="text-center text-sm text-muted">
              Already have an account? <Link to="/login" className="text-accent font-semibold">Login</Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCreateCluster}>
            <h2 className="text-center mb-6">Create Class Cluster</h2>
            <div className="form-group">
              <label className="form-label">Cluster Name</label>
              <input required type="text" className="form-control" placeholder="e.g. AI & ML Section B" value={clusterName} onChange={e => setClusterName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Course Name</label>
              <input required type="text" className="form-control" placeholder="e.g. Machine Learning" value={courseName} onChange={e => setCourseName(e.target.value)} />
            </div>
            <div className="form-group mb-6">
              <label className="form-label">Semester</label>
              <input required type="text" className="form-control" placeholder="e.g. 6" value={semester} onChange={e => setSemester(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Cluster'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center">
            <CheckCircle2 size={64} className="text-success mx-auto mb-6" />
            <h2 className="mb-2">Cluster Created Successfully!</h2>
            <p className="text-muted mb-6">Share this code with your students to invite them to your cluster.</p>
            
            <div className="bg-background-hover border-dashed border border-border p-6 rounded-lg mb-8">
               <div className="text-sm text-muted mb-2">Class Join Code</div>
               <div className="text-3xl font-bold tracking-widest text-primary">
                 {generatedCode}
               </div>
            </div>

            <button onClick={() => navigate('/teacher/dashboard')} className="btn btn-primary w-full">Go to Dashboard</button>
          </div>
        )}

      </div>
    </div>
  );
}
