import { useState, useEffect } from 'react';
import { useMockBackend } from '../../context/MockBackendContext';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { BrainCircuit, Activity, Navigation, TrendingUp } from 'lucide-react';

export default function AdvancedAnalytics() {
  const { users, computeStudentSRL } = useMockBackend();
  const [classSRL, setClassSRL] = useState([]);
  const [clusterData, setClusterData] = useState([]);
  const [trajectoryData, setTrajectoryData] = useState([]);

  useEffect(() => {
    // 1. Compute Class Average SRL Radar (Phase 7)
    const students = users.filter(u => u.role === 'student');
    if (students.length > 0) {
       let total = { planning: 0, monitoring: 0, control: 0, reflection: 0, motivation: 0 };
       
       const studentSRLs = students.map(s => {
         const obj = computeStudentSRL(s.id);
         total.planning += obj.planning;
         total.monitoring += obj.monitoring;
         total.control += obj.control;
         total.reflection += obj.reflection;
         total.motivation += obj.motivation;
         return { id: s.id, name: s.name, srl: obj };
       });

       setClassSRL([
         { subject: 'Planning', A: Math.round(total.planning / students.length), fullMark: 100 },
         { subject: 'Monitoring', A: Math.round(total.monitoring / students.length), fullMark: 100 },
         { subject: 'Control', A: Math.round(total.control / students.length), fullMark: 100 },
         { subject: 'Reflection', A: Math.round(total.reflection / students.length), fullMark: 100 },
         { subject: 'Motivation', A: Math.round(total.motivation / students.length), fullMark: 100 },
       ]);

       // 2. Generate Simulated K-Means Cluster Data (Phase 9)
       // X axis: Motivation/Time, Y Axis: Average Score
       // Mapping students to clusters
       const clusters = studentSRLs.map(s => {
          let behaviorType = 'Consistent Learner';
          let x = s.srl.motivation; // 0-100
          let y = (s.srl.planning + s.srl.reflection) / 2; // 0-100
          
          if (x < 40 && y < 40) behaviorType = 'At Risk Learner';
          else if (x > 80 && y > 80) behaviorType = 'Strategic Learner';
          else if (x > 70 && y < 50) behaviorType = 'Last Minute Learner';
          else if (x < 50 && y > 60) behaviorType = 'Passive Learner';

          return { name: s.name, motivation: x, strategy: y, type: behaviorType };
       });
       setClusterData(clusters);
    }

    // 3. Learning Trajectory Simulation (Phase 10)
    setTrajectoryData([
      { week: 'Week 1', engagement: 68, target: 70 },
      { week: 'Week 2', engagement: 74, target: 72 },
      { week: 'Week 3', engagement: 45, target: 75 }, // Example drop referenced in prompt
      { week: 'Week 4', engagement: 60, target: 78 },
    ]);

  }, [users, computeStudentSRL]);

  const clusterColors = {
    'Strategic Learner': 'var(--success)',
    'Consistent Learner': 'var(--accent)',
    'Passive Learner': 'var(--text-muted)',
    'Last Minute Learner': 'var(--warning)',
    'At Risk Learner': 'var(--danger)'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <BrainCircuit className="text-accent" size={28} /> Advanced SRL Analytics
          </h1>
          <p className="text-muted">Deep dive into self-regulated learning behaviors and student trajectories.</p>
        </div>
        <button className="btn btn-primary flex gap-2"><Navigation size={18}/> Export Trajectory Report</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
         {/* Phase 7: SRL Dimensions Radar */}
         <div className="card">
            <h3 className="mb-4">Class Average SRL Dimensions</h3>
            <p className="text-muted text-sm mb-4">Averaged self-regulated learning telemetry across the entire cluster.</p>
            <div style={{ height: 350 }}>
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="70%" data={classSRL}>
                   <PolarGrid stroke="var(--border)" />
                   <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-main)', fontSize: 13 }} />
                   <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                   <Radar name="Class Average" dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.6} />
                   <Tooltip />
                 </RadarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Phase 10: Learning Trajectory */}
         <div className="card">
            <h3 className="mb-4">Engagement Trajectory (Last 4 Weeks)</h3>
            <p className="text-muted text-sm mb-4">Tracking average class engagement to detect motivation drop-offs early.</p>
            <div style={{ height: 350 }}>
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={trajectoryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="week" tick={{ fill: 'var(--text-muted)' }} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)' }} />
                    <Tooltip cursor={{ fill: 'var(--background-hover)' }} />
                    <Legend />
                    <Line type="monotone" name="Class Engagement" dataKey="engagement" stroke="var(--primary)" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                    <Line type="dashed" name="Target Trajectory" dataKey="target" stroke="var(--text-muted)" strokeWidth={2} strokeDasharray="5 5" />
                 </LineChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         {/* Phase 9: Behavior Cluster Visualization */}
         <div className="card lg:col-span-2">
            <h3 className="mb-4">Student Behavior Clusters (K-Means)</h3>
            <p className="text-muted text-sm mb-4">Grouping students by Behavioral Strategy (Y-axis) vs Motivation (X-Axis).</p>
            <div style={{ height: 350 }}>
               <ResponsiveContainer width="100%" height="100%">
                 <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                   <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                   <XAxis type="number" dataKey="motivation" name="Motivation & Time" unit="%" tick={{ fill: 'var(--text-muted)' }} domain={[0, 100]} />
                   <YAxis type="number" dataKey="strategy" name="Strategic & Reflection" unit="%" tick={{ fill: 'var(--text-muted)' }} domain={[0, 100]} />
                   <Tooltip cursor={{ strokeDasharray: '3 3' }} 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white border rounded p-3 shadow-lg">
                                    <p className="font-bold">{data.name}</p>
                                    <p className="text-sm font-semibold" style={{ color: clusterColors[data.type] }}>{data.type}</p>
                                    <p className="text-xs text-muted mt-1">Motivation: {data.motivation}% | Strategy: {data.strategy}%</p>
                                  </div>
                                );
                              }
                              return null;
                            }} />
                   {Object.keys(clusterColors).map((type, i) => (
                      <Scatter key={type} name={type} data={clusterData.filter(d => d.type === type)} fill={clusterColors[type]} shape="circle" size={100} />
                   ))}
                 </ScatterChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Insight Panel */}
         <div className="card bg-card-bg flex flex-col h-full">
            <h3 className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
               <TrendingUp size={20} className="text-warning"/> Automated Insights
            </h3>
            
            <div className="flex-1 space-y-4">
               <div className="p-3 bg-white rounded border-l-4 border-danger shadow-sm">
                  <h4 className="text-sm font-bold text-danger mb-1">Critical Trajectory Drop</h4>
                  <p className="text-xs text-muted">Engagement fell from 74 to 45 in Week 3. Root cause identified as high video confusion timestamps in "Math Integration".</p>
               </div>
               
               <div className="p-3 bg-white rounded border-l-4 border-warning shadow-sm">
                  <h4 className="text-sm font-bold text-warning mb-1">Cluster Migration</h4>
                  <p className="text-xs text-muted">3 students shifted from 'Consistent Learners' to 'Passive Learners' over the past 7 days.</p>
               </div>

               <div className="p-3 bg-white rounded border-l-4 border-accent shadow-sm">
                  <h4 className="text-sm font-bold text-accent mb-1">SRL Reflection Deficit</h4>
                  <p className="text-xs text-muted">Class average Reflection score is extremely low (30/100). Consider unlocking post-quiz reflection assignments.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
