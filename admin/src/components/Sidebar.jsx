import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Palette,
  Trophy,
  Image as ImageIcon,
  Users,
  UserCheck,
  Mail,
  Settings,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, unreadMessagesCount, pendingMembershipsCount, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'competitions', label: 'Cultural Competitions', icon: Palette },
    { id: 'events', label: 'Events & Festivals', icon: Calendar },
    { id: 'winners', label: 'Competition Winners', icon: Trophy },
    { id: 'gallery', label: 'Gallery Photos', icon: ImageIcon },
    { id: 'committee', label: 'Committee Roster', icon: Users },
    { id: 'memberships', label: 'Memberships', icon: UserCheck, count: pendingMembershipsCount },
    { id: 'messages', label: 'Visitor Messages', icon: Mail, count: unreadMessagesCount },
    { id: 'settings', label: 'Club Settings', icon: Settings },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <img 
          src="/images/bbsc_logo.png" 
          alt="BBSC Logo" 
          style={{ width: '52px', height: '52px', objectFit: 'contain', background: 'transparent', filter: 'drop-shadow(0 2px 8px rgba(245, 158, 11, 0.5))' }} 
        />
        <div>
          <h1 className="sidebar-brand-title">BBSC Admin</h1>
          <span className="sidebar-brand-sub">Management Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={19} />
              <span className="nav-text">{item.label}</span>
              {item.count > 0 && (
                <span className="nav-item-badge">{item.count}</span>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }} onClick={onLogout}>
          <LogOut size={19} />
          <span className="nav-text">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
