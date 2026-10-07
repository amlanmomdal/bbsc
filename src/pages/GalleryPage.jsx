import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { resolveImageUrl } from '../utils/imageUtils';
import { GallerySkeletonGrid } from '../components/SectionLoader';
import { X, ZoomIn } from 'lucide-react';
import './GalleryPage.css';

export default function GalleryPage({ setActivePage }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [categories, setCategories] = useState(['All', 'Kali Puja', 'Saraswati Puja', 'Competitions', 'Events', 'Social Work', 'Cultural']);

  const DEFAULT_PRESETS = ['Kali Puja', 'Saraswati Puja', 'Competitions', 'Events', 'Social Work', 'Cultural'];

  useEffect(() => {
    async function loadGalleryData() {
      setLoading(true);
      try {
        const allRes = await apiService.getGallery('All');
        if (allRes.success && Array.isArray(allRes.data)) {
          const backendCategories = allRes.data.map(item => item.category).filter(Boolean);
          const uniqueSet = new Set([...DEFAULT_PRESETS, ...backendCategories]);
          setCategories(['All', ...Array.from(uniqueSet)]);

          if (selectedCategory === 'All') {
            setPhotos(allRes.data);
            return;
          }
        }

        const res = await apiService.getGallery(selectedCategory);
        if (res.success && Array.isArray(res.data)) {
          setPhotos(res.data);
        }
      } catch (err) {
        console.warn('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGalleryData();
  }, [selectedCategory]);

  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = '/images/bbsc_hero_bg.jpg';
  };

  return (
    <div className="gallery-page">
      {/* Page Header */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <span onClick={() => setActivePage('home')} style={{ cursor: 'pointer' }}>Home</span>
            <span>&gt;</span>
            <span className="active">Gallery</span>
          </div>
          <h1 className="section-title title-gold">GALLERY</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          {/* Filter Pills matching screenshot */}
          <div className="gallery-pills-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`gallery-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photo Grid 3x3 matching screenshot */}
          {loading ? (
            <GallerySkeletonGrid count={6} />
          ) : (
            <div className="grid-3 gallery-grid">
              {photos.map((item) => (
                <div 
                  key={item.id || item._id} 
                  className="card-dark gallery-item-card"
                  onClick={() => setLightboxImage(item)}
                >
                  <img 
                    src={resolveImageUrl(item.image)} 
                    alt={item.title} 
                    className="gallery-img" 
                    onError={handleImgError}
                  />
                  <div className="gallery-hover-overlay">
                    <ZoomIn size={32} color="#EBB328" />
                    <span className="gallery-item-title">{item.title}</span>
                    <span className="gallery-item-cat">{item.category}</span>
                    {item.shortDescription && (
                      <p style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.35rem', color: '#e2e8f0', textAlign: 'center', padding: '0 0.5rem' }}>
                        {item.shortDescription}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="modal-overlay lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setLightboxImage(null)}>
              <X size={24} />
            </button>
            <img 
              src={resolveImageUrl(lightboxImage.image)} 
              alt={lightboxImage.title} 
              className="lightbox-img" 
              onError={handleImgError}
            />
            <div className="lightbox-caption">
              <h4>{lightboxImage.title}</h4>
              <span className="badge badge-info" style={{ display: 'inline-block', marginBottom: '0.4rem' }}>
                Tag: {lightboxImage.category}
              </span>
              {lightboxImage.shortDescription && (
                <p style={{ marginTop: '0.4rem', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                  {lightboxImage.shortDescription}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
