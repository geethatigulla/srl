import { useState } from 'react';
import { Trophy, Medal, Star, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const classRankings = [
  { rank: 1, name: 'Priya Sharma', score: 12500, change: 'up' },
  { rank: 2, name: 'David Chen', score: 11200, change: 'same' },
  { rank: 3, name: 'Aisha Patel', score: 10800, change: 'up' },
  { rank: 4, name: 'Rahul Sharma (You)', score: 9400, change: 'up' },
  { rank: 5, name: 'Emma Wilson', score: 9100, change: 'down' },
  { rank: 6, name: 'Lucas Rossi', score: 8500, change: 'same' },
  { rank: 7, name: 'Mia Thompson', score: 8200, change: 'down' },
];

export default function Leaderboards() {
  const [scope, setScope] = useState('class'); // class, department, global

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Leaderboards</h1>
          <p className="text-muted">Compete on quiz scores, assignment consistency, and activity.</p>
        </div>
        <div className="role-toggle m-0 w-64">
           <div className={`role-toggle-btn ${scope === 'class' ? 'active' : ''}`} onClick={() => setScope('class')}>Class</div>
           <div className={`role-toggle-btn ${scope === 'department' ? 'active' : ''}`} onClick={() => setScope('department')}>Dept</div>
        </div>
      </div>

      {/* Podium Top 3 */}
      <div className="flex justify-center items-end gap-2 md:gap-6 mb-12 h-64 mt-12 px-4">
        
        {/* Second Place */}
        <div className="flex flex-col items-center flex-1 max-w-[150px]">
          <div className="relative mb-4">
             <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center font-bold text-xl border-4 border-white shadow-md">D</div>
             <Medal size={28} className="absolute -bottom-3 -right-3 text-slate-400 drop-shadow-md" style={{ color: '#94a3b8' }} />
          </div>
          <div className="font-bold text-sm text-center truncate w-full">David Chen</div>
          <div className="text-xs text-muted mb-2">11,200 XP</div>
          <div className="w-full bg-card-bg rounded-t-lg shadow-inner flex flex-col items-center justify-start pt-4 text-3xl font-bold text-slate-400" style={{ height: '120px', borderTop: '4px solid #cbd5e1' }}>
            2
          </div>
        </div>

        {/* First Place */}
        <div className="flex flex-col items-center flex-1 max-w-[150px] relative z-10" style={{ transform: 'translateY(-20px)' }}>
          <Trophy size={40} className="text-warning mb-2 drop-shadow-md" />
          <div className="relative mb-4">
             <div className="w-20 h-20 rounded-full bg-border flex items-center justify-center font-bold text-2xl border-4 border-warning shadow-lg text-white" style={{ background: 'var(--primary)' }}>P</div>
          </div>
          <div className="font-bold text-center truncate w-full text-primary text-lg">Priya Sharma</div>
          <div className="text-sm font-semibold text-warning mb-2">12,500 XP</div>
          <div className="w-full rounded-t-lg shadow-inner flex flex-col items-center justify-start pt-4 text-4xl font-bold text-white shadow-xl" style={{ height: '160px', background: 'linear-gradient(to bottom, #f59e0b, #d97706)' }}>
            1
          </div>
        </div>

        {/* Third Place */}
        <div className="flex flex-col items-center flex-1 max-w-[150px]">
          <div className="relative mb-4">
             <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center font-bold text-xl border-4 border-white shadow-md">A</div>
             <Medal size={28} className="absolute -bottom-3 -right-3 drop-shadow-md" style={{ color: '#b45309' }} />
          </div>
          <div className="font-bold text-sm text-center truncate w-full">Aisha Patel</div>
          <div className="text-xs text-muted mb-2">10,800 XP</div>
          <div className="w-full bg-card-bg rounded-t-lg shadow-inner flex flex-col items-center justify-start pt-4 text-3xl font-bold" style={{ height: '100px', borderTop: '4px solid #b45309', color: '#b45309' }}>
            3
          </div>
        </div>

      </div>

      <div className="card p-0 overflow-hidden">
         <table className="w-full">
            <thead className="bg-background-hover text-left">
              <tr>
                <th className="p-4 w-16 text-center">Rank</th>
                <th className="p-4">Student</th>
                <th className="p-4 text-right">XP Score</th>
                <th className="p-4 w-24 text-center">Trend</th>
              </tr>
            </thead>
            <tbody>
              {classRankings.map((student, idx) => (
                 <tr 
                   key={idx} 
                   className="border-b border-border last:border-0 hover:bg-background-hover transition-colors"
                   style={student.name.includes('You') ? { background: 'rgba(74, 144, 226, 0.05)', fontWeight: 'bold' } : {}}
                 >
                    <td className="p-4 text-center font-semibold text-muted">
                      {student.rank}
                    </td>
                    <td className="p-4 flex items-center gap-3">
                      {student.name}
                      {student.name.includes('You') && (
                        <span className="badge" style={{ background: 'var(--accent)', color: 'white', padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>YOU</span>
                      )}
                    </td>
                    <td className="p-4 text-right font-mono font-medium">
                      {student.score.toLocaleString()}
                    </td>
                    <td className="p-4 text-center flex justify-center mt-3">
                       {student.change === 'up' && <ArrowUpRight size={18} className="text-success" />}
                       {student.change === 'down' && <ArrowDownRight size={18} className="text-danger" />}
                       {student.change === 'same' && <Minus size={18} className="text-muted" />}
                    </td>
                 </tr>
              ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
