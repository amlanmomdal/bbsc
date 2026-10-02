import React, { useState } from 'react';
import { X, CheckCircle, User, Mail, Phone, MapPin, Send } from 'lucide-react';
import { apiService } from '../services/apiService';
import './JoinClubModal.css';

export default function JoinClubModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    interest: 'General Volunteer'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiService.submitJoinClub(formData);
      setLoading(false);
      if (response.success) {
        setSubmitted(true);
        setMessage(response.message);
      }
    } catch (err) {
      setLoading(false);
      alert('Submission failed. Please try again.');
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({ fullName: '', email: '', phone: '', address: '', interest: 'General Volunteer' });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content join-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="modal-header">
              <img src="/images/bbsc_official_logo.png" alt="BBSC Emblem" className="modal-flag-icon" style={{ background: 'transparent', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(235,179,40,0.5))' }} />
              <h3>JOIN BURUL BLUE STAR CLUB</h3>
              <p>Become a member or volunteer for community service and cultural events</p>
            </div>

            <form onSubmit={handleSubmit} className="join-form">
              <div className="form-group">
                <label><User size={16} /> Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Rahul Das"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><Mail size={16} /> Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label><Phone size={16} /> Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label><MapPin size={16} /> Address / Area</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Burul, South 24 Parganas"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Area of Interest</label>
                <select name="interest" value={formData.interest} onChange={handleChange}>
                  <option value="General Volunteer">General Volunteer</option>
                  <option value="Cultural Programs">Cultural Programs & Stage</option>
                  <option value="Sports & Competitions">Sports & Competitions</option>
                  <option value="Social Service">Social Service & Health Camps</option>
                  <option value="Executive Membership">Executive Membership</option>
                </select>
              </div>

              <button type="submit" className="btn-gold w-full" disabled={loading}>
                {loading ? 'Submitting Application...' : <><Send size={16} /> Submit Membership Form</>}
              </button>
            </form>
          </>
        ) : (
          <div className="modal-success-state">
            <CheckCircle size={60} color="#EBB328" className="success-icon" />
            <h3>Application Received!</h3>
            <p>{message}</p>
            <button className="btn-gold" onClick={resetForm}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
