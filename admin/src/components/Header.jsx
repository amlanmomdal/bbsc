import React from 'react';
import { Bell, ExternalLink, ShieldCheck } from 'lucide-react';

export const Header = ({ title, subtitle, user }) => {
  return (
    <header className="admin-header">
      <div className="header-title-container">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="header-right">
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            fontSize: '0.78rem', 
            color: '#15803d', 
            background: '#f0fdf4', 
            padding: '0.4rem 0.75rem', 
            borderRadius: '20px', 
            border: '1px solid #bbf7d0',
            fontWeight: '600' 
          }} 
          title="Automatic session logout after 5 minutes of inactivity for security"
        >
          <ShieldCheck size={16} color="#16a34a" />
          <span>5m Auto-Logout Active</span>
        </div>

        <a 
          href="http://localhost:5173" 
          target="_blank" 
          rel="noreferrer" 
          className="btn-secondary btn-sm"
          title="Open Main Public Website"
        >
          <ExternalLink size={15} />
          <span>Live Site</span>
        </a>

        <div className="admin-user-profile">
          <img 
            src={user?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"} 
            alt={user?.name || "Admin"} 
            className="user-avatar"
          />
          <div className="user-info">
            <div className="user-name">{user?.name || "Amlan Mondal"}</div>
            <div className="user-role">{user?.role || "Super Admin"}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
