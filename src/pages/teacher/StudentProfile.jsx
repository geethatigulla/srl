import { useParams } from 'react-router-dom';
import { UploadCloud, CheckCircle2, User, FileText, Activity, ShieldAlert, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useState, useEffect } from 'react';
import { useMockBackend } from '../../context/MockBackendContext';

const activityData = [
  { week: 'W1', score: 85, time: 2.5 },
  { week: 'W2', score: 82, time: 2.1 },
  { week: 'W3', score: 79, time: 1.8 },
  { week: 'W4', score: 65, time: 1.2 }, // Drop indicating risk
  { week: 'W5', score: 60, time: 1.0 },
];

export default function StudentProfile() {
  const { id } = useParams();
  const { computeStudentSRL, users, assignIntervention } = useMockBackend();
  const [uploaded, setUploaded] = useState(false);
  const [materialType, setMaterialType] = useState('notes');
  const [srlData, setSrlData] = useState([]);
  const [srlScores, setSrlScores] = useState({ planning: 0, monitoring: 0, control: 0, reflection: 0, motivation: 0 });
  const [student, setStudent] = useState(null);

  useEffect(() => {
    // We expect id to match a student, but for prototype sake, just pick the first student if id is arbitrary
    const foundStudent = users.find(u => u.role === 'student' && u.id.toString() === id) || users.find(u => u.role === 'student');
    setStudent(foundStudent);

    if (foundStudent) {
       const scores = computeStudentSRL(foundStudent.id);
       setSrlScores(scores);
       setSrlData([
         { subject: 'Planning', A: scores.planning, fullMark: 100 },
         { subject: 'Monitoring', A: scores.monitoring, fullMark: 100 },
         { subject: 'Control', A: scores.control, fullMark: 100 },
         { subject: 'Reflection', A: scores.reflection, fullMark: 100 },
         { subject: 'Motivation', A: scores.motivation, fullMark: 100 },
       ]);
    }
  }, [id, computeStudentSRL, users]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!student) return;

    assignIntervention(student.id, materialType, `Teacher assigned ${materialType} for ${getBehaviorType()}`);
    
    setUploaded(true);
    setTimeout(() => setUploaded(false), 3000);
  };

  const getBehaviorType = () => {
    if (srlScores.motivation < 40 && srlScores.planning < 40) return "At Risk Learner";
    if (srlScores.motivation > 80 && srlScores.planning > 80) return "Strategic Learner";
    if (srlScores.motivation > 70 && srlScores.planning < 50) return "Last Minute Learner";
    if (srlScores.motivation < 50 && srlScores.reflection > 60) return "Passive Learner";
    return "Consistent Learner";
  };

  if (!student) return <div className="p-8 text-center text-muted">Loading student data...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Student Profile</h1>
          <div className="flex gap-2 mt-2">
             <span className={`badge ${getBehaviorType() === 'At Risk Learner' ? 'bg-danger/10 text-danger border-danger' : 'badge-risk-medium'}`}>
               {getBehaviorType()}
             </span>
             <span className="badge" style={{ background: 'var(--card-bg)', color: 'var(--text-main)' }}>Dept. Rank: 42/150</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card metric-card">
          <div className="flex justify-between">
            <span className="metric-title">Student Name</span>
            <User size={16} className="text-muted" />
          </div>
          <div className="metric-value text-base mt-2">{student.name}</div>
          <div className="text-xs text-muted mt-1">ID: {student.id}</div>
        </div>
        
        <div className="card metric-card">
          <div className="flex justify-between">
            <span className="metric-title">Engagement Score</span>
            <Activity size={16} className="text-warning" />
          </div>
          <div className="metric-value text-base mt-2">{(srlScores.motivation + srlScores.control) / 2}/100</div>
          <div className="text-xs text-danger mt-1">Declining trend</div>
        </div>

        <div className="card metric-card">
          <div className="flex justify-between">
            <span className="metric-title">Procrastination Index</span>
            <Target size={16} className="text-danger" />
          </div>
          <div className="metric-value text-base mt-2">{100 - srlScores.planning}/100</div>
          <div className="text-xs text-muted mt-1">Higher is worse</div>
        </div>
        
        <div className="card metric-card">
          <div className="flex justify-between">
            <span className="metric-title">Persistence Score</span>
            <Target size={16} className="text-accent" />
          </div>
          <div className="metric-value text-base mt-2">{srlScores.control}/100</div>
          <div className="text-xs text-success mt-1">Strong rewinds</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
         {/* Phase 8: Individual SRL Radar */}
         <div className="card">
            <h3 className="mb-4">Individual SRL Profile</h3>
            <div style={{ height: 300 }}>
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="70%" data={srlData}>
                   <PolarGrid stroke="var(--border)" />
                   <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-main)', fontSize: 11 }} />
                   <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                   <Radar name={student.name} dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} />
                   <RechartsTooltip />
                 </RadarChart>
               </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-3 bg-card-bg rounded border border-border">
               <strong className="text-sm block mb-1">Textual Insight:</strong>
               <p className="text-xs text-muted">This student shows adequate motivation ({srlScores.motivation}), but extremely weak reflection ({srlScores.reflection}) after quizzes. They also exhibit poor planning before assignments.</p>
            </div>
         </div>

         <div className="card lg:col-span-2">
            <h3 className="mb-4">Quiz & Engagement History</h3>
            <div style={{ height: 350 }}>
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={activityData}>
                   <defs>
                     <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                   <XAxis dataKey="week" tick={{ fill: 'var(--text-muted)' }} />
                   <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)' }} />
                   <RechartsTooltip />
                   <Area type="monotone" name="Activity Score" dataKey="score" stroke="var(--accent)" fillOpacity={1} fill="url(#colorScore)" />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Phase 12: Adaptive Teaching Intervention */}
      <div className="card" style={{ background: 'var(--primary)', color: 'white' }}>
         <h3 className="mb-4 flex items-center gap-2" style={{ color: 'white' }}>
           <ShieldAlert size={20} /> Adaptive Teaching Intervention
         </h3>
         <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.8)' }}>
           Based on the SRL model, {student.name} has a Reflection Deficit. Recommending targeted post-quiz explanation notes to improve comprehension. Upload Support Materials to trigger an immediate intervention on their dashboard.
         </p>
         
         <form onSubmit={handleUpload}>
            <div className="form-group mb-4">
              <label className="form-label" style={{ color: 'white' }}>Intervention Material Type</label>
              <select 
                className="form-control" 
                style={{ maxWidth: '400px', appearance: 'none', background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
              >
                <option value="notes" className="text-black">Concept Explanation Notes (Recommended)</option>
                <option value="video" className="text-black">Simplified Video Lesson</option>
                <option value="quiz" className="text-black">Extra Practice Quizzes</option>
              </select>
            </div>
            
            <div className="border border-dashed rounded-lg p-6 text-center mb-6 cursor-pointer hover:bg-white/5 transition-colors" style={{ borderColor: 'rgba(255,255,255,0.2)', maxWidth: '400px' }}>
               <UploadCloud size={32} className="mx-auto mb-2" style={{ color: 'var(--accent)' }}/>
               <div className="text-sm font-semibold">Click to attach material</div>
               <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>PDF, MP4, JPEG up to 50MB</div>
            </div>

            <button type="submit" className="btn btn-accent flex justify-center gap-2" style={{ maxWidth: '400px', width: '100%' }}>
              {uploaded ? <CheckCircle2 size={20} /> : <FileText size={20} />}
              {uploaded ? 'Intervention Assigned Successfully' : 'Assign Intervention'}
            </button>
         </form>
      </div>

    </div>
  );
}
