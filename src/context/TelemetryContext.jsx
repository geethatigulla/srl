import { createContext, useContext, useEffect, useCallback } from 'react';
import { useMockBackend } from './MockBackendContext';

const TelemetryContext = createContext();

export const useTelemetry = () => useContext(TelemetryContext);

export const TelemetryProvider = ({ children }) => {
  const { currentUser, logEvent } = useMockBackend();

  // Core tracking function exposed to components
  const track = useCallback((eventType, metadata = {}) => {
    if (!currentUser || currentUser.role !== 'student') return;

    const event = {
      timestamp: new Date().toISOString(),
      student_id: currentUser.id,
      event_type: eventType,
      ...metadata
    };

    // Send to Mock Backend (Simulating API ingestion)
    logEvent(event);
  }, [currentUser, logEvent]);

  // Global Passive Tracking (Mouse, Scroll, Tab Focus)
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'student') return;

    const handleFocus = () => track('tab_focus');
    const handleBlur = () => track('tab_blur');
    
    // Throttled scroll/mouse tracking to prevent massive event floods in the prototype
    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        const depth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        track('scroll_depth', { depth_percentage: depth });
        scrollTimeout = null;
      }, 2000);
    };

    let idleTimeout;
    const resetIdle = () => {
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => track('idle_state', { duration_sec: 60 }), 60000);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      clearTimeout(scrollTimeout);
      clearTimeout(idleTimeout);
    };
  }, [currentUser, track]);

  return (
    <TelemetryContext.Provider value={{ track }}>
      {children}
    </TelemetryContext.Provider>
  );
};
