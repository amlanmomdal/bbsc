import React, { useState, useEffect } from 'react';
import { 
  Palette, Sparkles, Music, BookOpen, Flower2, Smile, Gamepad2, 
  HelpCircle, Camera, FileText, ChevronRight, ArrowRight, X
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { resolveImageUrl } from '../utils/imageUtils';
import { FestivalSkeletonGrid, CompetitionSkeletonGrid } from '../components/SectionLoader';
import './HomePage.css';

export default function HomePage({ setActivePage, onOpenJoinModal }) {
  const [festivals, setFestivals] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [loadingFestivals, setLoadingFestivals] = useState(true);
  const [loadingCompetitions, setLoadingCompetitions] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      setLoadingFestivals(true);
      setLoadingCompetitions(true);
      try {
        const fRes = await apiService.getFestivals();
        if (fRes && fRes.success && Array.isArray(fRes.data)) {
          setFestivals(fRes.data);
        }
      } catch (err) {
        console.warn('Error fetching festivals:', err);
      } finally {
        setLoadingFestivals(false);
      }

      try {
        const cRes = await apiService.getCompetitions();
        if (cRes && cRes.success && Array.isArray(cRes.data)) {
          setCompetitions(cRes.data);
        }
      } catch (err) {
        console.warn('Error fetching competitions:', err);
      } finally {
        setLoadingCompetitions(false);
      }
    }
    loadHomeData();
  }, []);

  const getIcon = (iconName) => {
    if (iconName && (iconName.startsWith('/uploads/') || iconName.startsWith('http://') || iconName.startsWith('https://') || iconName.startsWith('data:'))) {
      const imgSrc = resolveImageUrl(iconName);
      return <img src={imgSrc} alt="Icon" style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} />;
    }
    switch (iconName) {
      case 'Palette': return <Palette size={28} className="comp-icon" />;
      case 'Sparkles': return <Sparkles size={28} className="comp-icon" />;
      case 'Music': return <Music size={28} className="comp-icon" />;
      case 'BookOpen': return <BookOpen size={28} className="comp-icon" />;
      case 'Flower2': return <Flower2 size={28} className="comp-icon" />;
      case 'Smile': return <Smile size={28} className="comp-icon" />;
      case 'Gamepad2': return <Gamepad2 size={28} className="comp-icon" />;
      case 'HelpCircle': return <HelpCircle size={28} className="comp-icon" />;
      case 'Camera': return <Camera size={28} className="comp-icon" />;
      case 'FileText': return <FileText size={28} className="comp-icon" />;
      default: return <Sparkles size={28} className="comp-icon" />;
    }
  };

  const handleImgError = (e, fallbackSrc = '/images/bbsc_hero_user_provided.jpg') => {
    e.target.onerror = null;
    e.target.src = fallbackSrc;
  };

  return (
    <div className="home-page">
      {/* Seamless Hero Section using User's Exact Provided Image */}
      <section className="hero-section hero-user-exact">
        <div 
          className="hero-user-bg" 
          style={{ backgroundImage: `url('/images/bbsc_hero_user_provided.jpg')` }} 
        />
        <div className="hero-user-gradient-overlay" />

        <div className="container hero-container-seamless">
          <div className="hero-content-seamless">
            <h1 className="hero-title-seamless">
              BURUL<br />
              BLUE STAR<br />
              CLUB
            </h1>
            
            <div className="hero-subtitles-wrap">
              <p className="hero-sub-tagline">Tradition • Culture • Community</p>
              <p className="hero-sub-since">Since 1990</p>
            </div>

            <p className="hero-desc-seamless">
              A social & cultural organization dedicated to community welfare, cultural heritage, and youth development.
            </p>

            <div className="hero-buttons-seamless">
              <button className="btn-exact-gold" onClick={onOpenJoinModal}>
                Join Club
              </button>
              <button className="btn-exact-dark" onClick={() => setActivePage('about')}>
                About Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Festivals Section matching screenshot */}
      <section className="section-padding festivals-section">
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="section-title title-gold">OUR FESTIVALS</h2>
            <p className="section-subtitle">Uniting People. Celebrating Culture.</p>
          </div>

          {loadingFestivals ? (
            <FestivalSkeletonGrid count={3} />
          ) : (
            <div className="grid-3 festival-grid">
              {festivals.map((fest) => (
                <div key={fest.id || fest._id} className="card-dark festival-card">
                  <div className="festival-img-wrap">
                    <img 
                      src={resolveImageUrl(fest.image)} 
                      alt={fest.title} 
                      onError={(e) => handleImgError(e, '/images/kali_puja.jpg')}
                    />
                    <div className="fest-date-tag">{fest.date}</div>
                  </div>
                  <div className="festival-card-body">
                    <h3 className="fest-card-title">{fest.title}</h3>
                    <p className="fest-card-sub">{fest.subtitle}</p>
                    <button 
                      className="view-details-btn"
                      onClick={() => setSelectedFestival(fest)}
                    >
                      View Details <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cultural Competitions Section matching screenshot */}
      <section className="section-padding competitions-section">
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="section-title title-gold">CULTURAL COMPETITIONS</h2>
            <p className="section-subtitle">Showcasing Talent, Encouraging Creativity.</p>
          </div>

          {loadingCompetitions ? (
            <CompetitionSkeletonGrid count={6} />
          ) : (
            <div className="grid-6 competitions-grid">
              {competitions.map((comp) => (
                <div 
                  key={comp.id || comp._id} 
                  className="comp-card"
                  onClick={() => setActivePage('competitions')}
                >
                  <div className="comp-icon-box">
                    {getIcon(comp.icon)}
                  </div>
                  <h4 className="comp-title">{comp.title}</h4>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Festival Detail Modal */}
      {selectedFestival && (
        <div className="modal-overlay" onClick={() => setSelectedFestival(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedFestival(null)}>
              <X size={20} />
            </button>
            <div className="modal-festival-body">
              <img 
                src={resolveImageUrl(selectedFestival.image)} 
                alt={selectedFestival.title} 
                className="modal-fest-img" 
                onError={(e) => handleImgError(e, '/images/kali_puja.jpg')}
              />
              <span className="fest-date-tag modal-tag">{selectedFestival.date}</span>
              <h3 className="title-gold">{selectedFestival.title}</h3>
              <p className="modal-fest-sub">{selectedFestival.subtitle}</p>
              <p className="modal-fest-desc">{selectedFestival.description}</p>
              
              <h4 className="modal-subheading">Key Highlights:</h4>
              <ul className="modal-highlights">
                {(selectedFestival.highlights || [
                  'Splendid Illumination & Mandap Decor',
                  'Cultural Programs & Musical Evenings',
                  'Grand Bhog & Prasad Distribution',
                  'Youth & Community Participation'
                ]).map((item, idx) => (
                  <li key={idx}>✨ {item}</li>
                ))}
              </ul>

              <button 
                className="btn-gold w-full margin-top-16"
                onClick={() => {
                  setSelectedFestival(null);
                  onOpenJoinModal();
                }}
              >
                Participate / Volunteer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
