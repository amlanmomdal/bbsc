import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Trash2, Clock, Mail, Phone, MapPin, Sparkles, RefreshCw } from 'lucide-react';

export const MembershipsAdminPage = ({ memberships, onUpdateStatus, onDeleteMembership, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshClick = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } catch (e) {
      console.warn('Error refreshing memberships:', e);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredMemberships = memberships.filter((m) => {
    const matchesSearch = (m.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (m.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (m.phone || '').includes(searchTerm) ||
                          (m.interest || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="page-action-header">
        <div className="page-title-group">
          <h1>Become Member Requests</h1>
          <p>Review and process all membership & volunteer join requests submitted through the BBSC website.</p>
        </div>

        {onRefresh && (
          <button className="btn-secondary" onClick={handleRefreshClick} disabled={refreshing}>
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="search-input-box">
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Search by applicant name, email, phone, or interest..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="select-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Application Statuses</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved Members</option>
          <option value="rejected">Rejected Applications</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Contact Details</th>
                <th>Area of Interest</th>
                <th>Address</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMemberships.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No member requests match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredMemberships.map((m) => (
                  <tr key={m.id || m._id}>
                    <td>
                      <strong style={{ fontSize: '0.95rem' }}>{m.fullName}</strong>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Phone size={13} color="#64748b" /> {m.phone || 'N/A'}
                        </div>
                        {m.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b' }}>
                            <Mail size={13} color="#64748b" /> {m.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#1e3a8a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Sparkles size={13} color="#f59e0b" /> {m.interest || 'General Volunteer'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={13} /> {m.address || 'Burul, South 24 Parganas'}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{m.date || 'Today'}</td>
                    <td>
                      <span className={`badge ${
                        m.status === 'approved' ? 'badge-success' : 
                        m.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {m.status === 'pending' && <Clock size={12} />}
                        {m.status === 'approved' && <CheckCircle size={12} />}
                        {m.status === 'rejected' && <XCircle size={12} />}
                        {m.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        {m.status !== 'approved' && (
                          <button className="btn-secondary btn-sm" style={{ color: '#10b981', borderColor: '#10b981' }} onClick={() => onUpdateStatus(m.id || m._id, 'approved')}>
                            <CheckCircle size={14} /> Approve
                          </button>
                        )}
                        {m.status !== 'rejected' && (
                          <button className="btn-secondary btn-sm" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={() => onUpdateStatus(m.id || m._id, 'rejected')}>
                            <XCircle size={14} /> Reject
                          </button>
                        )}
                        <button className="btn-danger btn-sm" onClick={() => onDeleteMembership(m.id || m._id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
