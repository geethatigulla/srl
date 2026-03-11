import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, CheckCircle2, ChevronDown, ChevronUp, Lock, FileText, CheckSquare, MessageSquare } from 'lucide-react';

const subjects = [
  {
    id: 1,
    name: 'Machine Learning Basics',
    progress: 100,
    chapters: [
      { id: 101, title: 'Introduction to ML', duration: '15m', completed: true, type: 'video' },
      { id: 102, title: 'Supervised vs Unsupervised', duration: '20m', completed: true, type: 'video' },
      { id: 103, title: 'Basics Quiz', duration: '10 Qs', completed: true, type: 'quiz' },
    ]
  },
  {
    id: 2,
    name: 'Neural Networks Architecture',
    progress: 45,
    chapters: [
      { id: 201, title: 'Perceptrons', duration: '25m', completed: true, type: 'video' },
      { id: 202, title: 'Activation Functions', duration: '18m', completed: false, type: 'video', current: true },
      { id: 203, title: 'Backpropagation Intuition', duration: '30m', completed: false, type: 'video', locked: true },
      { id: 204, title: 'Architecture Quiz', duration: '15 Qs', completed: false, type: 'quiz', locked: true },
    ]
  },
  {
    id: 3,
    name: 'Deep Learning Practical',
    progress: 0,
    locked: true,
    chapters: [
      { id: 301, title: 'Intro to PyTorch', duration: '40m', completed: false, type: 'video', locked: true },
      { id: 302, title: 'Your First Model', duration: 'Assignment', completed: false, type: 'assignment', locked: true },
    ]
  }
];

export default function LearningProgress() {
  const [expanded, setExpanded] = useState(2); // ID of expanded subject
  const navigate = useNavigate();

  const handleInteract = (item) => {
    if (item.locked) return;
    if (item.type === 'video') {
      navigate(`/student/video/${item.id}`);
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
                onClick={() => !subject.locked && setExpanded(expanded === subject.id ? null : subject.id)}
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
                        onClick={() => handleInteract(ch)}
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
