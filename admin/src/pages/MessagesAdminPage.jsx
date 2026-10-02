import React, { useState } from 'react';
import { Search, Mail, Trash2, CheckCircle, MailOpen, User, Phone } from 'lucide-react';

export const MessagesAdminPage = ({ messages, onToggleRead, onDeleteMessage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRead, setFilterRead] = useState('all');

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRead = filterRead === 'all' || 
                        (filterRead === 'unread' && !msg.isRead) ||
                        (filterRead === 'read' && msg.isRead);
    return matchesSearch && matchesRead;
  });

  return (
    <div>
      <div className="page-action-header">
        <div className="page-title-group">
          <h1>Visitor Inquiries Inbox</h1>
          <p>Read and respond to feedback and queries received via the BBSC Contact Us form.</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="search-input-box">
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Search messages by sender name, subject, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="select-filter"
          value={filterRead}
          onChange={(e) => setFilterRead(e.target.value)}
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread Messages</option>
          <option value="read">Read Messages</option>
        </select>
      </div>

      {/* Messages Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredMessages.length === 0 ? (
          <div className="table-card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            No messages found matching your criteria.
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div 
              key={msg.id} 
              className="table-card" 
              style={{ 
                padding: '1.5rem', 
                borderLeft: msg.isRead ? '4px solid #cbd5e1' : '4px solid #2563eb',
                backgroundColor: msg.isRead ? '#ffffff' : '#f8fafc'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>{msg.subject}</h3>
                    {!msg.isRead && (
                      <span className="badge badge-warning">New Unread</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748b', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600', color: '#1e293b' }}>
                      <User size={14} /> {msg.name}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Mail size={14} /> {msg.email}
                    </span>
                    {msg.phone && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Phone size={14} /> {msg.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginRight: '0.5rem' }}>
                    Received: {msg.date}
                  </span>
                  <button className="btn-secondary btn-sm" onClick={() => onToggleRead(msg.id)}>
                    {msg.isRead ? <Mail size={14} /> : <MailOpen size={14} />}
                    {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button className="btn-danger btn-sm" onClick={() => onDeleteMessage(msg.id)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>

              <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', fontSize: '0.92rem', color: '#334155', lineHeight: '1.6' }}>
                {msg.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
