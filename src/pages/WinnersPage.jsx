import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  Trophy, Award, Search, Filter, Calendar, Sparkles, ChevronRight, UserCheck, Star, ShieldCheck
} from 'lucide-react';
import './WinnersPage.css';

export default function WinnersPage({ setActivePage, selectedCompFilter = 'All' }) {
  const [competitions, setCompetitions] = useState([]);
  const [winners, setWinners] = useState([]);
  const [activeYear, setActiveYear] = useState('All');
  const [activeCompFilter, setActiveCompFilter] = useState(selectedCompFilter);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setActiveCompFilter(selectedCompFilter);
  }, [selectedCompFilter]);

  useEffect(() => {
    async function loadData() {
      const cRes = await apiService.getCompetitions();
      if (cRes.success) setCompetitions(cRes.data);

      const wRes = await apiService.getCompetitionWinners('All', 'All');
      if (wRes.success) setWinners(wRes.data);
    }
    loadData();
  }, []);

  const handleAvatarError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  };

  const yearsList = ['All', '2024', '2023', '2022'];

  // Filter logic
  const filteredWinners = winners.filter(w => {
    const matchesYear = activeYear === 'All' || w.year === activeYear;
    const matchesComp = activeCompFilter === 'All' || w.competitionTitle === activeCompFilter;
    const matchesSearch = searchTerm === '' || 
      w.winnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.competitionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.remarks && w.remarks.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesYear && matchesComp && matchesSearch;
  });

  // Group filtered winners by Year then by Competition
  const yearsToDisplay = activeYear === 'All' ? ['2024', '2023', '2022'] : [activeYear];

  const getRankBadge = (rank, label) => {
    if (rank === 1) return <span className="badge-podium gold-badge">🥇 1st Prize</span>;
    if (rank === 2) return <span className="badge-podium silver-badge">🥈 2nd Prize</span>;
    if (rank === 3) return <span className="badge-podium bronze-badge">🥉 3rd Prize</span>;
    return <span className="badge-podium nth-badge">🏅 {label || `${rank}th Prize`}</span>;
  };

  return (
    <div className="winners-page">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <span onClick={() => setActivePage('home')} style={{ cursor: 'pointer' }}>Home</span>
            <span>&gt;</span>
            <span onClick={() => setActivePage('competitions')} style={{ cursor: 'pointer' }}>Competitions</span>
            <span>&gt;</span>
            <span className="active">Past Winners</span>
          </div>
          <h1 className="section-title title-gold">HALL OF FAME & PAST WINNERS</h1>
          <p className="section-subtitle">Year-Wise Champions & Prize Awardees Across The Last 3 Years (2024 - 2022)</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          {/* Industry Standard Filter Controls Bar */}
          <div className="winners-filter-bar card-dark">
            <div className="filter-group">
              <label className="filter-label"><Filter size={16} color="#EBB328" /> Select Competition:</label>
              <select 
                className="select-dropdown-custom"
                value={activeCompFilter}
                onChange={(e) => setActiveCompFilter(e.target.value)}
              >
                <option value="All">🏆 All Competitions</option>
                {competitions.map(c => (
                  <option key={c.id} value={c.title}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label"><Calendar size={16} color="#EBB328" /> Filter Year:</label>
              <div className="year-pill-tabs">
                {yearsList.map(y => (
                  <button
                    key={y}
                    className={`year-pill-btn ${activeYear === y ? 'active' : ''}`}
                    onClick={() => setActiveYear(y)}
                  >
                    {y === 'All' ? 'All Years' : y}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group search-group">
              <label className="filter-label"><Search size={16} color="#EBB328" /> Search Winner:</label>
              <div className="search-input-wrap">
                <input 
                  type="text" 
                  placeholder="Search name, artwork or category..." 
                  className="search-input-custom"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Active Filter Notice Badge */}
          {activeCompFilter !== 'All' && (
            <div className="active-filter-banner">
              <span>Showing winners for: <strong>{activeCompFilter}</strong></span>
              <button onClick={() => setActiveCompFilter('All')} className="btn-reset-filter">Reset Filter</button>
            </div>
          )}

          {/* Year Wise Winners Breakdown */}
          {yearsToDisplay.map(year => {
            const yearWinners = filteredWinners.filter(w => w.year === year);
            if (yearWinners.length === 0) return null;

            // Group by Competition Title
            const compsInYear = Array.from(new Set(yearWinners.map(w => w.competitionTitle)));

            return (
              <div key={year} className="year-section-block">
                <div className="year-section-header">
                  <div className="year-title-wrap">
                    <Trophy size={28} color="#EBB328" />
                    <h2 className="year-heading">{year} CHAMPIONSHIPS</h2>
                  </div>
                  <span className="year-count-tag">{yearWinners.length} Awardees</span>
                </div>

                {compsInYear.map(compTitle => {
                  const compWinners = yearWinners.filter(w => w.competitionTitle === compTitle);

                  // Extract all subCategories for this competition in this year
                  const subCats = Array.from(new Set(compWinners.map(w => w.subCategory || 'General Category')));

                  return (
                    <div key={compTitle} className="comp-block card-dark">
                      <div className="comp-block-header">
                        <h3 className="comp-block-title">{compTitle}</h3>
                        <span className="comp-badge-tag">Year {year}</span>
                      </div>

                      {/* Render Each Category (Category A, Category B, Category C, etc.) */}
                      {subCats.map(subCat => {
                        const catWinners = compWinners
                          .filter(w => (w.subCategory || 'General Category') === subCat)
                          .sort((a, b) => a.rank - b.rank);

                        const topThree = catWinners.filter(w => w.rank <= 3);
                        const nthWinners = catWinners.filter(w => w.rank > 3);

                        return (
                          <div key={subCat} className="sub-category-block">
                            <div className="sub-category-header">
                              <span className="sub-category-title-tag">
                                <Award size={16} color="#EBB328" /> {subCat}
                              </span>
                            </div>

                            {/* Top 3 Podium Grid for this Sub-Category */}
                            <div className="podium-grid">
                              {topThree.map(winner => (
                                <div 
                                  key={winner.id} 
                                  className={`podium-card rank-${winner.rank}`}
                                >
                                  <div className="podium-rank-header">
                                    {getRankBadge(winner.rank, winner.rankLabel)}
                                  </div>

                                  <div className="podium-avatar-wrap">
                                    <img 
                                      src={winner.photo} 
                                      alt={winner.winnerName} 
                                      className="podium-avatar"
                                      onError={handleAvatarError}
                                    />
                                    {winner.rank === 1 && <span className="crown-badge">👑</span>}
                                  </div>

                                  <h4 className="podium-winner-name">{winner.winnerName}</h4>
                                  <p className="podium-age">{winner.ageGroup}</p>

                                  {winner.remarks && (
                                    <div className="podium-remarks">
                                      ✨ <em>"{winner.remarks}"</em>
                                    </div>
                                  )}

                                  <div className="winner-certificate-tag">
                                    <ShieldCheck size={14} color="#EBB328" /> Official Award Winner
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Consolation & Special Recognition Awards for this Sub-Category */}
                            {nthWinners.length > 0 && (
                              <div className="nth-winners-wrap">
                                <h4 className="nth-heading">Consolation & Special Recognition Awards ({subCat}):</h4>
                                <div className="nth-list-grid">
                                  {nthWinners.map(winner => (
                                    <div key={winner.id} className="nth-winner-item">
                                      <span className="nth-rank-label">{winner.rankLabel || `Rank #${winner.rank}`}</span>
                                      <img src={winner.photo} alt={winner.winnerName} onError={handleAvatarError} className="nth-thumb" />
                                      <div className="nth-info">
                                        <strong>{winner.winnerName}</strong>
                                        <span>{winner.remarks || winner.ageGroup}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {filteredWinners.length === 0 && (
            <div className="empty-results-box card-dark">
              <Trophy size={54} color="#EBB328" />
              <h3>No Winner Records Found</h3>
              <p>Try adjusting your search query or competition category filter.</p>
              <button 
                className="btn-gold margin-top-16"
                onClick={() => {
                  setActiveCompFilter('All');
                  setActiveYear('All');
                  setSearchTerm('');
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
