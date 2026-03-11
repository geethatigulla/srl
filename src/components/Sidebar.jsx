import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText as FileTextIcon,
  Settings,
  BarChart2,
  Trophy,
  Users,
  Activity,
  BrainCircuit,
  Video
} from 'lucide-react';

const TEACHER_NAV = [
  { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
  { name: 'Courses', path: '/teacher/courses', icon: BookOpen },
  { name: 'Class Analytics', path: '/teacher/analytics', icon: BarChart2 },
  { name: 'Live Monitor', path: '/teacher/live', icon: Activity },
  { name: 'SRL Analytics', path: '/teacher/advanced', icon: BrainCircuit },
  { name: 'Video Data', path: '/teacher/video-analytics', icon: Video },
  { name: 'Behavior', path: '/teacher/behavior', icon: Users },
  { name: 'Settings', path: '/teacher/settings', icon: Settings },
];

const STUDENT_NAV = [
  { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
  { name: 'Progress', path: '/student/progress', icon: BookOpen },
  { name: 'Leaderboard', path: '/student/leaderboard', icon: Trophy },
  { name: 'AI Report', path: '/student/report', icon: FileTextIcon },
  { name: 'Settings', path: '/student/settings', icon: Settings },
];

export default function Sidebar({ role }) {
  const location = useLocation();
  const navItems = role === 'teacher' ? TEACHER_NAV : STUDENT_NAV;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="flex items-center gap-2">
          <BarChart2 size={24} color="var(--accent)" />
          EduMetrics
        </span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
