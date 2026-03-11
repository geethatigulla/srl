import { useState } from 'react';
import { Plus, Video, CheckSquare, MessageSquare, Clipboard, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function CourseManagement() {
  const [chapters, setChapters] = useState([
    { 
      id: 1, 
      title: 'Chapter 1: Intro to Neural Networks', 
      content: [
         { type: 'video', title: 'Perceptron Architecture (15m)' },
         { type: 'quiz', title: 'Knowledge Check 1' }
      ]
    },
    { 
      id: 2, 
      title: 'Chapter 2: Backpropagation', 
      content: [
         { type: 'video', title: 'Calculus Refresher (20m)' },
         { type: 'video', title: 'Gradient Descent (25m)' },
         { type: 'assignment', title: 'Implement SGD from scratch' }
      ]
    }
  ]);

  const [newTitle, setNewTitle] = useState('');

  const addChapter = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setChapters([...chapters, { id: Date.now(), title: newTitle, content: [] }]);
    setNewTitle('');
  };

  const getIcon = (type) => {
    switch(type) {
      case 'video': return <Video size={16} className="text-accent" />;
      case 'quiz': return <CheckSquare size={16} className="text-warning" />;
      case 'assignment': return <Clipboard size={16} className="text-success" />;
      case 'poll': return <MessageSquare size={16} className="text-primary" />;
      default: return null;
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Course Management</h1>
          <p className="text-muted">Structure your course, upload videos, and embed quizzes.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={20} /> Preview Course
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {chapters.map((chapter, idx) => (
           <div key={chapter.id} className="card p-0 overflow-hidden border border-border" style={{ boxShadow: 'none' }}>
             <div className="flex justify-between items-center p-4 bg-background-hover border-b border-border">
                <div className="font-semibold" style={{ color: 'var(--primary)' }}>
                   {chapter.title}
                </div>
                <div className="flex gap-2">
                  <button className="icon-btn"><Edit2 size={16}/></button>
                  <button className="icon-btn text-danger hover:text-danger"><Trash2 size={16}/></button>
                </div>
             </div>

             <div className="p-4 flex flex-col gap-2">
                {chapter.content.length === 0 ? (
                  <div className="text-sm text-muted text-center py-4">No content yet. Add a module below.</div>
                ) : (
                  chapter.content.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-md border border-border bg-white hover:bg-background-hover transition-colors">
                      <div className="flex items-center gap-3">
                         {getIcon(item.type)}
                         <span className="font-medium text-sm">{item.title}</span>
                      </div>
                      <button className="icon-btn"><MoreVertical size={16}/></button>
                    </div>
                  ))
                )}
             </div>

             <div className="p-4 pt-0 border-t border-border mt-2 bg-background-hover flex gap-2">
                <button className="flex-1 btn btn-outline btn-sm flex justify-center items-center gap-2" style={{ padding: '0.4rem', fontSize: '0.875rem' }}>
                   <Video size={16} /> Add Video
                </button>
                <button className="flex-1 btn btn-outline btn-sm flex justify-center items-center gap-2" style={{ padding: '0.4rem', fontSize: '0.875rem' }}>
                   <CheckSquare size={16} /> Add Quiz
                </button>
                <button className="flex-1 btn btn-outline btn-sm flex justify-center items-center gap-2" style={{ padding: '0.4rem', fontSize: '0.875rem' }}>
                   <Clipboard size={16} /> Add Assignment
                </button>
                <button className="flex-1 btn btn-outline btn-sm flex justify-center items-center gap-2" style={{ padding: '0.4rem', fontSize: '0.875rem' }}>
                   <MessageSquare size={16} /> Add Poll
                </button>
             </div>
           </div>
        ))}

        <form onSubmit={addChapter} className="flex gap-2 mt-4">
           <input 
             type="text" 
             className="form-control" 
             style={{ flex: 1 }} 
             placeholder="e.g. Chapter 3: Convolutional Nets"
             value={newTitle}
             onChange={e => setNewTitle(e.target.value)}
           />
           <button type="submit" className="btn btn-primary flex justify-center items-center gap-2 shrink-0">
             <Plus size={18} /> New Chapter
           </button>
        </form>
      </div>
    </div>
  );
}
