import React, { useState } from 'react';
import { Save, CheckCircle, MapPin, Phone, Mail, Globe, Users, Trophy } from 'lucide-react';

export const SettingsAdminPage = ({ stats, contactInfo, onSaveStats, onSaveContactInfo }) => {
  const [statsData, setStatsData] = useState({ ...stats });
  const [contactData, setContactData] = useState({
    address: contactInfo.address || 'Burul, South 24 Parganas, West Bengal - 743318',
    phones: contactInfo.phones ? contactInfo.phones.join(', ') : '+91 9876543210',
    emails: contactInfo.emails ? contactInfo.emails.join(', ') : 'info@burulbluestarclub.org',
    facebook: contactInfo.facebook || 'https://facebook.com/burulbluestarclub',
    instagram: contactInfo.instagram || 'https://instagram.com/burulbluestarclub',
    youtube: contactInfo.youtube || 'https://youtube.com/burulbluestarclub',
    whatsapp: contactInfo.whatsapp || 'https://wa.me/919876543210'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleStatsSubmit = (e) => {
    e.preventDefault();
    onSaveStats(statsData);
    triggerSuccess();
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formatted = {
      ...contactData,
      phones: contactData.phones.split(',').map(p => p.trim()),
      emails: contactData.emails.split(',').map(e => e.trim())
    };
    onSaveContactInfo(formatted);
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div>
      <div className="page-action-header">
        <div className="page-title-group">
          <h1>Club Settings & Info Manager</h1>
          <p>Update overall club statistics, contact details, address, and social links displayed on the main website.</p>
        </div>
        {savedSuccess && (
          <div className="badge badge-success" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
            <CheckCircle size={16} /> Changes saved successfully!
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        
        {/* Key Statistics Form */}
        <div className="table-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <Users size={22} color="#2563eb" />
            <h3 style={{ fontSize: '1.2rem' }}>Public Club Metrics</h3>
          </div>

          <form onSubmit={handleStatsSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Years of Community Service</label>
              <input
                type="number"
                className="form-control"
                value={statsData.yearsOfService}
                onChange={(e) => setStatsData({ ...statsData, yearsOfService: Number(e.target.value) })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Active Members Count</label>
              <input
                type="number"
                className="form-control"
                value={statsData.membersCount}
                onChange={(e) => setStatsData({ ...statsData, membersCount: Number(e.target.value) })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Events Organized Total</label>
              <input
                type="number"
                className="form-control"
                value={statsData.eventsOrganized}
                onChange={(e) => setStatsData({ ...statsData, eventsOrganized: Number(e.target.value) })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Annual Visitors / Footfall</label>
              <input
                type="number"
                className="form-control"
                value={statsData.annualVisitors}
                onChange={(e) => setStatsData({ ...statsData, annualVisitors: Number(e.target.value) })}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Save size={16} /> Save Statistics
            </button>
          </form>
        </div>

        {/* Contact & Social Links Form */}
        <div className="table-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <Globe size={22} color="#d97706" />
            <h3 style={{ fontSize: '1.2rem' }}>Contact Info & Social Links</h3>
          </div>

          <form onSubmit={handleContactSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Official Address</label>
              <textarea
                className="form-control"
                rows="2"
                value={contactData.address}
                onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Phone Numbers (comma separated)</label>
              <input
                type="text"
                className="form-control"
                value={contactData.phones}
                onChange={(e) => setContactData({ ...contactData, phones: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Email Addresses (comma separated)</label>
              <input
                type="text"
                className="form-control"
                value={contactData.emails}
                onChange={(e) => setContactData({ ...contactData, emails: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Facebook URL</label>
              <input
                type="text"
                className="form-control"
                value={contactData.facebook}
                onChange={(e) => setContactData({ ...contactData, facebook: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>WhatsApp Group / Contact URL</label>
              <input
                type="text"
                className="form-control"
                value={contactData.whatsapp}
                onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Save size={16} /> Save Contact Details
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
