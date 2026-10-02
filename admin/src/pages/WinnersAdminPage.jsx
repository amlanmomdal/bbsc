import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Trophy, Award } from 'lucide-react';
import { Modal } from '../components/Modal';

export const WinnersAdminPage = ({ winners, onSaveWinner, onDeleteWinner }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWinner, setCurrentWinner] = useState(null);

  const initialFormState = {
    id: null,
    year: '2024',
    competitionId: 1,
    competitionTitle: 'Dance Competition',
    subCategory: 'Category A (Junior - Under 10 Yrs)',
    rank: 1,
    rankLabel: '1st Prize 🥇',
    winnerName: '',
    ageGroup: 'Junior - Group A',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    remarks: 'Outstanding Performance'
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleOpenAdd = () => {
    setCurrentWinner(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (w) => {
    setCurrentWinner(w);
    setFormData({ ...w });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveWinner(formData);
    setIsModalOpen(false);
  };

  const filteredWinners = winners.filter((w) => {
    const matchesSearch = w.winnerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.competitionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = yearFilter === 'All' || w.year === yearFilter;
    return matchesSearch && matchesYear;
  });

  return (
    <div>
      <div className="page-action-header">
        <div className="page-title-group">
          <h1>Competition Winners Manager</h1>
          <p>Add, edit, or remove winners for BBSC annual competitions.</p>
        </div>
        <button className="btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Add New Winner</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="search-input-box">
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Search winner name or competition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="select-filter"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="All">All Years</option>
          <option value="2024">2024 Winners</option>
          <option value="2023">2023 Winners</option>
          <option value="2022">2022 Winners</option>
        </select>
      </div>

      {/* Winners Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Winner Profile</th>
                <th>Year & Competition</th>
                <th>Sub-Category</th>
                <th>Rank / Award</th>
                <th>Remarks</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWinners.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No competition winners found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredWinners.map((w) => (
                  <tr key={w.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img 
                          src={w.photo || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'} 
                          alt={w.winnerName} 
                          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                        <div>
                          <strong>{w.winnerName}</strong>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{w.ageGroup}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div><strong>{w.competitionTitle}</strong></div>
                      <span className="badge badge-info" style={{ fontSize: '0.72rem', marginTop: '2px' }}>
                        Year {w.year}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#475569' }}>{w.subCategory}</div>
                    </td>
                    <td>
                      <span className="badge badge-warning" style={{ fontSize: '0.85rem' }}>
                        <Trophy size={13} /> {w.rankLabel || `${w.rank}st Prize`}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{w.remarks || '—'}</div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button className="btn-secondary btn-sm" onClick={() => handleOpenEdit(w)}>
                          <Edit2 size={14} /> Edit
                        </button>
                        <button className="btn-danger btn-sm" onClick={() => onDeleteWinner(w.id)}>
                          <Trash2 size={14} /> Delete
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

      {/* Add / Edit Winner Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentWinner ? 'Edit Winner Record' : 'Add New Competition Winner'}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit}>Save Winner Record</button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group full">
            <label>Winner Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Riya Mondal"
              value={formData.winnerName}
              onChange={(e) => setFormData({ ...formData, winnerName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Competition Title</label>
            <select
              className="form-control"
              value={formData.competitionTitle}
              onChange={(e) => setFormData({ ...formData, competitionTitle: e.target.value })}
            >
              <option value="Dance Competition">Dance Competition</option>
              <option value="Painting Competition">Painting Competition</option>
              <option value="Singing Competition">Singing Competition</option>
              <option value="Abriti (Recitation)">Abriti (Recitation)</option>
              <option value="Alpona Competition">Alpona Competition</option>
              <option value="Quiz Competition">Quiz Competition</option>
            </select>
          </div>

          <div className="form-group">
            <label>Year</label>
            <input
              type="text"
              className="form-control"
              placeholder="2024"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              required
            />
          </div>

          <div className="form-group full">
            <label>Sub Category / Age Group</label>
            <input
              type="text"
              className="form-control"
              placeholder="Category A (Junior - Under 10 Yrs)"
              value={formData.subCategory}
              onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Rank Position</label>
            <select
              className="form-control"
              value={formData.rank}
              onChange={(e) => {
                const r = Number(e.target.value);
                const labels = { 1: '1st Prize 🥇', 2: '2nd Prize 🥈', 3: '3rd Prize 🥉', 4: 'Special Recognition 🏅' };
                setFormData({ ...formData, rank: r, rankLabel: labels[r] || `${r}th Place` });
              }}
            >
              <option value={1}>1st Prize (Gold)</option>
              <option value={2}>2nd Prize (Silver)</option>
              <option value={3}>3rd Prize (Bronze)</option>
              <option value={4}>Special Recognition</option>
            </select>
          </div>

          <div className="form-group">
            <label>Award Badge Label</label>
            <input
              type="text"
              className="form-control"
              placeholder="1st Prize 🥇"
              value={formData.rankLabel}
              onChange={(e) => setFormData({ ...formData, rankLabel: e.target.value })}
            />
          </div>

          <div className="form-group full">
            <label>Winner Photo URL</label>
            <input
              type="text"
              className="form-control"
              placeholder="https://..."
              value={formData.photo}
              onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
            />
          </div>

          <div className="form-group full">
            <label>Remarks / Performance Details</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Classical Solo Kathak Routine"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
