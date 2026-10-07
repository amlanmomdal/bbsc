import React from 'react';
import { Loader2 } from 'lucide-react';
import './SectionLoader.css';

export function SpinnerLoader({ message = 'Loading BBSC content...' }) {
  return (
    <div className="bbsc-spinner-container">
      <div className="bbsc-spinner-glow">
        <Loader2 size={36} className="bbsc-spinner-icon" />
      </div>
      <p className="bbsc-spinner-text">{message}</p>
    </div>
  );
}

export function FestivalSkeletonGrid({ count = 3 }) {
  return (
    <div className="grid-3 festival-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="card-dark festival-card skeleton-card">
          <div className="skeleton-img-wrap skeleton-box" />
          <div className="festival-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px' }}>
            <div className="skeleton-box" style={{ height: '24px', width: '70%' }} />
            <div className="skeleton-box" style={{ height: '16px', width: '90%' }} />
            <div className="skeleton-box" style={{ height: '16px', width: '60%' }} />
            <div className="skeleton-box" style={{ height: '36px', width: '120px', marginTop: '8px', borderRadius: '20px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CompetitionSkeletonGrid({ count = 6 }) {
  return (
    <div className="grid-6 competitions-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="comp-card skeleton-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div className="skeleton-box" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
          <div className="skeleton-box" style={{ height: '16px', width: '80%' }} />
        </div>
      ))}
    </div>
  );
}

export function GallerySkeletonGrid({ count = 6 }) {
  return (
    <div className="grid-3 gallery-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="card-dark gallery-item-card skeleton-card" style={{ height: '260px' }}>
          <div className="skeleton-box" style={{ width: '100%', height: '100%' }} />
        </div>
      ))}
    </div>
  );
}

export function CommitteeSkeletonGrid({ count = 4 }) {
  return (
    <div className="committee-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="card-dark member-card skeleton-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div className="skeleton-box" style={{ width: '140px', height: '140px', borderRadius: '50%' }} />
          <div className="skeleton-box" style={{ height: '22px', width: '65%' }} />
          <div className="skeleton-box" style={{ height: '16px', width: '45%' }} />
        </div>
      ))}
    </div>
  );
}

export function WinnersSkeletonGrid({ count = 3 }) {
  return (
    <div className="podium-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="podium-card skeleton-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <div className="skeleton-box" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
          <div className="skeleton-box" style={{ height: '22px', width: '70%' }} />
          <div className="skeleton-box" style={{ height: '16px', width: '50%' }} />
        </div>
      ))}
    </div>
  );
}
