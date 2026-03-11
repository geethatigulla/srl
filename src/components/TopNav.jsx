import { Search, Bell, LogOut } from 'lucide-react';
import { useMockBackend } from '../context/MockBackendContext';

export default function TopNav({ user }) {
  const { logout } = useMockBackend();

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('') : 'U';
  };

  return (
    <header className="topbar">
      <div className="header-search hidden md:flex">
        <Search size={18} className="text-muted" />
        <input type="text" placeholder="Search courses, students, assignments..." />
      </div>
      
      <div className="header-actions">
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="profile-avatar border">
            {getInitials(user?.name)}
          </div>
          <span className="font-semibold text-sm hidden md:block">
            {user?.name}
          </span>
          <button className="icon-btn ml-2" onClick={logout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
