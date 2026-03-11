import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AlertTriangle, TrendingDown, Target, Zap } from 'lucide-react';
import { useMockBackend } from '../../context/MockBackendContext';
import { useState, useEffect } from 'react';

const behaviorData = [
  { name: 'Consistent Learners', value: 45, color: 'var(--success)' },
  { name: 'High Performers', value: 15, color: 'var(--accent)' },
  { name: 'Passive Learners', value: 20, color: '#f59e0b' },
  { name: 'Procrastinators', value: 15, color: '#f97316' },
  { name: 'At Risk', value: 5, color: 'var(--danger)' }
];

export default function BehaviorAnalytics() {
  const { users, computeStudentSRL } = useMockBackend();
  const [classSRL, setClassSRL] = useState({ planning: 0, monitoring: 0, control: 0, reflection: 0 });

  useEffect(() => {
    const students = users.filter(u => u.role === 'student');
    if (students.length === 0) return;

    const totals = students.reduce((acc, s) => {
      const scores = computeStudentSRL(s.id);
      return {
        planning: acc.planning + scores.planning,
        monitoring: acc.monitoring + scores.monitoring,
        control: acc.control + scores.control,
        reflection: acc.reflection + scores.reflection
      };
    }, { planning: 0, monitoring: 0, control: 0, reflection: 0 });

    setClassSRL({
      planning: Math.round(totals.planning / students.length),
      monitoring: Math.round(totals.monitoring / students.length),
      control: Math.round(totals.control / students.length),
      reflection: Math.round(totals.reflection / students.length)
    });
  }, [users, computeStudentSRL]);

  const riskAlerts = [
    { id: 1, name: 'Rahul Sharma', level: 'High', reason: 'High confusion spots in ML Introduction', srlDeficit: 'Control' },
    { id: 2, name: 'Alex Johnson', level: 'Medium', reason: 'Skips reflection polls frequently', srlDeficit: 'Reflection' },
  ];
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Student Behavior Analytics</h1>
        <p className="text-muted">AI-driven classification based on LMS activity and engagement models.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
           <h3 className="mb-4">Behavior Clusters</h3>
           <div style={{ height: 300 }}>
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={behaviorData}
                   cx="50%"
                   cy="50%"
                   innerRadius={80}
                   outerRadius={120}
                   paddingAngle={2}
                   dataKey="value"
                 >
                   {behaviorData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                 <Legend verticalAlign="bottom" height={36}/>
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="flex items-center gap-2">
              <AlertTriangle className="text-danger" size={20} />
              Risk Alerts
            </h3>
            <span className="badge badge-risk-high">{riskAlerts.length} Action Items</span>
          </div>
          
          <div className="flex flex-col gap-4">
             {riskAlerts.map(alert => (
               <div key={alert.id} className="p-4 border rounded-lg" style={{ borderColor: 'var(--border)', background: 'white' }}>
                 <div className="flex justify-between mb-2">
                   <Link to={`/teacher/student/${alert.id}`} className="font-semibold text-primary hover:underline">
                     {alert.name}
                   </Link>
                   <span className={`badge ${alert.level === 'High' ? 'badge-risk-high' : 'badge-risk-medium'}`}>
                     {alert.level} Risk
                   </span>
                 </div>
                 <div className="text-sm text-muted mb-3 flex items-start gap-2">
                   <TrendingDown size={16} className="mt-0.5 flex-shrink-0" />
                   {alert.reason}
                 </div>
                 <div className="text-sm font-medium" style={{ color: 'var(--secondary)' }}>
                    SRL Deficit: {alert.srlDeficit}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="card mb-8">
         <div className="flex justify-between items-center mb-6">
            <h3 className="flex items-center gap-2 m-0">
               <Target className="text-accent" /> Class-wide Strategic Learning Gaps
            </h3>
            <span className="text-xs text-muted">Aggregated from real-time telemetry</span>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Planning', value: classSRL.planning, color: 'var(--primary)', icon: <Zap size={14} /> },
              { label: 'Monitoring', value: classSRL.monitoring, color: 'var(--warning)', icon: <Activity size={14} /> },
              { label: 'Control', value: classSRL.control, color: 'var(--accent)', icon: <Target size={14} /> },
              { label: 'Reflection', value: classSRL.reflection, color: 'var(--success)', icon: <TrendingDown size={14} /> },
            ].map(dim => (
              <div key={dim.label} className="p-4 rounded-lg bg-background-hover border border-border">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                       {dim.icon} {dim.label}
                    </span>
                    <span className="text-lg font-bold" style={{ color: dim.color }}>{dim.value}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
                    <div className="h-full transition-all duration-1000" style={{ width: `${dim.value}%`, background: dim.color }} />
                 </div>
                 <p className="text-[10px] text-muted mt-2">
                    {dim.value < 50 ? `Critical: Class struggling with ${dim.label.toLowerCase()}` : `Stable: Healthy ${dim.label.toLowerCase()} levels`}
                 </p>
              </div>
            ))}
         </div>
      </div>

    </div>
  );
}
