import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import './AboutPage.css';

export default function AboutPage({ setActivePage, onOpenJoinModal }) {
  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = '/images/bbsc_hero_seamless_correct.jpg';
  };

  return (
    <div className="about-page">
      {/* Page Header */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <span onClick={() => setActivePage('home')} style={{ cursor: 'pointer' }}>Home</span>
            <span>&gt;</span>
            <span className="active">About</span>
          </div>
          <h1 className="section-title title-gold">ABOUT OUR CLUB</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container">
          <div className="about-grid">
            {/* Group Photo Frame matching screenshot */}
            <div className="about-image-card card-dark">
              <img 
                src="/images/bbsc_hero_seamless_correct.jpg" 
                alt="Burul Blue Star Club Members" 
                className="about-group-img"
                onError={handleImgError}
              />
              <div className="about-image-caption">
                BBSC Executive Committee & Members Assembly
              </div>
            </div>

            {/* Club Text Content matching screenshot */}
            <div className="about-text-content">
              <h2 className="about-heading title-gold">Serving Burul Since 1990</h2>
              <p className="about-lead-para">
                Burul Blue Star Club is one of the oldest social and cultural organizations in Burul.
                Since our inception in 1990, we have been working for the betterment of society through cultural programs,
                social activities, youth development, and community welfare.
              </p>
              <p className="about-secondary-para">
                Our mission is to inspire people, preserve our rich cultural heritage and create a stronger,
                better tomorrow. Through annual grand festivals like Kali Puja, Saraswati Puja, blood donation camps,
                and educational talent competitions, we bring people together across all walks of life.
              </p>

              <ul className="about-bullets">
                <li><CheckCircle2 size={18} color="#EBB328" /> Non-profit registered cultural organization</li>
                <li><CheckCircle2 size={18} color="#EBB328" /> Active youth volunteer empowerment programs</li>
                <li><CheckCircle2 size={18} color="#EBB328" /> 35+ continuous years of community service</li>
              </ul>

              <button className="btn-gold margin-top-24" onClick={onOpenJoinModal}>
                Become A Member
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
