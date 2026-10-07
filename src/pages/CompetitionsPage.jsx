import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { resolveImageUrl } from '../utils/imageUtils';
import { CompetitionSkeletonGrid } from '../components/SectionLoader';
import { 
  Palette, Sparkles, Music, BookOpen, Flower2, Smile, Gamepad2, 
  HelpCircle, Camera, FileText, Trophy, UserCheck, Calendar, Award, ChevronRight, Lock
} from 'lucide-react';
import './CompetitionsPage.css';

export default function CompetitionsPage({ setActivePage, onOpenJoinModal, onViewPastWinners }) {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComps() {
      setLoading(true);
      try {
        const res = await apiService.getCompetitions();
        if (res && res.success && Array.isArray(res.data)) {
          setCompetitions(res.data);
        }
      } catch (err) {
        console.warn('Error fetching competitions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadComps();
  }, []);

  const getIcon = (iconName) => {
    if (iconName && (iconName.startsWith('/uploads/') || iconName.startsWith('http://') || iconName.startsWith('https://') || iconName.startsWith('data:'))) {
      const imgSrc = resolveImageUrl(iconName);
      return <img src={imgSrc} alt="Icon" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '6px' }} />;
    }
    switch (iconName) {
      case 'Palette': return <Palette size={32} />;
      case 'Sparkles': return <Sparkles size={32} />;
      case 'Music': return <Music size={32} />;
      case 'BookOpen': return <BookOpen size={32} />;
      case 'Flower2': return <Flower2 size={32} />;
      case 'Smile': return <Smile size={32} />;
      case 'Gamepad2': return <Gamepad2 size={32} />;
      case 'HelpCircle': return <HelpCircle size={32} />;
      case 'Camera': return <Camera size={32} />;
      case 'FileText': return <FileText size={32} />;
      default: return <Trophy size={32} />;
    }
  };

  return (
    <div className="competitions-page">
      {/* Page Header */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <span onClick={() => setActivePage('home')} style={{ cursor: 'pointer' }}>Home</span>
            <span>&gt;</span>
            <span className="active">Competitions</span>
          </div>
          <h1 className="section-title title-gold">CULTURAL COMPETITIONS</h1>
          <p className="section-subtitle">Showcasing Talent, Encouraging Creativity</p>
        </div>
      </section>

      {/* Main Competitions Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="section-title-wrap text-left margin-bottom-32">
            <h2 className="section-title title-gold">ALL COMPETITIONS</h2>
            <p className="section-subtitle">Explore categories & view past champions of Burul Blue Star Club</p>
          </div>

          {loading ? (
            <CompetitionSkeletonGrid count={6} />
          ) : (
            <div className="grid-2 comp-detail-grid">
              {competitions.map((comp) => (
                <div key={comp.id || comp._id} className="card-dark comp-detail-card">
                  <div>
                    <div className="comp-card-header">
                      <div className="comp-badge-icon">{getIcon(comp.icon)}</div>
                      <div>
                        <span className="comp-category-tag">{comp.category || 'Competitions'}</span>
                        <h3 className="comp-detail-title">{comp.title}</h3>
                      </div>
                    </div>

                    <div className="comp-detail-meta">
                      <div><UserCheck size={16} color="#EBB328" /> <strong>Eligibility:</strong> {comp.ageGroup || 'Open Category'}</div>
                      <div><Trophy size={16} color="#EBB328" /> <strong>Awards:</strong> Trophies, Certificates</div>
                      <div><Calendar size={16} color="#EBB328" /> <strong>Venue:</strong> Burul Blue Star Club Stage</div>
                    </div>
                  </div>

                  <div className="comp-card-actions">
                    <button 
                      className="btn-gold comp-card-btn btn-disabled-lock"
                      disabled
                      title="Registration is currently disabled"
                    >
                      <Lock size={16} /> Register Participant
                    </button>
                    <button 
                      className="btn-outline-gold comp-card-btn"
                      onClick={() => {
                        if (onViewPastWinners) {
                          onViewPastWinners(comp.title);
                        } else {
                          setActivePage('winners');
                        }
                      }}
                    >
                      <Trophy size={16} /> Past Winners
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Dedicated Hall of Fame Banner */}
      <section className="section-padding hall-of-fame-cta-section">
        <div className="container">
          <div className="card-dark hof-cta-card">
            <div className="hof-cta-content">
              <span className="comp-category-tag"><Award size={18} /> Hall of Fame</span>
              <h2 className="title-gold margin-top-8">Past 3 Years Winners (2024 - 2022)</h2>
              <p className="margin-top-8">
                Discover the 1st, 2nd, 3rd and award-winning participants from our previous annual cultural competitions.
              </p>
            </div>
            <button 
              className="btn-gold btn-large"
              onClick={() => {
                if (onViewPastWinners) {
                  onViewPastWinners('All');
                } else {
                  setActivePage('winners');
                }
              }}
            >
              Explore All Past Winners <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
