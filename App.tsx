
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import ChatAssistant from './components/ChatAssistant';
import CollectionRequest from './components/CollectionRequest';
import AdminDashboard from './components/AdminDashboard';
import IPTUVerde from './components/IPTUVerde';
import UserManagement from './components/UserManagement';
import BusinessManagement from './components/BusinessManagement';
import Login from './components/Login';
import { ViewState, User } from './types';
import { storage } from './services/storageService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Initialize session
  useEffect(() => {
    const session = storage.getCurrentUser();
    if (session) {
      const users = storage.getUsers();
      const freshUser = users.find(u => u.id === session.id);
      if (freshUser && freshUser.status === 'active') {
        setUser(freshUser);
      } else {
        storage.setCurrentUser(null);
      }
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    storage.setCurrentUser(newUser);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setUser(null);
    storage.setCurrentUser(null);
    setCurrentView('login');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home setView={setCurrentView} />;
      case 'chat':
        return <ChatAssistant setView={setCurrentView} />;
      case 'request':
        return <CollectionRequest />;
      case 'admin':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'iptu':
        return <IPTUVerde />;
      case 'business':
        return <BusinessManagement />;
      default:
        return <Home setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-green-50/50">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className={`
        flex-1 transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'blur-sm lg:blur-none' : ''}
        lg:ml-64
      `}>
        <div className="p-4 pt-20 md:p-10 lg:pt-10 max-w-7xl mx-auto min-h-screen">
            {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
