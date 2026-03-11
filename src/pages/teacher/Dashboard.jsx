import { Users, Activity, CheckSquare, Target, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', active: 40, avgScore: 85 },
  { name: 'Tue', active: 42, avgScore: 82 },
  { name: 'Wed', active: 45, avgScore: 88 },
  { name: 'Thu', active: 38, avgScore: 79 },
  { name: 'Fri', active: 48, avgScore: 92 },
  { name: 'Sat', active: 20, avgScore: 70 },
  { name: 'Sun', active: 25, avgScore: 75 },
];

export default function TeacherDashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Class Overview</h1>
          <p className="text-muted">Welcome back, Prof. Admin. Here's what's happening today.</p>
        </div>
        <div className="badge badge-risk-low" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
          Cluster Code: AI-ML-B-2026
        </div>
      </div>

      <div className="dashboard-metrics">
        <div className="card metric-card">
          <div className="flex justify-between">
            <span className="metric-title">Total Students</span>
            <Users size={20} className="text-accent" />
          </div>
          <div className="metric-value">
            48
            <span className="metric-trend trend-up text-sm">+3 this week</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="flex justify-between">
            <span className="metric-title">Active Today</span>
            <Activity size={20} className="text-success" />
          </div>
          <div className="metric-value">
            42
            <span className="metric-trend trend-up text-sm">87% rate</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="flex justify-between">
            <span className="metric-title">Avg Quiz Score</span>
            <Target size={20} className="text-accent" />
          </div>
          <div className="metric-value">
            84%
            <span className="metric-trend trend-up text-sm">+2.5%</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="flex justify-between">
            <span className="metric-title">Students At Risk</span>
            <AlertTriangle size={20} className="text-danger" />
          </div>
          <div className="metric-value">
            3
            <span className="metric-trend trend-down text-sm" style={{ color: 'var(--danger)' }}>Needs attention</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="mb-4">Weekly Engagement Trend</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  name="Active Students"
                  stroke="var(--accent)" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4">Subject Performance (Avg Scores)</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgScore" 
                  name="Score %"
                  stroke="var(--success)" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
