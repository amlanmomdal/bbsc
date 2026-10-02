import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { resolveImageUrl } from '../utils/imageUtils';
import { Award } from 'lucide-react';
import './CommitteePage.css';

const RibbonBanner = ({ text }) => {
  return (
    <div className="member-ribbon-badge">
      <div className="ribbon-tail ribbon-tail-left" />
      <div className="ribbon-fold ribbon-fold-left" />
      <div className="ribbon-center">
        <span className="ribbon-text">{text}</span>
      </div>
      <div className="ribbon-fold ribbon-fold-right" />
      <div className="ribbon-tail ribbon-tail-right" />
    </div>
  );
};

export default function CommitteePage({ setActivePage, onOpenJoinModal }) {
  const [committee, setCommittee] = useState([]);

  useEffect(() => {
    async function loadCommittee() {
      const res = await apiService.getCommittee();
      if (res.success) setCommittee(res.data);
    }
    loadCommittee();
  }, []);

  const getMemberPhoto = (member) => {
    const rawPhoto = member?.photo || member?.image;
    if (rawPhoto && typeof rawPhoto === 'string' && rawPhoto.trim() !== '') {
      return resolveImageUrl(rawPhoto);
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(member?.name || 'Member')}&background=191611&color=EBB328&size=300&bold=true`;
  };

  const handleImgError = (e, name) => {
    e.target.onerror = null;
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Member')}&background=191611&color=EBB328&size=300&bold=true`;
  };

  return (
    <div className="committee-page">
      {/* Page Header */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <span onClick={() => setActivePage('home')} style={{ cursor: 'pointer' }}>Home</span>
            <span>&gt;</span>
            <span className="active">Committee</span>
          </div>
          <h1 className="section-title title-gold">OUR COMMITTEE</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          {/* Member Cards Grid with Ribbon Banner & Industry Standard Frames */}
          <div className="committee-grid">
            {committee.map((member) => {
              const memberName = member.name || 'Committee Member';
              const memberRole = member.role || member.position || 'Executive Member';
              const photoSrc = getMemberPhoto(member);

              return (
                <div key={member.id || member._id} className="card-dark member-card">
                  <div className="member-card-header">
                    <div className="member-photo-wrap">
                      <img 
                        src={photoSrc} 
                        alt={memberName} 
                        className="member-photo" 
                        onError={(e) => handleImgError(e, memberName)}
                      />
                    </div>
                    <RibbonBanner text={memberRole} />
                  </div>

                  <div className="member-info">
                    <h3 className="member-name">{memberName}</h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Join Committee Banner */}
          <div className="committee-join-banner card-dark">
            <div className="banner-content">
              <Award size={36} color="#EBB328" />
              <div>
                <h3>Want to serve as a Volunteer or Sub-Committee Member?</h3>
                <p>Burul Blue Star Club welcomes passionate individuals to lead cultural and social drives.</p>
              </div>
            </div>
            <button className="btn-gold" onClick={onOpenJoinModal}>
              Apply as Volunteer
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
