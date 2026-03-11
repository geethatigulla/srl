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

  const [currentUser, setCurrentUser] = useState(null);

  // Telemetry Ingestion API (Simulated)
  const logEvent = (eventData) => {
    setEvents(prev => [...prev, eventData]);
  };

  // Helper to fetch live events for real-time dashboard (Phase 11)
  const getRecentEvents = (limit = 50) => {
    return [...events].reverse().slice(0, limit);
  };

  // Phase 5 & 6: Compute SRL Dimensions dynamically from events
  const computeStudentSRL = (studentId) => {
    const studentEvents = events.filter(e => e.student_id === studentId);
    
    // Simulated dimension calculations based on event heuristics
    const planning = Math.min(100, 50 + studentEvents.filter(e => e.event_type === 'chapter_preview').length * 5);
    const monitoring = Math.min(100, 40 + studentEvents.filter(e => e.event_type === 'quiz_retry').length * 10);
    const control = Math.min(100, 60 + studentEvents.filter(e => e.event_type === 'video_rewind').length * 2);
    const reflection = Math.min(100, 30 + studentEvents.filter(e => e.event_type === 'poll_answer').length * 15);
    const motivation = Math.min(100, 70 + (studentEvents.length > 50 ? 20 : 0)); // Based on sheer volume of activity

    return { planning, monitoring, control, reflection, motivation };
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
      logEvent, getRecentEvents, computeStudentSRL, events
    }}>
      {children}
    </MockBackendContext.Provider>
  );
};


