import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Palette, 
  Sparkles, 
  Music, 
  BookOpen, 
  Flower2, 
  Smile, 
  Gamepad2, 
  HelpCircle, 
  Camera, 
  FileText, 
  Trophy, 
  Award,
  Upload,
  Image as ImageIcon,
  LayoutGrid,
  List,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { resolveImageUrl } from '../utils/imageUtils';

// Icon Map for dynamic preset icon rendering
const ICON_MAP = {
  Palette,
  Sparkles,
  Music,
  BookOpen,
  Flower2,
  Smile,
  Gamepad2,
  HelpCircle,
  Camera,
  FileText,
  Trophy,
  Award
};

export const CompetitionsAdminPage = ({ competitions = [], onSaveCompetition, onDeleteCompetition, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCompetition, setCurrentCompetition] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  React.useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (err) {
        console.warn('[Competitions] Failed to refresh competitions:', err);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const initialFormState = {
    id: null,
    _id: null,
    title: '',
    icon: 'Palette'
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setCurrentCompetition(null);
    setFormData(initialFormState);
    setSelectedFile(null);
    setFilePreview(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp) => {
    setCurrentCompetition(comp);
    setFormData({
      id: comp.id || comp._id,
      _id: comp._id || comp.id,
      title: comp.title || '',
      icon: comp.icon || 'Palette'
    });
    setSelectedFile(null);
    setFilePreview(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      Swal.fire({
        title: 'Validation Required',
        text: 'Please enter a competition title.',
        icon: 'warning',
        confirmButtonColor: '#1e3a8a'
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSaveCompetition({
        ...formData,
        imageFile: selectedFile
      });
      setIsModalOpen(false);
      Swal.fire({
        title: 'Saved Successfully!',
        text: currentCompetition ? 'Cultural Competition has been updated.' : 'New Cultural Competition master entry created.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save competition. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCompetitions = competitions.filter((c) => {
    return c && c.title ? c.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
  });

  const renderIconElement = (iconVal, customPreview) => {
    if (customPreview) {
      return (
        <img 
          src={customPreview} 
          alt="Icon Preview" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} 
        />
      );
    }

    if (!iconVal) return <Palette size={24} />;

    if (iconVal.startsWith('/uploads/') || iconVal.startsWith('http://') || iconVal.startsWith('https://') || iconVal.startsWith('data:')) {
      const imgSrc = resolveImageUrl(iconVal);
      return (
        <img 
          src={imgSrc} 
          alt="Competition Icon" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} 
        />
      );
    }

    const IconComponent = ICON_MAP[iconVal] || Palette;
    return <IconComponent size={24} />;
  };

  return (
    <div>
      {/* Master Top Header */}
      <div className="page-action-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1>Cultural Competitions Master</h1>
            <span className="badge badge-info" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
              {competitions.length} Total Master Entries
            </span>
          </div>
          <p>Full Admin Master Management for BBSC Cultural Competitions with MongoDB Atlas persistence & image file unlinking.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="view-toggle" style={{ display: 'flex', background: '#e2e8f0', borderRadius: '8px', padding: '3px' }}>
            <button
              className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Cards Grid View"
              style={{ padding: '6px 12px', borderRadius: '6px', background: viewMode === 'grid' ? '#fff' : 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <LayoutGrid size={18} color={viewMode === 'grid' ? '#1e3a8a' : '#64748b'} />
            </button>
            <button
              className={`btn-icon ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table List View"
              style={{ padding: '6px 12px', borderRadius: '6px', background: viewMode === 'table' ? '#fff' : 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <List size={18} color={viewMode === 'table' ? '#1e3a8a' : '#64748b'} />
            </button>
          </div>

          <button
            className="btn-secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh existing competition master entries from database"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Add New Competition</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="search-input-box" style={{ flex: 1 }}>
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Search competition master by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontSize: '0.85rem', fontWeight: 600 }}>
          <CheckCircle2 size={16} /> MongoDB Atlas Connected
        </div>
      </div>

      {/* Grid View Mode */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {filteredCompetitions.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '12px', color: '#64748b' }}>
              No cultural competition master entries found matching your search.
            </div>
          ) : (
            filteredCompetitions.map((comp) => {
              const compId = comp.id || comp._id;

              return (
                <div key={compId} className="table-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '54px', height: '54px', borderRadius: '12px', background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)', flexShrink: 0, overflow: 'hidden' }}>
                      {renderIconElement(comp.icon)}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0, fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{comp.title}</h3>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', wordBreak: 'break-all' }}>
                        {comp.icon?.startsWith('/uploads/') ? 'Uploaded Image File' : `Icon: ${comp.icon}`}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '0.5rem' }}>
                    <button className="btn-secondary btn-sm" onClick={() => handleOpenEdit(comp)}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button className="btn-danger btn-sm" onClick={() => onDeleteCompetition(compId)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Table View Mode */}
      {viewMode === 'table' && (
        <div className="table-container" style={{ marginBottom: '2rem' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Icon Image</th>
                <th>Competition Title</th>
                <th>Icon Source / Path</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompetitions.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No cultural competition master entries found.
                  </td>
                </tr>
              ) : (
                filteredCompetitions.map((comp) => {
                  const compId = comp.id || comp._id;
                  return (
                    <tr key={compId}>
                      <td style={{ width: '60px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#1e3a8a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {renderIconElement(comp.icon)}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>{comp.title}</td>
                      <td style={{ fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace' }}>
                        {comp.icon}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button className="btn-secondary btn-sm" onClick={() => handleOpenEdit(comp)}>
                            <Edit2 size={14} /> Edit
                          </button>
                          <button className="btn-danger btn-sm" onClick={() => onDeleteCompetition(compId)}>
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
      )}

      {/* Add / Edit Competition Master Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentCompetition ? 'Edit Cultural Competition Master' : 'Add New Cultural Competition Master'}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? 'Uploading & Saving to MongoDB...' : 'Save Competition Master'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group full">
            <label>Competition Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Painting Competition or Dance Competition"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group full">
            <label>Upload Icon Image File (Direct multipart/form-data File Upload)</label>
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '1.25rem', textAlign: 'center', background: '#f8fafc' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="icon-master-file-input"
                style={{ display: 'none' }}
              />
              <label htmlFor="icon-master-file-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Upload size={24} color="#2563eb" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e3a8a' }}>
                  {selectedFile ? `Selected: ${selectedFile.name}` : 'Click to Upload Image File'}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Directly saved to server disk and automatically unlinked when deleted
                </span>
              </label>
            </div>
          </div>

          {/* Current / Uploaded Preview Box */}
          <div className="form-group full" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#eff6ff', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', overflow: 'hidden', flexShrink: 0 }}>
              {renderIconElement(formData.icon, filePreview)}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e3a8a' }}>Icon Image Preview & Location:</div>
              <div style={{ fontSize: '0.78rem', color: '#3b82f6', wordBreak: 'break-all' }}>
                {filePreview ? `New Local Upload Preview (${selectedFile?.name})` : (formData.icon || 'None selected')}
              </div>
            </div>
          </div>

          <div className="form-group full">
            <label>Or Choose Preset Vector Symbol</label>
            <select
              className="form-control"
              value={formData.icon.startsWith('/uploads/') ? '' : formData.icon}
              onChange={(e) => {
                setSelectedFile(null);
                setFilePreview(null);
                setFormData({ ...formData, icon: e.target.value });
              }}
            >
              <option value="" disabled>-- Select Preset Symbol (Or Upload Image File Above) --</option>
              <option value="Palette">🎨 Palette (Arts / Painting)</option>
              <option value="Sparkles">✨ Sparkles (Dance / Performing Arts)</option>
              <option value="Music">🎵 Music (Singing / Musical)</option>
              <option value="BookOpen">📖 BookOpen (Recitation / Abriti)</option>
              <option value="Flower2">🌸 Flower2 (Alpona / Traditional Art)</option>
              <option value="Smile">😊 Smile (Fancy Dress / Kids)</option>
              <option value="Gamepad2">🎮 Gamepad2 (Children's Games)</option>
              <option value="HelpCircle">❓ HelpCircle (Quiz Competition)</option>
              <option value="Camera">📷 Camera (Photography)</option>
              <option value="FileText">📄 FileText (Essay / Literature)</option>
              <option value="Trophy">🏆 Trophy (General Award)</option>
              <option value="Award">🎖️ Award (Honors)</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};


