import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { MapPin, Phone, Mail, Send, CheckCircle2, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import './ContactPage.css';

export default function ContactPage({ setActivePage }) {
  const [contactInfo, setContactInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    async function loadInfo() {
      const res = await apiService.getContactInfo();
      if (res.success) setContactInfo(res.data);
    }
    loadInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiService.submitContactForm(formData);
      setLoading(false);
      if (res.success) {
        setFeedbackMessage(res.message);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      setLoading(false);
      alert('Error sending message. Please try again.');
    }
  };

  return (
    <div className="contact-page">
      {/* Page Header */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <span onClick={() => setActivePage('home')} style={{ cursor: 'pointer' }}>Home</span>
            <span>&gt;</span>
            <span className="active">Contact</span>
          </div>
          <h1 className="section-title title-gold">CONTACT US</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="contact-grid">
            {/* Left Card: Info matching screenshot */}
            <div className="card-dark contact-info-card">
              <div className="info-block">
                <div className="info-icon"><MapPin size={24} color="#EBB328" /></div>
                <div>
                  <h4 className="info-label">Address</h4>
                  <p className="info-val">{contactInfo?.address || 'Burul, South 24 Parganas, West Bengal - 743318'}</p>
                </div>
              </div>

              <div className="info-block">
                <div className="info-icon"><Phone size={24} color="#EBB328" /></div>
                <div>
                  <h4 className="info-label">Phone</h4>
                  {contactInfo?.phones.map((p, i) => (
                    <p key={i} className="info-val">{p}</p>
                  ))}
                </div>
              </div>

              <div className="info-block">
                <div className="info-icon"><Mail size={24} color="#EBB328" /></div>
                <div>
                  <h4 className="info-label">Email</h4>
                  {contactInfo?.emails.map((e, i) => (
                    <p key={i} className="info-val">{e}</p>
                  ))}
                </div>
              </div>

              <div className="contact-socials-block">
                <span className="social-heading">Follow Us</span>
                <div className="footer-socials">
                  <a href={contactInfo?.social.facebook || '#'} target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Facebook">
                    <Facebook size={18} />
                  </a>
                  <a href={contactInfo?.social.instagram || '#'} target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Instagram">
                    <Instagram size={18} />
                  </a>
                  <a href={contactInfo?.social.youtube || '#'} target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="YouTube">
                    <Youtube size={18} />
                  </a>
                  <a href={contactInfo?.social.whatsapp || '#'} target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="WhatsApp">
                    <MessageCircle size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Card: Map + Form matching screenshot */}
            <div className="card-dark contact-form-card">
              {/* Map Preview Frame */}
              <div className="map-frame-wrap">
                <iframe
                  title="Burul Blue Star Club Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14748.243577317765!2d88.1189445!3d22.4643328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02798e945c7b39%3A0xa597fb4d6fcdab3f!2sBurul%2C%20West%20Bengal%20743318!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="180"
                  style={{ border: 0, borderRadius: 'var(--radius-sm)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              {/* Message Form */}
              <form onSubmit={handleSubmit} className="contact-form">
                {feedbackMessage && (
                  <div className="feedback-banner">
                    <CheckCircle2 size={20} color="#EBB328" /> {feedbackMessage}
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <textarea
                    rows={4}
                    required
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn-gold w-full" disabled={loading}>
                  {loading ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
