import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function Layout({ user, onLogout }) {
  return (
    <div className="app-container">
      <Sidebar role={user.role} />
      <div className="main-wrapper">
        <TopNav user={user} onLogout={onLogout} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
