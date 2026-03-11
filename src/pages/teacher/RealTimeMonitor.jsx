import { useState, useEffect } from 'react';
import { useMockBackend } from '../../context/MockBackendContext';
import { Activity, Users, PlayCircle, Edit3, Clock } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts';

export default function RealTimeMonitor() {
  const { getRecentEvents, users, processedMetrics } = useMockBackend();
  const [liveEvents, setLiveEvents] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

  // Mock total class size for metrics
  const totalStudents = users.filter(u => u.role === 'student').length;

  useEffect(() => {
    // Poll for new events every 2 seconds to keep the event stream visual alive
    const interval = setInterval(() => {
      const events = getRecentEvents(50);
      setLiveEvents(events);

      const now = new Date();
      // Maintain rolling timeline data for the graph using the stream counter
      setTimelineData(prev => {
         const newPoint = { 
           time: now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }), 
           eventsCount: events.length > 0 ? (events.length % 5) + 1 : 0 // Visual simulation
         };
         const next = [...prev, newPoint];
         return next.slice(-20); // Keep last 20 points
      });

    }, 2000);

    return () => clearInterval(interval);
  }, [getRecentEvents]);

  const getActivityIcon = (type) => {
    if (type.includes('video')) return <PlayCircle size={16} className="text-primary" />;
    if (type.includes('quiz')) return <Edit3 size={16} className="text-warning" />;
    if (type.includes('idle')) return <Clock size={16} className="text-danger" />;
    return <Activity size={16} className="text-accent" />;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Real-Time Classroom Monitor</h1>
          <p className="text-muted">Live telemetry and event streaming from student active sessions.</p>
        </div>
        <div className="badge border border-success text-success bg-success/10 px-3 py-1 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div> Live Stream Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card metric-card border-l-4 border-accent">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Step 1: Ingestion</span>
            <Activity size={14} className="text-accent" />
          </div>
          <div className="metric-title">Event Throughput</div>
          <div className="metric-value">{processedMetrics.systemLoad}%</div>
          <div className="text-xs text-muted mt-1">Simulated Kafka Stream</div>
        </div>

        <div className="card metric-card border-l-4 border-primary">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Step 2: Processing</span>
            <Activity size={14} className="text-primary" />
          </div>
          <div className="metric-title">Real-time watching</div>
          <div className="metric-value">{processedMetrics.watchingCount}</div>
        </div>

        <div className="card metric-card border-l-4 border-warning">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Step 3: Analytics</span>
            <Activity size={14} className="text-warning" />
          </div>
          <div className="metric-title">Active Assessments</div>
          <div className="metric-value">{processedMetrics.quizzingCount}</div>
        </div>

        <div className="card metric-card border-l-4 border-success">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Step 4: Delivery</span>
            <Users size={14} className="text-success" />
          </div>
          <div className="metric-title">Online Students</div>
          <div className="metric-value">{processedMetrics.activeStudents || users.filter(u=>u.role==='student').length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 card">
            <h3 className="mb-4">Live Engagement Timeline (Events/sec)</h3>
            <div style={{ height: 300 }}>
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={timelineData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                   <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)' }} />
                   <Tooltip />
                   <Area type="step" dataKey="eventsCount" stroke="var(--accent)" fillOpacity={0.2} fill="var(--accent)" isAnimationActive={false} />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="card flex flex-col h-[400px]">
            <h3 className="mb-4 flex items-center gap-2 border-b border-border pb-2">
              <Activity size={18} /> Event Stream
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
               {liveEvents.length === 0 ? (
                 <div className="text-center text-muted text-sm mt-10">Waiting for events...</div>
               ) : (
                 liveEvents.map((evt, idx) => (
                   <div key={idx} className="flex gap-3 text-sm p-2 rounded hover:bg-background-hover transition-colors">
                      <div className="mt-0.5">{getActivityIcon(evt.event_type)}</div>
                      <div className="flex-1">
                        <div className="font-medium text-text-main flex justify-between">
                          <span>Student ID: {evt.student_id}</span>
                          <span className="text-xs text-muted">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="text-muted flex gap-2 items-center">
                          <span className="badge py-0 px-1 text-[10px] bg-primary/10 text-primary border-none">{evt.event_type}</span>
                          {evt.video_timestamp && <span>@{evt.video_timestamp}</span>}
                        </div>
                      </div>
                   </div>
                 ))
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
