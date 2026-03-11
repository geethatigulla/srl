import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, CheckCircle2, ChevronDown, ChevronUp, Lock, FileText, CheckSquare, MessageSquare } from 'lucide-react';

import { useMockBackend } from '../../context/MockBackendContext';

export default function LearningProgress() {
  const { subjects } = useMockBackend();
  const [expanded, setExpanded] = useState(2); // ID of expanded subject
  const navigate = useNavigate();

  const { track } = useTelemetry();

  const handleInteract = (item, subjectId) => {
    if (item.locked) return;
    
    const metadata = { course_id: subjectId, chapter_id: item.id };

    if (item.type === 'video') {
      navigate(`/student/video/${item.id}`);
    } else if (item.type === 'assignment') {
      track('assignment_view', metadata);
      const submit = confirm(`Viewing ${item.title}. Submit assignment now?`);
      if (submit) {
        track('assignment_submit', metadata);
        alert("Assignment submitted!");
      }
    } else {
      alert(`Opening ${item.type}: ${item.title}`);
    }
  };

  const getIcon = (item) => {
    if (item.locked) return <Lock size={20} className="text-muted" />;
    if (item.completed) return <CheckCircle2 size={20} className="text-success" />;
    
    switch(item.type) {
      case 'video': return <PlayCircle size={20} className="text-accent" />;
      case 'quiz': return <CheckSquare size={20} className="text-warning" />;
      case 'assignment': return <FileText size={20} className="text-primary" />;
      case 'poll': return <MessageSquare size={20} className="text-secondary" />;
      default: return <PlayCircle size={20} className="text-accent" />;
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Learning Progress</h1>
        <p className="text-muted">Track your curriculum and resume exactly where you left off.</p>
      </div>

      <div className="flex flex-col gap-4">
        {subjects.map(subject => (
           <div key={subject.id} className="card p-0 overflow-hidden" style={{ opacity: subject.locked ? 0.6 : 1 }}>
              
              <div 
                className="p-4 flex flex-col cursor-pointer hover:bg-background-hover transition-colors"
                onClick={() => {
                  if (!subject.locked) {
                    const isExpanding = expanded !== subject.id;
                    setExpanded(isExpanding ? subject.id : null);
                    if (isExpanding) {
                      track('chapter_preview', { course_id: subject.id });
                    }
                  }
                }}
              >
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="flex items-center gap-2 m-0">
                      {subject.locked && <Lock size={18} />} 
                      {subject.name}
                    </h3>
                    <div className="flex items-center gap-3">
                       <span className="text-sm font-semibold">{subject.progress}%</span>
                       {!subject.locked && (
                         expanded === subject.id ? <ChevronUp size={20} className="text-muted"/> : <ChevronDown size={20} className="text-muted"/>
                       )}
                    </div>
                 </div>
                 
                 <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${subject.progress}%`, background: subject.progress === 100 ? 'var(--success)' : 'var(--accent)' }}/>
                 </div>
              </div>

              {expanded === subject.id && !subject.locked && (
                <div className="border-t border-border bg-background-hover">
                   {subject.chapters.map((ch, idx) => (
                     <div 
                        key={ch.id} 
                        className="flex justify-between items-center p-4 border-b border-border last:border-0 hover:bg-white transition-colors cursor-pointer"
                        style={{ background: ch.current ? 'rgba(74, 144, 226, 0.05)' : '' }}
                        onClick={() => handleInteract(ch, subject.id)}
                     >
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-full ${ch.current ? 'bg-accent/10 border border-accent border-opacity-20' : ''}`}>
                             {getIcon(ch)}
                           </div>
                           <div>
                             <div className={`font-medium ${ch.locked ? 'text-muted' : (ch.current ? 'text-accent' : '')}`}>
                               {idx + 1}. {ch.title}
                             </div>
                             <div className="text-xs text-muted capitalize mt-1">
                               {ch.type} • {ch.duration}
                             </div>
                           </div>
                        </div>

                        <div>
                           {ch.current && (
                             <span className="badge" style={{ background: 'var(--accent)', color: 'white' }}>In Progress</span>
                           )}
                           {ch.locked && (
                             <span className="text-xs text-muted">Requires previous completion</span>
                           )}
                           {ch.completed && (
                             <span className="text-xs text-success font-semibold">Done</span>
                           )}
                        </div>
                     </div>
                   ))}
                </div>
              )}

           </div>
        ))}
      </div>
    </div>
  );
}
