import { Target, Clock, CheckCircle, BarChart2, Star, ShieldAlert, ExternalLink, FileText, PlayCircle, HelpCircle } from 'lucide-react';
import { useMockBackend } from '../../context/MockBackendContext';

const radarData = [
  { subject: 'Neural Nets', A: 85, fullMark: 100 },
  { subject: 'NLP', A: 90, fullMark: 100 },
  { subject: 'Math', A: 65, fullMark: 100 },
  { subject: 'Vision', A: 78, fullMark: 100 },
  { subject: 'Python', A: 95, fullMark: 100 },
  { subject: 'Data Viz', A: 88, fullMark: 100 },
];

const activityData = [
  { day: 'Mon', mins: 45 },
  { day: 'Tue', mins: 120 },
  { day: 'Wed', mins: 0 },
  { day: 'Thu', mins: 75 },
  { day: 'Fri', mins: 180 },
  { day: 'Sat', mins: 30 },
  { day: 'Sun', mins: 90 },
];

export default function StudentDashboard() {
  const { currentUser, interventions } = useMockBackend();
  const studentInterventions = interventions.filter(i => i.student_id === currentUser?.id);

  const getMaterialIcon = (type) => {
    switch (type) {
      case 'notes': return <FileText size={20} className="text-accent" />;
      case 'video': return <PlayCircle size={20} className="text-success" />;
      case 'quiz': return <HelpCircle size={20} className="text-warning" />;
      default: return <ExternalLink size={20} />;
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-muted">Welcome back, Rahul. Here is your learning cockpit.</p>
        </div>
        <div className="flex gap-2">
           <span className="badge" style={{ background: 'var(--accent)', color: 'white', padding: '0.5rem 1rem', fontSize: '1rem' }}>
             <Star size={16} className="inline mr-1" /> Quiz Master High Score
           </span>
        </div>
      </div>

      <div className="dashboard-metrics">
        <div className="card metric-card">
          <div className="flex justify-between">
            <span className="metric-title">Engagement Score</span>
            <Target size={20} className="text-accent" />
          </div>
          <div className="metric-value">
            92<span className="text-muted text-sm ml-1">/ 100</span>
          </div>
          <div className="metric-trend trend-up text-sm mt-2">Consistent Learner</div>
        </div>

        <div className="card metric-card">
          <div className="flex justify-between">
            <span className="metric-title">Weekly Study Time</span>
            <Clock size={20} className="text-warning" />
          </div>
          <div className="metric-value">9h 15m</div>
          <div className="metric-trend trend-up text-sm mt-2">+2h from last week</div>
        </div>

        <div className="card metric-card">
          <div className="flex justify-between">
            <span className="metric-title">Quiz Accuracy</span>
            <CheckCircle size={20} className="text-success" />
          </div>
          <div className="metric-value">88%</div>
          <div className="metric-trend trend-up text-sm mt-2">Top 15% in class</div>
        </div>

        <div className="card metric-card">
          <div className="flex justify-between">
            <span className="metric-title">Current Rank</span>
            <BarChart2 size={20} className="text-primary" />
          </div>
          <div className="metric-value flex items-baseline gap-2">
             12<span className="text-muted text-lg">th</span>
          </div>
          <div className="metric-trend text-muted text-sm mt-2">Class: AI-ML-B-2026</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="mb-4">Subject Mastery Profile</h3>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-main)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Rahul" dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
             <h3>Activity Tracker</h3>
             <span className="text-sm font-medium text-accent">540 mins total</span>
          </div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                   <linearGradient id="colorMins" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="var(--success)" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Area type="monotone" dataKey="mins" stroke="var(--success)" fillOpacity={1} fill="url(#colorMins)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card mt-6">
         <h3 className="mb-4">Recent Achievements</h3>
         <div className="flex gap-4 overflow-x-auto pb-4">
            <div className="border border-border p-4 rounded-xl flex items-center gap-4 min-w-[250px]" style={{ background: 'white' }}>
               <div className="p-3 rounded-full" style={{ background: 'rgba(74, 144, 226, 0.1)' }}>
                  <CheckCircle size={24} className="text-accent"/>
               </div>
               <div>
                 <div className="font-bold">Quiz Master</div>
                 <div className="text-sm text-muted">Scored 100% on 3 quizzes</div>
               </div>
            </div>
            
            <div className="border border-border p-4 rounded-xl flex items-center gap-4 min-w-[250px]" style={{ background: 'white' }}>
               <div className="p-3 rounded-full" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                  <Clock size={24} className="text-success"/>
               </div>
               <div>
                 <div className="font-bold">Early Bird</div>
                 <div className="text-sm text-muted">Submitted 2 days early</div>
               </div>
            </div>

            <div className="border border-border p-4 rounded-xl flex items-center gap-4 min-w-[250px]" style={{ background: 'white' }}>
               <div className="p-3 rounded-full" style={{ background: 'rgba(234, 179, 8, 0.1)' }}>
                  <Star size={24} className="text-warning"/>
               </div>
               <div>
                 <div className="font-bold">7-Day Streak</div>
                 <div className="text-sm text-muted">Learned consistently</div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
