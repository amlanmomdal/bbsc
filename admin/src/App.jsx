import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { adminApiService } from './services/adminApiService';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginPage } from './pages/LoginPage';

import { DashboardPage } from './pages/DashboardPage';
import { CompetitionsAdminPage } from './pages/CompetitionsAdminPage';
import { EventsAdminPage } from './pages/EventsAdminPage';
import { WinnersAdminPage } from './pages/WinnersAdminPage';
import { GalleryAdminPage } from './pages/GalleryAdminPage';
import { CommitteeAdminPage } from './pages/CommitteeAdminPage';
import { MembershipsAdminPage } from './pages/MembershipsAdminPage';
import { MessagesAdminPage } from './pages/MessagesAdminPage';
import { SettingsAdminPage } from './pages/SettingsAdminPage';

const VALID_TABS = ['dashboard', 'competitions', 'events', 'winners', 'gallery', 'committee', 'memberships', 'messages', 'settings'];

const getInitialTab = () => {
  const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
  if (hash && VALID_TABS.includes(hash)) {
    return hash;
  }
  const savedTab = typeof localStorage !== 'undefined' ? localStorage.getItem('bbsc_admin_active_tab') : null;
  if (savedTab && VALID_TABS.includes(savedTab)) {
    return savedTab;
  }
  return 'dashboard';
};

export function App() {
  const [auth, setAuth] = useState(adminApiService.getAuth());
  const [activeTabState, setActiveTabState] = useState(getInitialTab);

  const activeTab = activeTabState;

  const setActiveTab = (tab) => {
    if (VALID_TABS.includes(tab)) {
      setActiveTabState(tab);
      try {
        localStorage.setItem('bbsc_admin_active_tab', tab);
        if (window.location.hash.replace('#', '') !== tab) {
          window.location.hash = tab;
        }
      } catch (e) {}
    }
  };

  // Keep URL hash & localStorage in sync
  useEffect(() => {
    if (auth.isAuthenticated) {
      try {
        localStorage.setItem('bbsc_admin_active_tab', activeTab);
        if (window.location.hash.replace('#', '') !== activeTab) {
          window.location.hash = activeTab;
        }
      } catch (e) {}
    }

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && VALID_TABS.includes(hash)) {
        setActiveTabState(hash);
        try {
          localStorage.setItem('bbsc_admin_active_tab', hash);
        } catch (e) {}
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [auth.isAuthenticated, activeTab]);

  // Reactive State Store
  const [competitions, setCompetitions] = useState(() => adminApiService.getCompetitions());
  const [events, setEvents] = useState(() => adminApiService.getEvents());
  const [winners, setWinners] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({});
  const [contactInfo, setContactInfo] = useState({});

  useEffect(() => {
    if (auth.isAuthenticated) {
      refreshData();
    }
  }, [auth, activeTab]);

  // Session Expiry & Inactivity Auto-Logout (5 Minutes)
  useEffect(() => {
    if (auth.isExpired) {
      Swal.fire({
        title: 'Session Expired',
        text: 'You have been automatically logged out due to 5 minutes of inactivity for security.',
        icon: 'warning',
        confirmButtonColor: '#1e3a8a',
        confirmButtonText: 'Log In Again'
      });
      setAuth({ isAuthenticated: false, user: null });
      return;
    }

    if (!auth.isAuthenticated) return;

    // Set initial activity timestamp when active
    adminApiService.updateLastActivity();
    let lastSaved = Date.now();

    const handleUserActivity = () => {
      const now = Date.now();
      // Throttle localStorage writes (at most once every second)
      if (now - lastSaved > 1000) {
        lastSaved = now;
        adminApiService.updateLastActivity();
      }
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach(evt => window.addEventListener(evt, handleUserActivity, { passive: true }));

    const checkInterval = setInterval(() => {
      const lastActivityStr = localStorage.getItem('bbsc_admin_last_activity');
      const lastActivity = lastActivityStr ? parseInt(lastActivityStr, 10) : Date.now();
      const inactiveTime = Date.now() - lastActivity;

      // 5 Minutes (300,000 ms) Inactivity Limit
      if (inactiveTime >= 5 * 60 * 1000) {
        clearInterval(checkInterval);
        events.forEach(evt => window.removeEventListener(evt, handleUserActivity));
        adminApiService.logout();
        setAuth({ isAuthenticated: false, user: null });
        Swal.fire({
          title: 'Session Expired',
          text: 'You have been automatically logged out due to 5 minutes of inactivity for security.',
          icon: 'warning',
          confirmButtonColor: '#1e3a8a',
          confirmButtonText: 'Log In Again'
        });
      }
    }, 4000);

    return () => {
      clearInterval(checkInterval);
      events.forEach(evt => window.removeEventListener(evt, handleUserActivity));
    };
  }, [auth.isAuthenticated, auth.isExpired]);

  const handleRefreshCompetitions = async () => {
    const comps = await adminApiService.fetchCompetitionsFromApi();
    setCompetitions(comps);
    return comps;
  };

  const handleRefreshEvents = async () => {
    const evts = await adminApiService.fetchEventsFromApi();
    setEvents(evts);
    return evts;
  };

  const handleRefreshGallery = async () => {
    const items = await adminApiService.fetchGalleryFromApi();
    setGallery(items);
    return items;
  };

  const handleRefreshCommittee = async () => {
    const items = await adminApiService.fetchCommitteeFromApi();
    setCommittee(items);
    return items;
  };

  const handleRefreshMemberships = async () => {
    const items = await adminApiService.fetchMembershipsFromApi();
    setMemberships(items);
    return items;
  };

  const refreshData = async () => {
    setWinners(adminApiService.getWinners());
    setMessages(adminApiService.getMessages());
    setStats(adminApiService.getStats());
    setContactInfo(adminApiService.getContactInfo());

    // Fetch live Cultural Competitions, Events, Gallery, Committee & Memberships from API
    await handleRefreshCompetitions();
    await handleRefreshEvents();
    await handleRefreshGallery();
    await handleRefreshCommittee();
    await handleRefreshMemberships();
  };

  const handleLoginSuccess = (user) => {
    setAuth({ isAuthenticated: true, user });
  };

  const handleLogout = async () => {
    const res = await Swal.fire({
      title: 'Sign Out?',
      text: 'Are you sure you want to log out of BBSC Admin Portal?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sign Out',
      cancelButtonText: 'Cancel'
    });
    if (res.isConfirmed) {
      adminApiService.logout();
      setAuth({ isAuthenticated: false, user: null });
    }
  };

  // Competition Handlers
  const handleSaveCompetition = async (data) => {
    const updated = await adminApiService.saveCompetition(data);
    setCompetitions(updated);
  };

  const handleDeleteCompetition = async (id) => {
    const res = await Swal.fire({
      title: 'Delete Competition?',
      text: 'Are you sure you want to delete this cultural competition master entry?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });
    if (res.isConfirmed) {
      const updated = await adminApiService.deleteCompetition(id);
      setCompetitions(updated);
      Swal.fire({
        title: 'Deleted!',
        text: 'Cultural Competition entry has been deleted.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      });
    }
  };

  // Event Handlers
  const handleSaveEvent = async (data) => {
    const updated = await adminApiService.saveEvent(data);
    setEvents(updated);
  };

  const handleDeleteEvent = async (id) => {
    const res = await Swal.fire({
      title: 'Delete Event?',
      text: 'Are you sure you want to delete this event/festival?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });
    if (res.isConfirmed) {
      const updated = await adminApiService.deleteEvent(id);
      setEvents(updated);
      Swal.fire({ title: 'Deleted!', text: 'Event/Festival has been deleted.', icon: 'success', timer: 1800, showConfirmButton: false });
    }
  };

  // Winner Handlers
  const handleSaveWinner = (data) => {
    const updated = adminApiService.saveWinner(data);
    setWinners(updated);
  };

  const handleDeleteWinner = async (id) => {
    const res = await Swal.fire({
      title: 'Delete Winner Record?',
      text: 'Are you sure you want to delete this winner record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });
    if (res.isConfirmed) {
      const updated = adminApiService.deleteWinner(id);
      setWinners(updated);
      Swal.fire({ title: 'Deleted!', text: 'Winner record deleted.', icon: 'success', timer: 1800, showConfirmButton: false });
    }
  };

  // Gallery Handlers
  const handleSaveGalleryItem = async (data) => {
    const updated = await adminApiService.saveGalleryItem(data);
    setGallery(updated);
  };

  const handleDeleteGalleryItem = async (id) => {
    const res = await Swal.fire({
      title: 'Remove Photo?',
      text: 'Are you sure you want to remove this photo from gallery?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove it!'
    });
    if (res.isConfirmed) {
      const updated = adminApiService.deleteGalleryItem(id);
      setGallery(updated);
      Swal.fire({ title: 'Removed!', text: 'Photo removed from gallery.', icon: 'success', timer: 1800, showConfirmButton: false });
    }
  };

  // Committee Handlers
  const handleSaveCommitteeMember = async (data) => {
    const updated = await adminApiService.saveCommitteeMember(data);
    setCommittee(updated);
  };

  const handleDeleteCommitteeMember = async (id) => {
    const res = await Swal.fire({
      title: 'Remove Member?',
      text: 'Are you sure you want to remove this member from committee roster?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove it!'
    });
    if (res.isConfirmed) {
      const updated = await adminApiService.deleteCommitteeMember(id);
      setCommittee(updated);
      Swal.fire({ title: 'Removed!', text: 'Member removed from roster.', icon: 'success', timer: 1800, showConfirmButton: false });
    }
  };

  // Membership Handlers
  const handleUpdateMembershipStatus = async (id, status) => {
    const updated = await adminApiService.updateMembershipStatus(id, status);
    setMemberships(updated);
    Swal.fire({ title: 'Status Updated!', text: `Membership application marked as ${status}.`, icon: 'success', timer: 1800, showConfirmButton: false });
  };

  const handleDeleteMembership = async (id) => {
    const res = await Swal.fire({
      title: 'Delete Application?',
      text: 'Are you sure you want to delete this membership application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });
    if (res.isConfirmed) {
      const updated = await adminApiService.deleteMembership(id);
      setMemberships(updated);
      Swal.fire({ title: 'Deleted!', text: 'Application deleted.', icon: 'success', timer: 1800, showConfirmButton: false });
    }
  };

  // Message Handlers
  const handleToggleMessageRead = (id) => {
    const updated = adminApiService.toggleMessageRead(id);
    setMessages(updated);
  };

  const handleDeleteMessage = async (id) => {
    const res = await Swal.fire({
      title: 'Delete Message?',
      text: 'Are you sure you want to delete this visitor message?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });
    if (res.isConfirmed) {
      const updated = adminApiService.deleteMessage(id);
      setMessages(updated);
      Swal.fire({ title: 'Deleted!', text: 'Message deleted.', icon: 'success', timer: 1800, showConfirmButton: false });
    }
  };

  // Settings Handlers
  const handleSaveStats = (newStats) => {
    const updated = adminApiService.saveStats(newStats);
    setStats(updated);
  };

  const handleSaveContactInfo = (newInfo) => {
    const updated = adminApiService.saveContactInfo(newInfo);
    setContactInfo(updated);
  };

  if (!auth.isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;
  const pendingMembershipsCount = memberships.filter((m) => m.status === 'pending').length;

  const tabTitles = {
    dashboard: { title: 'Dashboard Overview', subtitle: 'BBSC club activities & key metrics' },
    competitions: { title: 'Cultural Competitions', subtitle: 'Manage competition categories, icons & descriptions' },
    events: { title: 'Events & Festivals', subtitle: 'Manage club scheduled events & Pujas' },
    winners: { title: 'Competition Winners', subtitle: 'Manage awards & winner list' },
    gallery: { title: 'Gallery Photos', subtitle: 'Manage photo albums & uploads' },
    committee: { title: 'Committee Roster', subtitle: 'Manage office bearers & contacts' },
    memberships: { title: 'Membership Applications', subtitle: 'Review and approve member applications' },
    messages: { title: 'Visitor Messages', subtitle: 'Inquiries received via contact form' },
    settings: { title: 'Club Settings', subtitle: 'Update general stats & social links' }
  };

  const currentTabInfo = tabTitles[activeTab] || { title: 'Admin Panel', subtitle: 'Burul Blue Star Club' };

  return (
    <div className="admin-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadMessagesCount={unreadMessagesCount}
        pendingMembershipsCount={pendingMembershipsCount}
        onLogout={handleLogout}
      />

      <div className="admin-main">
        <Header
          title={currentTabInfo.title}
          subtitle={currentTabInfo.subtitle}
          user={auth.user}
        />

        <main className="admin-page-content">
          {activeTab === 'dashboard' && (
            <DashboardPage
              events={events}
              winners={winners}
              gallery={gallery}
              committee={committee}
              memberships={memberships}
              messages={messages}
              stats={stats}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'competitions' && (
            <CompetitionsAdminPage
              competitions={competitions}
              onSaveCompetition={handleSaveCompetition}
              onDeleteCompetition={handleDeleteCompetition}
              onRefresh={handleRefreshCompetitions}
            />
          )}

          {activeTab === 'events' && (
            <EventsAdminPage
              events={events}
              onSaveEvent={handleSaveEvent}
              onDeleteEvent={handleDeleteEvent}
              onRefresh={handleRefreshEvents}
            />
          )}

          {activeTab === 'winners' && (
            <WinnersAdminPage
              winners={winners}
              onSaveWinner={handleSaveWinner}
              onDeleteWinner={handleDeleteWinner}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryAdminPage
              gallery={gallery}
              onSaveGalleryItem={handleSaveGalleryItem}
              onDeleteGalleryItem={handleDeleteGalleryItem}
              onRefresh={handleRefreshGallery}
            />
          )}

          {activeTab === 'committee' && (
            <CommitteeAdminPage
              committee={committee}
              onSaveMember={handleSaveCommitteeMember}
              onDeleteMember={handleDeleteCommitteeMember}
              onRefresh={handleRefreshCommittee}
            />
          )}

          {activeTab === 'memberships' && (
            <MembershipsAdminPage
              memberships={memberships}
              onUpdateStatus={handleUpdateMembershipStatus}
              onDeleteMembership={handleDeleteMembership}
              onRefresh={handleRefreshMemberships}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesAdminPage
              messages={messages}
              onToggleRead={handleToggleMessageRead}
              onDeleteMessage={handleDeleteMessage}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsAdminPage
              stats={stats}
              contactInfo={contactInfo}
              onSaveStats={handleSaveStats}
              onSaveContactInfo={handleSaveContactInfo}
            />
          )}
        </main>
      </div>
    </div>
  );
}
export default App;
