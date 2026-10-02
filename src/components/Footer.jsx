import React from 'react';
import { Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import './Footer.css';

export default function Footer({ setActivePage, onOpenJoinModal }) {
  const navigateTo = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-wrap">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-brand" onClick={() => navigateTo('home')}>
              <img src="/images/bbsc_official_logo.png" alt="BBSC Logo" className="footer-logo" style={{ background: 'transparent', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(235,179,40,0.4))' }} />
              <span className="footer-brand-title">BURUL BLUE STAR CLUB</span>
            </div>
            <p className="footer-desc">
              Working together for a better society through culture, unity and service.
            </p>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="YouTube">
                <Youtube size={18} />
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">QUICK LINKS</h4>
            <ul className="footer-links">
              <li><button onClick={() => navigateTo('home')}>Home</button></li>
              <li><button onClick={() => navigateTo('about')}>About Us</button></li>
              <li><button onClick={() => navigateTo('competitions')}>Competitions</button></li>
              {/* <li><button onClick={() => navigateTo('winners')}>Hall of Fame / Past Winners</button></li> */}
              <li><button onClick={() => navigateTo('gallery')}>Gallery</button></li>
            </ul>
          </div>

          {/* Committee */}
          <div className="footer-col">
            <h4 className="footer-heading">COMMITTEE</h4>
            <ul className="footer-links">
              <li><button onClick={() => navigateTo('committee')}>Our Committee</button></li>
              <li><button onClick={() => navigateTo('committee')}>Executive Members</button></li>
              <li><button onClick={onOpenJoinModal}>Volunteers</button></li>
              <li><button onClick={() => navigateTo('about')}>Former Presidents</button></li>
            </ul>
          </div>

          {/* Membership */}
          <div className="footer-col">
            <h4 className="footer-heading">MEMBERSHIP</h4>
            <ul className="footer-links">
              <li><button onClick={onOpenJoinModal}>Membership Benefits</button></li>
              <li><button onClick={onOpenJoinModal}>Join Now</button></li>
              <li><button onClick={onOpenJoinModal}>Membership Form</button></li>
            </ul>
          </div>

          {/* Notices */}
          <div className="footer-col">
            <h4 className="footer-heading">NOTICES</h4>
            <ul className="footer-links">
              <li><button onClick={() => navigateTo('contact')}>Announcements</button></li>
              <li><button onClick={() => navigateTo('contact')}>Downloads</button></li>
              <li><button onClick={() => navigateTo('contact')}>Circulars</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="footer-bottom">
          <p>© 2024 Burul Blue Star Club. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
