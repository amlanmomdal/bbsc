import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import JoinClubModal from './components/JoinClubModal';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CompetitionsPage from './pages/CompetitionsPage';
import WinnersPage from './pages/WinnersPage';
import GalleryPage from './pages/GalleryPage';
import CommitteePage from './pages/CommitteePage';
import ContactPage from './pages/ContactPage';

const VALID_PAGES = ['home', 'about', 'competitions', 'winners', 'gallery', 'committee', 'contact'];

const getInitialPage = () => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '');
    if (hash && VALID_PAGES.includes(hash)) {
      return hash;
    }
  }
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('bbsc_site_active_page');
    if (saved && VALID_PAGES.includes(saved)) {
      return saved;
    }
  }
  return 'home';
};

export default function App() {
  const [activePageState, setActivePageState] = useState(getInitialPage);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedWinnerCompFilter, setSelectedWinnerCompFilter] = useState('All');

  const activePage = activePageState;

  const setActivePage = (page) => {
    if (VALID_PAGES.includes(page)) {
      setActivePageState(page);
      try {
        localStorage.setItem('bbsc_site_active_page', page);
        if (window.location.hash.replace('#', '') !== page) {
          window.location.hash = page;
        }
      } catch (e) {}
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('bbsc_site_active_page', activePage);
      if (window.location.hash.replace('#', '') !== activePage) {
        window.location.hash = activePage;
      }
    } catch (e) {}

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && VALID_PAGES.includes(hash)) {
        setActivePageState(hash);
        try {
          localStorage.setItem('bbsc_site_active_page', hash);
        } catch (e) {}
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activePage]);

  const handleViewPastWinners = (compTitle = 'All') => {
    setSelectedWinnerCompFilter(compTitle);
    setActivePage('winners');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage setActivePage={setActivePage} onOpenJoinModal={() => setJoinModalOpen(true)} />;
      case 'about':
        return <AboutPage setActivePage={setActivePage} onOpenJoinModal={() => setJoinModalOpen(true)} />;
      case 'competitions':
        return (
          <CompetitionsPage 
            setActivePage={setActivePage} 
            onOpenJoinModal={() => setJoinModalOpen(true)} 
            onViewPastWinners={handleViewPastWinners}
          />
        );
      case 'winners':
        return (
          <WinnersPage 
            setActivePage={setActivePage} 
            selectedCompFilter={selectedWinnerCompFilter}
          />
        );
      case 'gallery':
        return <GalleryPage setActivePage={setActivePage} />;
      case 'committee':
        return <CommitteePage setActivePage={setActivePage} onOpenJoinModal={() => setJoinModalOpen(true)} />;
      case 'contact':
        return <ContactPage setActivePage={setActivePage} />;
      default:
        return <HomePage setActivePage={setActivePage} onOpenJoinModal={() => setJoinModalOpen(true)} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onOpenJoinModal={() => setJoinModalOpen(true)} 
      />
      
      <main className="main-content">
        {renderCurrentPage()}
      </main>

      <Footer 
        setActivePage={setActivePage} 
        onOpenJoinModal={() => setJoinModalOpen(true)} 
      />

      <JoinClubModal 
        isOpen={joinModalOpen} 
        onClose={() => setJoinModalOpen(false)} 
      />
    </div>
  );
}
