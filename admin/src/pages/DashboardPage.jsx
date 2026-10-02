import React from 'react';
import { 
  Users, 
  Calendar, 
  Trophy, 
  Image as ImageIcon, 
  UserCheck, 
  Mail, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react';

export const DashboardPage = ({ 
  events, 
  winners, 
  gallery, 
  committee, 
  memberships, 
  messages, 
  stats,
  setActiveTab 
}) => {
  const pendingMemberships = memberships.filter(m => m.status === 'pending');
  const unreadMessages = messages.filter(m => !m.isRead);
  const upcomingEvents = events.filter(e => e.status === 'upcoming');

  return (
    <div>
      <div className="page-action-header">
        <div className="page-title-group">
          <h1>Club Dashboard</h1>
          <p>Welcome back! Here is a summary of BBSC activity & metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-primary" onClick={() => setActiveTab('events')}>
            <PlusCircle size={17} />
            <span>Add New Event</span>
          </button>
          <button className="btn-secondary" onClick={() => setActiveTab('winners')}>
            <Trophy size={17} />
            <span>Add Winner</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-info">
            <h4>Total Members</h4>
            <div className="metric-number">{stats.membersCount}+</div>
          </div>
          <div className="metric-icon-box blue">
            <Users size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h4>Active Events</h4>
            <div className="metric-number">{events.length}</div>
          </div>
          <div className="metric-icon-box gold">
            <Calendar size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h4>Competition Winners</h4>
            <div className="metric-number">{winners.length}</div>
          </div>
          <div className="metric-icon-box green">
            <Trophy size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h4>Gallery Photos</h4>
            <div className="metric-number">{gallery.length}</div>
          </div>
          <div className="metric-icon-box purple">
            <ImageIcon size={24} />
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Action Items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Pending Membership Applications */}
        <div className="table-card">
          <div className="table-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={18} color="#2563eb" />
              <h3 style={{ fontSize: '1.05rem' }}>Pending Memberships ({pendingMemberships.length})</h3>
            </div>
            <button className="btn-secondary btn-sm" onClick={() => setActiveTab('memberships')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingMemberships.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No pending membership applications.
                    </td>
                  </tr>
                ) : (
                  pendingMemberships.slice(0, 4).map((m) => (
                    <tr key={m.id}>
                      <td>
                        <strong>{m.fullName}</strong>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{m.occupation}</div>
                      </td>
                      <td>{m.phone}</td>
                      <td>{m.date}</td>
                      <td>
                        <span className="badge badge-warning">
                          <Clock size={12} /> Pending
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Visitor Messages */}
        <div className="table-card">
          <div className="table-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} color="#d97706" />
              <h3 style={{ fontSize: '1.05rem' }}>Unread Inquiries ({unreadMessages.length})</h3>
            </div>
            <button className="btn-secondary btn-sm" onClick={() => setActiveTab('messages')}>
              View Inbox <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {unreadMessages.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      All visitor messages have been read!
                    </td>
                  </tr>
                ) : (
                  unreadMessages.slice(0, 4).map((msg) => (
                    <tr key={msg.id}>
                      <td>
                        <strong>{msg.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{msg.email}</div>
                      </td>
                      <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.subject}
                      </td>
                      <td>{msg.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Upcoming Events Overview */}
      <div className="table-card">
        <div className="table-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="#10b981" />
            <h3 style={{ fontSize: '1.05rem' }}>Upcoming Scheduled Events ({upcomingEvents.length})</h3>
          </div>
          <button className="btn-secondary btn-sm" onClick={() => setActiveTab('events')}>
            Manage Events <ArrowRight size={14} />
          </button>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Category</th>
                <th>Scheduled Date</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingEvents.slice(0, 5).map((evt) => (
                <tr key={evt.id}>
                  <td>
                    <strong>{evt.title}</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{evt.time}</div>
                  </td>
                  <td><span className="badge badge-info">{evt.category}</span></td>
                  <td>{evt.fullDate || `${evt.month} ${evt.day}`}</td>
                  <td>{evt.location}</td>
                  <td>
                    <span className="badge badge-success">
                      <CheckCircle size={12} /> Upcoming
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
