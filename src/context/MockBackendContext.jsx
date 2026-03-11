import { createContext, useContext, useState } from 'react';

const MockBackendContext = createContext();

export const useMockBackend = () => useContext(MockBackendContext);

export const MockBackendProvider = ({ children }) => {
  // Simulating backend data
  const [users, setUsers] = useState([
    { id: 1, name: 'Dr. Smith', email: 'teacher@edu.com', password: 'password', role: 'teacher' },
    { id: 2, name: 'Rahul Sharma', email: 'student@edu.com', password: 'password', role: 'student' }
  ]);

  const [clusters, setClusters] = useState([
    { code: 'AI-ML-B-2026', name: 'AI & ML Section B', teacherId: 1, students: [2] }
  ]);

  // Phase 1 & 2: Telemetry Event Store
  const [events, setEvents] = useState([]);
  
  // Phase 4: Simulated "Analytics Processor" state for real-time dashboard
  const [processedMetrics, setProcessedMetrics] = useState({
    activeStudents: 0,
    watchingCount: 0,
    quizzingCount: 0,
    idleCount: 0,
    systemLoad: 0
  });

  const [subjects] = useState([
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
  ]);

  const [currentUser, setCurrentUser] = useState(null);

  // Telemetry Ingestion API (Simulated)
  const logEvent = (eventData) => {
    setEvents(prev => [...prev, eventData]);
    
    // Phase 4: Simulated Stream Processor
    // This logic runs "on the edge" as events arrive
    setProcessedMetrics(prev => {
      const newMetrics = { ...prev };
      
      // Update counts based on incoming event types
      if (eventData.event_type.startsWith('video_')) newMetrics.watchingCount++;
      if (eventData.event_type.startsWith('quiz_')) newMetrics.quizzingCount++;
      if (eventData.event_type === 'idle_state') newMetrics.idleCount++;
      
      // Simulate pipeline load
      newMetrics.systemLoad = Math.min(100, (events.length % 100) + 1);
      
      return newMetrics;
    });
  };

  // Helper to fetch live events for real-time dashboard (Phase 11)
  const getRecentEvents = (limit = 50) => {
    return [...events].reverse().slice(0, limit);
  };

  // Phase 5 & 6: Compute SRL Dimensions dynamically from events
  const computeStudentSRL = (studentId) => {
    const studentEvents = events.filter(e => e.student_id === studentId);
    
    // Planning: Looking ahead and organizing
    const planningEvents = studentEvents.filter(e => ['chapter_preview', 'assignment_view'].includes(e.event_type)).length;
    const planning = Math.min(100, 30 + (planningEvents * 10));

    // Monitoring: Tracking own understanding
    const quizEvents = studentEvents.filter(e => e.event_type === 'quiz_submit').length;
    const pollEvents = studentEvents.filter(e => e.event_type === 'poll_answer').length;
    const monitoring = Math.min(100, 40 + (quizEvents * 15) + (pollEvents * 10));

    // Control: Strategic adjustments (Rewinding, Pausing, Handling confusion)
    const rewindEvents = studentEvents.filter(e => e.event_type === 'video_rewind').length;
    const confusionSpots = studentEvents.filter(e => e.event_type === 'confusion_spot').length;
    const control = Math.min(100, 50 + (rewindEvents * 5) - (confusionSpots * 10)); // Confusion penalizes control if not resolved

    // Reflection: Summarizing and reacting to learning
    const completionEvents = studentEvents.filter(e => e.event_type === 'video_complete' || e.event_type === 'assignment_submit').length;
    const reflection = Math.min(100, 20 + (completionEvents * 20) + (pollEvents * 5));

    // Motivation: Overall engagement volume and velocity
    const motivation = Math.min(100, 50 + (studentEvents.length / 5));

    return { planning, monitoring, control, reflection, motivation };
  };

  // Phase 8: Dynamic Behavior Clustering (Simulated K-Means)
  const getBehaviorClusters = () => {
    const students = users.filter(u => u.role === 'student');
    const clusters = {
      'Strategic Learners': [],
      'Passive Learners': [],
      'At Risk': [],
      'Inconsistent': []
    };

    students.forEach(s => {
      const srl = computeStudentSRL(s.id);
      const avg = (srl.planning + srl.monitoring + srl.control + srl.reflection) / 4;
      
      if (avg > 75 && srl.planning > 70) clusters['Strategic Learners'].push(s);
      else if (srl.motivation < 40 || avg < 40) clusters['At Risk'].push(s);
      else if (srl.reflection < 50) clusters['Passive Learners'].push(s);
      else clusters['Inconsistent'].push(s);
    });

    return Object.entries(clusters).map(([name, members]) => ({
      name,
      value: members.length,
      members: members.map(m => m.name)
    }));
  };

  // Authentication
  const login = async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          setCurrentUser(user);
          resolve({ success: true, user });
        } else {
          resolve({ success: false, error: 'Invalid credentials' });
        }
      }, 500); 
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerTeacher = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = { id: Date.now(), ...data, role: 'teacher', password: 'password' };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        resolve({ success: true, user: newUser });
      }, 800);
    });
  };

  const createCluster = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCode = `CLS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const newCluster = { ...data, code: newCode, teacherId: currentUser.id, students: [] };
        setClusters(prev => [...prev, newCluster]);
        resolve({ success: true, cluster: newCluster });
      }, 800);
    });
  };

  const registerStudent = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const clusterIdx = clusters.findIndex(c => c.code === data.joinCode);
        if (clusterIdx === -1) {
          resolve({ success: false, error: 'Invalid class code' });
          return;
        }

        const newUser = { id: Date.now(), ...data, role: 'student', password: 'password' };
        setUsers(prev => [...prev, newUser]);
        
        // Add student to cluster
        const newClusters = [...clusters];
        newClusters[clusterIdx].students.push(newUser.id);
        setClusters(newClusters);
        
        setCurrentUser(newUser);
        resolve({ success: true, user: newUser });
      }, 800);
    });
  };

  return (
    <MockBackendContext.Provider value={{
      currentUser, users, login, logout, registerTeacher, createCluster, registerStudent,
      logEvent, getRecentEvents, computeStudentSRL, getBehaviorClusters, events, subjects, processedMetrics
    }}>
      {children}
    </MockBackendContext.Provider>
  );
};


