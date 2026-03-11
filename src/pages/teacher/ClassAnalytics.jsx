import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Heatmap Data (Subjects x Days) - Simulated intensity 1-10
const heatMapData = [
  { subject: 'Neural Nets', Mon: 8, Tue: 9, Wed: 5, Thu: 4, Fri: 8, Sat: 2, Sun: 1 },
  { subject: 'Data Science', Mon: 6, Tue: 7, Wed: 9, Thu: 8, Fri: 6, Sat: 3, Sun: 4 },
  { subject: 'NLP Basics', Mon: 4, Tue: 5, Wed: 4, Thu: 9, Fri: 7, Sat: 5, Sun: 2 },
  { subject: 'Vision', Mon: 9, Tue: 6, Wed: 7, Thu: 5, Fri: 9, Sat: 4, Sun: 3 },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getHeatColor = (value) => {
  // Map 1-10 to shades of primary/accent
  if (value < 3) return '#e0e7ff'; // Very light
  if (value < 5) return '#a5b4fc';
  if (value < 7) return '#6366f1';
  if (value < 9) return '#4338ca';
  return '#312e81'; // Darkest
};

// Bar chart data for Distribution
const distData = [
  { range: '0-50', count: 2 },
  { range: '51-60', count: 4 },
  { range: '61-70', count: 8 },
  { range: '71-80', count: 14 },
  { range: '81-90', count: 12 },
  { range: '91-100', count: 8 },
];

export default function ClassAnalytics() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Class Analytics & Engagement</h1>
        <p className="text-muted">Deep dive into content consumption and performance distribution.</p>
      </div>

      <div className="card mb-6">
        <h3 className="mb-4">Weekly Engagement Heatmap</h3>
        <p className="text-sm text-muted mb-6">Color intensity represents the volume of student activity (video watches, quiz attempts) per subject.</p>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '600px', borderSpacing: '4px', borderCollapse: 'separate' }}>
            <thead>
              <tr>
                <th style={{ background: 'transparent', borderBottom: 'none', padding: '0.5rem' }}>Subject</th>
                {days.map(d => (
                  <th key={d} style={{ textAlign: 'center', background: 'transparent', borderBottom: 'none', padding: '0.5rem' }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatMapData.map(row => (
                <tr key={row.subject}>
                  <td style={{ fontWeight: 500, padding: '0.5rem', whiteSpace: 'nowrap', border: 'none' }}>{row.subject}</td>
                  {days.map(d => (
                    <td key={d} style={{ padding: 0, border: 'none' }}>
                      <div 
                        title={`${row.subject} on ${d}: Level ${row[d]}`}
                        style={{
                          background: getHeatColor(row[d]),
                          height: '40px',
                          borderRadius: '4px',
                          margin: '2px',
                          transition: 'transform 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-end gap-2 mt-4 text-sm text-muted">
            <span>Low</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[2, 4, 6, 8, 10].map(v => (
                 <div key={v} style={{ width: 20, height: 20, borderRadius: 2, background: getHeatColor(v) }} />
              ))}
            </div>
            <span>High</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="mb-4">Quiz Score Distribution</h3>
          <div style={{ height: 300 }}>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={distData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="range" axisLine={false} tickLine={false} />
                 <YAxis axisLine={false} tickLine={false} />
                 <Tooltip cursor={{fill: 'var(--background-hover)'}} />
                 <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4">Assignment Submission Trend</h3>
          <p className="text-muted text-sm mb-4">Volume of submissions relative to deadline day (Day 0).</p>
          <div style={{ height: 260, display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '1rem 0' }}>
             {/* Simulated manual bars for variety in UI design */}
             {[
               { t: 'Day -3', v: 20 },
               { t: 'Day -2', v: 40 },
               { t: 'Day -1', v: 85 },
               { t: 'Day 0', v: 100 },
               { t: 'Late', v: 15 },
             ].map(d => (
                <div key={d.t} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    width: '100%', 
                    height: `${d.v}%`, 
                    background: d.t === 'Late' ? 'var(--danger)' : 'var(--primary)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 1s ease-out'
                  }} />
                  <span className="text-sm text-muted mt-2">{d.t}</span>
                </div>
             ))}
          </div>
        </div>
      </div>

    </div>
  );
}
