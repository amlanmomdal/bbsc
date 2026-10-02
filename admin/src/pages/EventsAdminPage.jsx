import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Plus, Search, Edit2, Trash2, Calendar, MapPin, Clock, RefreshCw, Upload } from 'lucide-react';
import { Modal } from '../components/Modal';
import { resolveImageUrl } from '../utils/imageUtils';

export const EventsAdminPage = ({ events = [], onSaveEvent, onDeleteEvent, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (err) {
        console.warn('[Events] Failed to refresh events from API', err);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const initialFormState = {
    id: null,
    _id: null,
    title: '',
    shortTitle: '',
    fullDate: '',
    month: 'NOV',
    day: '12',
    status: 'upcoming',
    category: 'Festivals',
    location: 'Burul Central Ground',
    time: '07:00 PM IST',
    description: '',
    image: '/images/kali_puja.jpg'
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setCurrentEvent(null);
    setFormData(initialFormState);
    setSelectedFile(null);
    setFilePreview(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setCurrentEvent(evt);
    setFormData({
      id: evt.id || evt._id,
      _id: evt._id || evt.id,
      title: evt.title || '',
      shortTitle: evt.shortTitle || evt.title || '',
      fullDate: evt.fullDate || '',
      month: evt.month || 'NOV',
      day: evt.day || '12',
      status: evt.status || 'upcoming',
      category: evt.category || 'Festivals',
      location: evt.location || 'Burul, South 24 Parganas',
      time: evt.time || '10:00 AM IST',
      description: evt.description || '',
      image: evt.image || '/images/kali_puja.jpg'
    });
    setSelectedFile(null);
    setFilePreview(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      Swal.fire({
        title: 'Validation Required',
        text: 'Please enter an event name / title.',
        icon: 'warning',
        confirmButtonColor: '#1e3a8a'
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSaveEvent({
        ...formData,
        imageFile: selectedFile
      });
      setIsModalOpen(false);
      Swal.fire({
        title: 'Saved Successfully!',
        text: currentEvent ? 'Event / Festival details updated.' : 'New Event / Festival created successfully.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save event. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (!e) return false;
    const matchesSearch = (e.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (e.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (e.shortTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resolveImageSrc = (imgVal, preview) => {
    if (preview) return preview;
    return resolveImageUrl(imgVal, '/images/kali_puja.jpg');
  };

  return (
    <div>
      <div className="page-action-header">
        <div className="page-title-group">
          <h1>Events & Festivals Manager</h1>
          <p>Full Admin management for BBSC scheduled events, Pujas, and competitions with MongoDB Atlas persistence & file unlinking.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn-secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh events from live database"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="search-input-box">
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Search events by title, short title, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="select-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Event Statuses</option>
          <option value="upcoming">Upcoming Events</option>
          <option value="past">Past Events</option>
        </select>
      </div>

      {/* Events Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event Info & Banner</th>
                <th>Short Title</th>
                <th>Category</th>
                <th>Scheduled Date</th>
                <th>Time & Location</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No events found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const evtId = evt.id || evt._id;
                  return (
                    <tr key={evtId}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={resolveImageSrc(evt.image)} 
                            alt={evt.title} 
                            style={{ width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover' }} 
                          />
                          <div>
                            <strong>{evt.title}</strong>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {evt.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#1e3a8a', fontSize: '0.85rem' }}>
                          {evt.shortTitle || evt.title}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-info">{evt.category}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600' }}>
                          <Calendar size={14} color="#64748b" />
                          {evt.fullDate || `${evt.month} ${evt.day}`}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Clock size={13} color="#64748b" /> {evt.time}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b' }}>
                            <MapPin size={13} color="#64748b" /> {evt.location}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${evt.status === 'upcoming' ? 'badge-success' : 'badge-danger'}`}>
                          {evt.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button className="btn-secondary btn-sm" onClick={() => handleOpenEdit(evt)}>
                            <Edit2 size={14} /> Edit
                          </button>
                          <button className="btn-danger btn-sm" onClick={() => onDeleteEvent(evtId)}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentEvent ? 'Edit Event / Festival Details' : 'Create New Event / Festival'}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? 'Saving to Database...' : 'Save Event / Festival'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group full">
            <label>Event Name / Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Grand Kali Puja & Illumination Festival 2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Short Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Kali Puja '26"
              value={formData.shortTitle}
              onChange={(e) => setFormData({ ...formData, shortTitle: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              className="form-control"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Festivals">Festivals</option>
              <option value="Competitions">Competitions</option>
              <option value="Ceremony">Ceremony</option>
              <option value="Social Work">Social Work</option>
              <option value="Cultural">Cultural</option>
            </select>
          </div>

          <div className="form-group">
            <label>Event Scheduled Date * (YYYY-MM-DD)</label>
            <input
              type="date"
              className="form-control"
              value={formData.fullDate}
              onChange={(e) => setFormData({ ...formData, fullDate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Event Time</label>
            <input
              type="text"
              className="form-control"
              placeholder="07:00 PM IST"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>

          <div className="form-group full">
            <label>Location / Venue</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Burul Central Ground & Auditorium"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Cover Image File Upload Box */}
          <div className="form-group full">
            <label>Upload Event Cover Image File (multipart/form-data)</label>
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '1.25rem', textAlign: 'center', background: '#f8fafc' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="event-image-file-input"
                style={{ display: 'none' }}
              />
              <label htmlFor="event-image-file-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Upload size={24} color="#2563eb" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e3a8a' }}>
                  {selectedFile ? `Selected File: ${selectedFile.name}` : 'Click to Upload Event Cover Image File'}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Directly saved to server disk under /uploads/events/ and unlinked upon replacement/deletion
                </span>
              </label>
            </div>
          </div>

          {/* Image Preview Box */}
          <div className="form-group full" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#eff6ff', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
            <img 
              src={resolveImageSrc(formData.image, filePreview)} 
              alt="Preview" 
              style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} 
            />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e3a8a' }}>Cover Image Location / Path:</div>
              <div style={{ fontSize: '0.78rem', color: '#3b82f6', wordBreak: 'break-all' }}>
                {filePreview ? `New Upload Preview (${selectedFile?.name})` : (formData.image || 'None selected')}
              </div>
            </div>
          </div>

          <div className="form-group full">
            <label>Or Provide Static Image URL</label>
            <input
              type="text"
              className="form-control"
              placeholder="/images/kali_puja.jpg or https://..."
              value={formData.image}
              onChange={(e) => {
                setSelectedFile(null);
                setFilePreview(null);
                setFormData({ ...formData, image: e.target.value });
              }}
            />
          </div>

          <div className="form-group full">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Provide detailed information about rituals, highlights, or schedules..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>
        </form>
      </Modal>
    </div>
  );
};
