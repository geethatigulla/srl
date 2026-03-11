import { useState, useEffect } from 'react';
import { useMockBackend } from '../../context/MockBackendContext';
import { PlayCircle, Clock, AlertTriangle, FastForward } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

export default function VideoAnalytics() {
  const { events } = useMockBackend();
  const [videoStats, setVideoStats] = useState({ completion: 0, avgTime: 0, pauseFreq: 0, rewindFreq: 0 });
  const [confusionMap, setConfusionMap] = useState([]);

  useEffect(() => {
    // Phase 4: Compute Video Engagement Metrics
    const videoEvents = events.filter(e => e.event_type.startsWith('video_') || e.event_type.startsWith('quiz_') || e.event_type.startsWith('poll_'));
    
    if (videoEvents.length > 0) {
      const completes = videoEvents.filter(e => e.event_type === 'video_complete').length;
      const starts = videoEvents.filter(e => e.event_type === 'video_play').length;
      const pauses = videoEvents.filter(e => e.event_type === 'video_pause').length;
      const rewinds = videoEvents.filter(e => e.event_type === 'video_rewind').length;
      
      setVideoStats({
        completion: starts > 0 ? Math.round((completes / starts) * 100) : 0,
        avgTime: '14m 20s', // Simulating calculated average
        pauseFreq: Math.round(pauses / (starts || 1)),
        rewindFreq: Math.round(rewinds / (starts || 1))
      });

      // Compute Confusion Map (Heatmap of rewinds and incorrect quiz answers)
      // Grouping by 10% bins (0-10, 10-20, etc)
      const bins = Array(10).fill(0).map((_, i) => ({ segment: `${i*10}%`, intensity: 0 }));
      
      videoEvents.forEach(e => {
        if (e.video_timestamp && (e.event_type === 'video_rewind' || e.event_type === 'video_pause' || (e.event_type === 'quiz_answer' && e.correct === false))) {
           const percentStr = e.video_timestamp.replace('%', '');
           const percent = parseInt(percentStr, 10);
           if (!isNaN(percent)) {
             const binIdx = Math.min(9, Math.floor(percent / 10));
             bins[binIdx].intensity += (e.event_type === 'quiz_answer' ? 5 : 1); // Incorrect answers weigh more
           }
        }
      });
      
      setConfusionMap(bins);
    }
  }, [events]);

  const getColor = (intensity) => {
    if (intensity === 0) return 'var(--accent)';
    if (intensity < 5) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Video Engagement Analytics</h1>
          <p className="text-muted">Analyze how students interact with course videos to identify confusing concepts.</p>
        </div>
      </div>

      <div className="dashboard-metrics mb-8">
        <div className="card metric-card">
          <div className="flex justify-between">
             <span className="metric-title">Avg. Completion Rate</span>
             <PlayCircle size={20} className="text-success" />
          </div>
          <div className="metric-value">{videoStats.completion}%</div>
          <div className="metric-trend trend-up text-sm mt-2">Based on {events.filter(e=>e.event_type==='video_play').length} plays</div>
        </div>
        <div className="card metric-card">
          <div className="flex justify-between">
             <span className="metric-title">Avg. Watch Time</span>
             <Clock size={20} className="text-primary" />
          </div>
          <div className="metric-value">{videoStats.avgTime}</div>
        </div>
        <div className="card metric-card">
          <div className="flex justify-between">
             <span className="metric-title">Avg. Pauses per Session</span>
             <AlertTriangle size={20} className="text-warning" />
          </div>
          <div className="metric-value">{videoStats.pauseFreq}</div>
        </div>
        <div className="card metric-card">
          <div className="flex justify-between">
             <span className="metric-title">Avg. Rewinds</span>
             <FastForward size={20} className="text-danger transform rotate-180" />
          </div>
          <div className="metric-value">{videoStats.rewindFreq}</div>
        </div>
      </div>

      <div className="card mb-8">
        <h3 className="mb-2">Timeline Confusion Heatmap</h3>
        <p className="text-muted text-sm mb-6">Highlights segments with high rewind frequency, frequent pauses, or incorrect inline quiz answers. Red indicates highly confusing segments.</p>
        
        <div style={{ height: 350 }}>
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confusionMap}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="segment" tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip 
                  cursor={{ fill: 'var(--background-hover)' }} 
                  contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
                  formatter={(value) => [value, 'Confusion Intensity']}
                />
                <Bar dataKey="intensity" radius={[4, 4, 0, 0]}>
                  {confusionMap.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={getColor(entry.intensity)} />
                  ))}
                </Bar>
              </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
      
      <div className="card bg-primary/5 border-primary/20">
         <h3 className="flex items-center gap-2 text-primary mb-2">
           <AlertTriangle size={20} /> AI Insight: Intervention Needed
         </h3>
         <p className="text-text-main">
           The heat map above indicates that a significant number of students rewound and failed the knowledge check at the <strong>45% mark</strong> of the <i>Activation Functions</i> video. Consider adding supplemental material or simplifying the explanation around "Non-linearity".
         </p>
      </div>
    </div>
  );
}
