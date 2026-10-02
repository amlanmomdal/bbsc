import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Plus, Search, Edit2, Trash2, Tag, Calendar, Upload, RefreshCw } from 'lucide-react';
import { Modal } from '../components/Modal';
import { resolveImageUrl } from '../utils/imageUtils';

export const GalleryAdminPage = ({ gallery = [], onSaveGalleryItem, onDeleteGalleryItem, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGalleryItem, setCurrentGalleryItem] = useState(null);
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
        console.warn('[Gallery] Failed to refresh gallery photos from API', err);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const initialFormState = {
    id: null,
    _id: null,
    title: '',
    category: 'Kali Puja',
    shortDescription: '',
    image: '/images/kali_puja.jpg',
    date: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setCurrentGalleryItem(null);
    setFormData(initialFormState);
    setSelectedFile(null);
    setFilePreview(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setCurrentGalleryItem(item);
    setFormData({
      id: item.id || item._id,
      _id: item._id || item.id,
      title: item.title || '',
      category: item.category || 'Kali Puja',
      shortDescription: item.shortDescription || item.description || '',
      image: item.image || '/images/kali_puja.jpg',
      date: item.date || new Date().toISOString().split('T')[0]
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
        text: 'Please enter a photo caption / title.',
        icon: 'warning',
        confirmButtonColor: '#1e3a8a'
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSaveGalleryItem({
        ...formData,
        imageFile: selectedFile
      });
      setIsModalOpen(false);
      Swal.fire({
        title: 'Saved Successfully!',
        text: currentGalleryItem ? 'Gallery photo updated successfully.' : 'New photo published to gallery album.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save gallery photo. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: 'Remove Photo?',
      text: 'Are you sure you want to remove this photo from the gallery album?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove it!'
    });
    if (res.isConfirmed) {
      await onDeleteGalleryItem(id);
      Swal.fire({
        title: 'Removed!',
        text: 'Photo removed from gallery.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      });
    }
  };

  const DEFAULT_CATEGORIES = ['Kali Puja', 'Saraswati Puja', 'Competitions', 'Events', 'Social Work', 'Cultural'];
  const dynamicCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...(gallery || []).map(g => g?.category).filter(Boolean)])
  );

  const filteredGallery = gallery.filter((item) => {
    if (!item) return false;
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.shortDescription || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="page-action-header">
        <div className="page-title-group">
          <h1>Gallery Photos Manager</h1>
          <p>Upload & organize photos showcasing club festivals, competitions, and welfare events with Tag/Category tags and short descriptions.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn-secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh gallery from backend API"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Upload / Add Photo</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="search-input-box">
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Search gallery by title, tag, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="select-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories / Tags</option>
          {dynamicCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Gallery Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {filteredGallery.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '12px', color: '#64748b' }}>
            No gallery items found matching your filters.
          </div>
        ) : (
          filteredGallery.map((item) => {
            const itemId = item.id || item._id;
            return (
              <div key={itemId} className="table-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', paddingTop: '65%', overflow: 'hidden' }}>
                  <img 
                    src={resolveImageUrl(item.image)} 
                    alt={item.title} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <span className="badge badge-info" style={{ position: 'absolute', top: '10px', left: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                    <Tag size={12} /> {item.category || 'Events'}
                  </span>
                </div>
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: '#0f172a' }}>{item.title}</h4>
                    {item.shortDescription && (
                      <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.6rem', lineHeight: '1.4' }}>
                        {item.shortDescription}
                      </p>
                    )}
                    <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} /> {item.date || '2024'}
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="btn-secondary btn-sm" onClick={() => handleOpenEdit(item)}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(itemId)}>
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Upload / Edit Photo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentGalleryItem ? 'Edit Gallery Photo Details' : 'Add New Gallery Photo'}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? 'Publishing Photo...' : (currentGalleryItem ? 'Save Photo Changes' : 'Publish Photo')}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group full">
            <label>Photo Caption / Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Grand Mandap Illumination 2024"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Tag / Category *</label>
            <input
              type="text"
              className="form-control"
              list="admin-gallery-category-list"
              placeholder="Type or select category..."
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
            <datalist id="admin-gallery-category-list">
              {dynamicCategories.map(cat => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.45rem' }}>
              {dynamicCategories.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setFormData({ ...formData, category: cat })}
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 9px',
                    borderRadius: '6px',
                    border: '1px solid ' + (formData.category === cat ? '#2563eb' : '#cbd5e1'),
                    background: formData.category === cat ? '#2563eb' : '#f8fafc',
                    color: formData.category === cat ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Upload Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="form-group full">
            <label>Short Description</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Brief summary or highlight of this photo..."
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            ></textarea>
          </div>

          {/* Photo File Upload Box */}
          <div className="form-group full">
            <label>Upload Photo Image File (multipart/form-data)</label>
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '1.25rem', textAlign: 'center', background: '#f8fafc' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="gallery-file-input"
                style={{ display: 'none' }}
              />
              <label htmlFor="gallery-file-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Upload size={24} color="#2563eb" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e3a8a' }}>
                  {selectedFile ? `Selected File: ${selectedFile.name}` : 'Click to Select & Upload Photo File'}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Saved to server disk under /uploads/gallery/ & unlinked upon deletion
                </span>
              </label>
            </div>
          </div>

          {/* Preview Box */}
          <div className="form-group full" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#eff6ff', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
            <img 
              src={resolveImageUrl(formData.image, filePreview)} 
              alt="Preview" 
              style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} 
            />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e3a8a' }}>Photo Image Source:</div>
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
              placeholder="/images/kali_puja.jpg or https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => {
                setSelectedFile(null);
                setFilePreview(null);
                setFormData({ ...formData, image: e.target.value });
              }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
