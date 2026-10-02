import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Plus, Search, Edit2, Trash2, Shield, Upload, RefreshCw } from 'lucide-react';
import { Modal } from '../components/Modal';
import { resolveImageUrl } from '../utils/imageUtils';

export const CommitteeAdminPage = ({ committee = [], onSaveMember, onDeleteMember, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
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
        console.warn('[Committee] Failed to refresh roster from API', err);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const initialFormState = {
    id: null,
    _id: null,
    name: '',
    role: '',
    position: '',
    photo: '',
    contact: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setCurrentMember(null);
    setFormData(initialFormState);
    setSelectedFile(null);
    setFilePreview(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m) => {
    setCurrentMember(m);
    setFormData({
      id: m.id || m._id,
      _id: m._id || m.id,
      name: m.name || '',
      role: m.role || m.position || '',
      position: m.position || m.role || '',
      photo: m.photo || m.image || '',
      contact: m.contact || m.phone || ''
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
    if (!formData.name?.trim()) {
      Swal.fire({
        title: 'Validation Required',
        text: 'Please enter member full name.',
        icon: 'warning',
        confirmButtonColor: '#1e3a8a'
      });
      return;
    }
    if (!formData.role?.trim()) {
      Swal.fire({
        title: 'Validation Required',
        text: 'Please enter a designation role / position.',
        icon: 'warning',
        confirmButtonColor: '#1e3a8a'
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSaveMember({
        ...formData,
        position: formData.role,
        photoFile: selectedFile,
        imageFile: selectedFile
      });
      setIsModalOpen(false);
      Swal.fire({
        title: 'Saved Successfully!',
        text: currentMember ? 'Committee member details updated.' : 'New Executive Committee member added to roster.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save committee member record.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: 'Remove Member?',
      text: 'Are you sure you want to remove this member from the committee roster?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove it!'
    });
    if (res.isConfirmed) {
      await onDeleteMember(id);
      Swal.fire({
        title: 'Removed!',
        text: 'Member removed from roster.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      });
    }
  };

  const filteredCommittee = committee.filter((m) => {
    if (!m) return false;
    const nameStr = (m.name || '').toLowerCase();
    const roleStr = (m.role || m.position || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return nameStr.includes(query) || roleStr.includes(query);
  });

  return (
    <div>
      <div className="page-action-header">
        <div className="page-title-group">
          <h1>Committee Roster Manager</h1>
          <p>Manage BBSC office bearers, designations, and profile photos with MongoDB Atlas persistence.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn-secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh committee from backend API"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Add Committee Member</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="search-input-box">
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Search member name or designation role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Roster Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {filteredCommittee.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '12px', color: '#64748b' }}>
            No committee members found matching your search.
          </div>
        ) : (
          filteredCommittee.map((m) => {
            const memberId = m.id || m._id;
            const rawPhoto = m.photo || m.image;
            const photoSrc = (rawPhoto && typeof rawPhoto === 'string' && rawPhoto.trim() !== '')
              ? resolveImageUrl(rawPhoto)
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || 'Member')}&background=1e293b&color=3b82f6&size=200&bold=true`;
            const memberRole = m.role || m.position || 'Executive Member';

            return (
              <div key={memberId} className="table-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <img 
                  src={photoSrc} 
                  alt={m.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || 'Member')}&background=1e293b&color=3b82f6&size=200&bold=true`;
                  }}
                  style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top center', margin: '0 auto 1rem', border: '3px solid #3b82f6', background: '#f8fafc' }} 
                />
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.4rem' }}>{m.name}</h3>
                <span className="badge badge-info" style={{ marginBottom: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Shield size={12} /> {memberRole}
                </span>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  <button className="btn-secondary btn-sm" onClick={() => handleOpenEdit(m)}>
                    <Edit2 size={14} /> Edit
                  </button>
                  <button className="btn-danger btn-sm" onClick={() => handleDelete(memberId)}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Member Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentMember ? 'Edit Committee Member' : 'Add Committee Member'}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? 'Saving Roster Record...' : 'Save Roster Record'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group full">
            <label>Member Full Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Amlan Mondal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group full">
            <label>Designation Position / Role *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. President, Secretary, Convener, Treasurer..."
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value, position: e.target.value })}
              required
            />
          </div>

          {/* Member Photo Upload Box */}
          <div className="form-group full">
            <label>Upload Member Photo File (multipart/form-data)</label>
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '1.25rem', textAlign: 'center', background: '#f8fafc' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="committee-photo-file-input"
                style={{ display: 'none' }}
              />
              <label htmlFor="committee-photo-file-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Upload size={24} color="#2563eb" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e3a8a' }}>
                  {selectedFile ? `Selected File: ${selectedFile.name}` : 'Click to Upload Member Profile Photo'}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Directly saved to server disk under /uploads/committee/ & unlinked upon deletion
                </span>
              </label>
            </div>
          </div>

          {/* Photo Preview Box */}
          <div className="form-group full" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#eff6ff', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
            <img 
              src={resolveImageUrl(formData.photo, filePreview)} 
              alt="Preview" 
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} 
            />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e3a8a' }}>Profile Photo Location / Source:</div>
              <div style={{ fontSize: '0.78rem', color: '#3b82f6', wordBreak: 'break-all' }}>
                {filePreview ? `New Upload Preview (${selectedFile?.name})` : (formData.photo || 'None selected')}
              </div>
            </div>
          </div>

          <div className="form-group full">
            <label>Or Provide Static Photo URL</label>
            <input
              type="text"
              className="form-control"
              placeholder="https://..."
              value={formData.photo}
              onChange={(e) => {
                setSelectedFile(null);
                setFilePreview(null);
                setFormData({ ...formData, photo: e.target.value });
              }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
