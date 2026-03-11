import { PlayCircle, Volume2, Calendar, Target, TrendingUp, AlertCircle, FileText } from 'lucide-react';

export default function AIReport() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Weekly AI Insights</h1>
        <p className="text-muted">Personalized learning summary generated for March 2nd - March 8th.</p>
      </div>

      <div className="card bg-gradient-to-br from-primary to-secondary text-white overflow-hidden relative" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', border: 'none' }}>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-warning/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
           
           <div className="flex flex-col justify-center">
             <div className="badge mb-4 w-max" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
               <Calendar size={14} className="inline mr-2" /> Week 12 Report
             </div>
             
             <h2 className="text-3xl font-bold mb-4" style={{ color: 'white' }}>Your Learning Recap</h2>
             <p className="text-lg mb-6 text-white/80 leading-relaxed">
               Hello Rahul. This week you studied for 9 hours and 15 mins. Your strongest subject is NLP. However, your Physics performance dropped.
             </p>
             
             <div className="flex gap-4">
                <button className="btn w-max flex items-center gap-2" style={{ background: 'white', color: 'var(--primary)' }}>
                   <PlayCircle size={20} /> Watch Video Report
                </button>
                <button className="icon-btn w-12 h-12 rounded-full border border-white/20 text-white hover:bg-white/10 flex justify-center items-center">
                   <Volume2 size={20} />
                </button>
             </div>
           </div>

           <div className="flex items-center justify-center">
              {/* Simulated generated video thumbnail */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/20 shadow-2xl cursor-pointer group">
                 <img 
                   src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                   alt="AI Generated Report Avatar" 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="bg-white/20 backdrop-blur p-4 rounded-full">
                       <PlayCircle size={40} className="text-white fill-white/20" />
                    </div>
                 </div>
                 
                 <div className="absolute bottom-3 left-3 bg-black/70 px-2 py-1 rounded text-xs text-white backdrop-blur">
                   Generated 2h ago • 1:45
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
         <div className="card">
            <h4 className="flex items-center gap-2 mb-4 text-success font-semibold">
               <TrendingUp size={20} /> Accomplishments
            </h4>
            <ul className="text-sm flex flex-col gap-3 text-text-main">
               <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0"/> Completed 4 Quizzes with &gt;85% accuracy.</li>
               <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0"/> Maintained a 7-day learning streak.</li>
               <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0"/> Climbed 3 spots on the class leaderboard.</li>
            </ul>
         </div>
         
         <div className="card">
            <h4 className="flex items-center gap-2 mb-4 text-warning font-semibold">
               <AlertCircle size={20} /> Needs Attention
            </h4>
            <ul className="text-sm flex flex-col gap-3 text-text-main">
               <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0"/> Physics Assignment 4 is pending.</li>
               <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0"/> Watch time on 'Activation Functions' was below average (skipped sections?).</li>
            </ul>
         </div>

         <div className="card bg-card-bg">
            <h4 className="flex items-center gap-2 mb-4 text-accent font-semibold">
               <Target size={20} /> Next Steps
            </h4>
            <div className="flex flex-col gap-2">
               <button className="btn btn-primary w-full text-sm justify-start flex gap-2">
                 <FileText size={16} /> Resume Physics Ch. 2
               </button>
               <button className="btn btn-outline w-full text-sm justify-start flex gap-2" style={{ background: 'white' }}>
                 <PlayCircle size={16} /> Rewatch Activation Functions
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
