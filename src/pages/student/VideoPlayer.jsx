import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Maximize, Volume2, CheckCircle, ArrowLeft } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { useMockBackend } from '../../context/MockBackendContext';

export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [maxWatched, setMaxWatched] = useState(0); 
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [pollAnswered, setPollAnswered] = useState(false);
  const [duration, setDuration] = useState(0);
  const [pauseCount, setPauseCount] = useState(0);
  const [watchHeatmap, setWatchHeatmap] = useState({}); // Tracking 10s segments
  const [confusionSpots, setConfusionSpots] = useState(new Set());
  
  const { track } = useTelemetry();
  const { subjects } = useMockBackend();
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Find course and chapter metadata
  const chapterId = parseInt(id);
  const course = subjects.find(s => s.chapters.find(ch => ch.id === chapterId));
  const courseId = course?.id || 'unknown';

  const metadataBase = { course_id: courseId, chapter_id: chapterId };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(e => {
        console.error("Playback failed", e);
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // Phase 5: Dropout Tracking on Unmount
  useEffect(() => {
    return () => {
      if (progress < 95 && progress > 5) {
        track('video_dropout', { ...metadataBase, dropout_timestamp: `${progress.toFixed(1)}%` });
      }
    };
  }, [progress, track, metadataBase]);

  const handleTimeUpdate = () => {
    if (!videoRef.current || duration === 0) return;
    const currentProgress = (videoRef.current.currentTime / duration) * 100;
    
    // Interrupt for quiz at 45%
    if (currentProgress >= 45 && !quizAnswered && !showQuiz) {
       setIsPlaying(false);
       setShowQuiz(true);
       track('quiz_start', { ...metadataBase, video_timestamp: '45%' });
       return;
    }
    // Interrupt for poll at 75%
    if (currentProgress >= 75 && !pollAnswered && quizAnswered && !showQuiz) {
       setIsPlaying(false);
       setShowQuiz(true);
       track('poll_start', { ...metadataBase, video_timestamp: '75%' });
       return;
    }
    
    setProgress(currentProgress);
    setMaxWatched(Math.max(currentProgress, maxWatched));
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(100);
    track('video_complete', { ...metadataBase });
  };

  const togglePlay = () => {
    if (showQuiz && (!quizAnswered || !pollAnswered && progress >= 75)) return; // Block playing
    if (progress >= 100 && videoRef.current) {
       videoRef.current.currentTime = 0;
       setProgress(0);
    }
    
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      track('video_play', { ...metadataBase, video_timestamp: `${progress.toFixed(1)}%` });
    } else {
      track('video_pause', { ...metadataBase, video_timestamp: `${progress.toFixed(1)}%` });
    }
  };

  const handleTimelineClick = (e) => {
    if (!videoRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    
    // Non-skippable logic: Can only seek backwards or up to maxWatched
    if (percentage <= maxWatched) {
       track('video_rewind', { ...metadataBase, from_timestamp: `${progress.toFixed(1)}%`, to_timestamp: `${percentage.toFixed(1)}%` });
       videoRef.current.currentTime = (percentage / 100) * duration;
       setProgress(percentage);
    } else {
       // Non-skippable warning tracked
       track('video_skip_attempt', { ...metadataBase, attempted_timestamp: `${percentage.toFixed(1)}%` });
       videoRef.current.currentTime = (maxWatched / 100) * duration;
       setProgress(maxWatched);
    }
  };

  const handleAnswer = (correct, isPoll = false) => {
    if (isPoll) {
       setPollAnswered(true);
       setShowQuiz(false);
       track('poll_answer', { ...metadataBase, feedback: correct ? 'yes' : 'no' });
       setIsPlaying(true);
       return;
    }

    setQuizAnswered(true);
    setShowQuiz(false);
    track('quiz_answer', { ...metadataBase, correct, video_timestamp: `${progress.toFixed(1)}%` });
    track('quiz_submit', { ...metadataBase, correct, video_timestamp: `${progress.toFixed(1)}%` });
    
    if (!correct) {
      alert("Incorrect, but since this is a demo, we will let you proceed.");
    }
    setIsPlaying(true);
  };

  const toggleFullScreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-outline mb-6 flex items-center gap-2"
        style={{ padding: '0.4rem 0.8rem' }}
      >
        <ArrowLeft size={16} /> Back to Course
      </button>

      <div 
        ref={containerRef}
        className="card p-0 overflow-hidden bg-black text-white aspect-video relative flex flex-col justify-between shadow-lg border border-border group"
      >
        {/* Real HTML5 Video element */}
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />

        {/* Play Button Overlay (when paused) */}
        {!isPlaying && !showQuiz && progress < 100 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 p-5 rounded-full backdrop-blur-sm transition-transform hover:scale-110">
              <Play size={48} className="text-white" fill="white" />
            </div>
          </div>
        )}
        
        {/* Completion Screen */}
        {progress >= 100 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-10">
            <div className="text-center p-8 rounded-xl">
              <CheckCircle size={64} className="text-success mx-auto mb-4" />
              <h2 className="text-white text-3xl font-bold mb-2">Lesson Completed!</h2>
              <p className="text-gray-300 text-lg">+100 XP added to your ranking</p>
              <button 
                onClick={() => {
                  setProgress(0);
                  setMaxWatched(0);
                  setQuizAnswered(false);
                  setPollAnswered(false);
                  if(videoRef.current) videoRef.current.currentTime = 0;
                  setIsPlaying(true);
                }} 
                className="btn btn-primary mt-6 mx-auto flex items-center gap-2"
              >
                Watch Again
              </button>
            </div>
          </div>
        )}

        {/* Inline Quiz / Poll Overlay */}
        {showQuiz && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-8 text-center z-20 backdrop-blur-lg cursor-default" onClick={e => e.stopPropagation()}>
              <div className="card text-text-main w-full max-w-lg bg-card-bg shadow-2xl animate-in fade-in zoom-in duration-300">
                {!quizAnswered ? (
                  <>
                    <div className="badge badge-risk-medium mb-3 inline-block">Knowledge Check</div>
                    <h3 className="mb-6 font-bold text-xl text-text-main">What is the primary function of an activation function in a perceptron?</h3>
                    
                    <div className="flex flex-col gap-3">
                      <button className="btn btn-outline justify-start text-left p-4 hover:bg-primary/5 hover:border-primary transition-all" onClick={() => handleAnswer(false)}>
                         <span className="font-bold mr-2 text-primary">A.</span> To calculate the error rate
                      </button>
                      <button className="btn btn-outline justify-start text-left p-4 hover:bg-primary/5 hover:border-primary transition-all" onClick={() => handleAnswer(true)}>
                         <span className="font-bold mr-2 text-primary">B.</span> To introduce non-linearity into the network
                      </button>
                      <button className="btn btn-outline justify-start text-left p-4 hover:bg-primary/5 hover:border-primary transition-all" onClick={() => handleAnswer(false)}>
                         <span className="font-bold mr-2 text-primary">C.</span> To store weights and biases
                      </button>
                    </div>
                  </>
                ) : !pollAnswered ? (
                  <>
                    <div className="badge border-accent text-accent bg-accent/10 mb-3 inline-block">Quick Poll</div>
                    <h3 className="mb-6 font-bold text-xl text-text-main">Do you understand the concept of non-linearity so far?</h3>
                    
                    <div className="flex flex-col gap-3">
                      <button className="btn btn-outline justify-center text-center p-4 hover:bg-success/5 hover:border-success transition-all" onClick={() => handleAnswer(true, true)}>
                         Yes, entirely clear
                      </button>
                      <button className="btn btn-outline justify-center text-center p-4 hover:bg-warning/5 hover:border-warning transition-all" onClick={() => handleAnswer(false, true)}>
                         No, I need more explanation
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
        )}

        {/* Custom Video Controls */}
        <div className="relative z-10 w-full p-4 mt-auto inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          
          {/* Timeline */}
          <div 
            className="w-full h-2 bg-white/20 rounded-full mb-4 cursor-pointer relative group/timeline"
            onClick={handleTimelineClick}
          >
            {/* Hover hit area expansion */}
            <div className="absolute inset-x-0 -inset-y-2 z-10" />

            {/* Max Read Progress (Buffer visual) */}
            <div className="absolute left-0 top-0 h-full bg-white/40 rounded-full transition-all duration-300" style={{ width: `${maxWatched}%` }} />
            
            {/* Current Progress bar */}
            <div className="absolute left-0 top-0 h-full bg-accent rounded-full transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(74,144,226,0.6)]" style={{ width: `${progress}%` }}>
               {/* Scrubber Knob */}
               <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-md scale-0 group-hover/timeline:scale-100 transition-transform" />
            </div>
            
            {/* Markers */}
            <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3 bg-warning rounded-sm" style={{ left: '45%', boxShadow: '0 0 4px rgba(0,0,0,0.5)' }} title="Knowledge Check" />
            <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3 bg-success rounded-sm" style={{ left: '75%', boxShadow: '0 0 4px rgba(0,0,0,0.5)' }} title="Poll" />
          </div>

          <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-6">
              <button className="hover:text-accent transition hover:scale-110" onClick={togglePlay}>
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
              </button>
              <div className="flex items-center gap-2 group/volume hover:text-accent transition cursor-pointer">
                <Volume2 size={20} />
                <div className="w-0 overflow-hidden group-hover/volume:w-16 transition-all duration-300 h-1 bg-white/30 rounded-full flex items-center">
                  <div className="w-2/3 h-full bg-current rounded-full" />
                </div>
              </div>
              <span className="text-sm font-medium border-l border-white/20 pl-4">
                 {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
               {confusionSpots.size > 0 && (
                 <span className="text-xs font-bold bg-danger/20 text-danger px-2 py-1 rounded animate-pulse border border-danger/30">
                   Confusion Detected
                 </span>
               )}
               <span className="text-xs font-mono bg-black/60 px-2 py-1 rounded backdrop-blur border border-white/10 hidden md:block text-accent">
                 Telemetry Active
               </span>
               <button className="hover:text-accent transition hover:scale-110 p-1" onClick={toggleFullScreen}>
                 <Maximize size={20} />
               </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mt-6">
         <h3 className="text-lg font-bold">Video Transcript & Actions</h3>
         <p className="text-muted mt-2 text-sm leading-relaxed border-l-4 border-accent pl-4 py-1 bg-card-bg">
           "Welcome back. In this lesson, we will cover the core of neural networks: the activation function. 
           Without an activation function, a neural network is just a linear regression model..."
         </p>
         
         <div className="flex gap-4 mt-6 pt-6 border-t border-border">
            <button className="btn btn-outline flexitems-center gap-2 shadow-sm hover:shadow-md transition-shadow">Download Slides (PDF)</button>
            <button className="btn btn-primary flexitems-center gap-2 shadow-sm hover:shadow-md transition-shadow bg-primary text-white">Ask AI Tutor</button>
         </div>
      </div>
    </div>
  );
}

// Helper utility
function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
