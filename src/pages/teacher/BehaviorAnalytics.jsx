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

const riskAlerts = [
  { id: 1, name: 'Alex Johnson', level: 'High', reason: 'Missed 3 consecutive video lectures', intervention: 'Schedule 1-on-1 meeting' },
  { id: 2, name: 'Sam Taylor', level: 'Medium', reason: 'Quiz scores dropped by 20% this week', intervention: 'Assign review exercises' },
  { id: 3, name: 'Jordan Lee', level: 'Medium', reason: 'High video pause rate, low completion', intervention: 'Provide simplified material' }
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
                   Suggested: {alert.intervention}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

    </div>
  );
}
