import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ activePage, setActivePage, onOpenJoinModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'competitions', label: 'Competitions' },
    // { id: 'winners', label: 'Past Winners' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'committee', label: 'Committees' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoError = (e) => {
    e.target.onerror = null;
    e.target.src = '/logo-flag.svg';
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand / Logo using Official Emblem */}
        <div className="navbar-brand" onClick={() => handleNavClick('home')}>
          <img 
            src="/images/bbsc_official_logo.png" 
            alt="BBSC Logo" 
            className="navbar-logo-flag" 
            onError={handleLogoError}
          />
          <div className="brand-text-wrap">
            <span className="brand-title">BURUL BLUE STAR CLUB</span>
            <span className="brand-tagline">Burul, South 24 Parganas</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${activePage === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
              {activePage === item.id && <span className="active-dot" />}
            </button>
          ))}
        </nav>

        {/* Join Club Button */}
        <div className="navbar-actions">
          <button className="btn-gold btn-join-nav" onClick={onOpenJoinModal}>
            Join Club
          </button>
          
          {/* Mobile Menu Button */}
          <button 
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={26} color="#EBB328" /> : <Menu size={26} color="#EBB328" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`mobile-nav-link ${activePage === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
            <button 
              className="btn-gold w-full margin-top-16"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJoinModal();
              }}
            >
              Join Club
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
