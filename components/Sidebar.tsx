
import React from 'react';
import { Home, MessageSquare, Truck, BarChart3, Leaf, Menu, X, Users, LogOut, Briefcase } from 'lucide-react';
import { ViewState, User } from '../types';
import { storage } from '../services/storageService';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  user: User | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isMobileOpen, setIsMobileOpen, user, onLogout }) => {
  
  const navItems = [
    { id: 'home', label: 'Início', icon: Home, roles: ['admin', 'citizen'] },
    { id: 'chat', label: 'Assistente Eco', icon: MessageSquare, roles: ['admin', 'citizen'] },
    { id: 'request', label: 'Solicitar Coleta', icon: Truck, roles: ['admin', 'citizen'] },
    { id: 'admin', label: 'Estatísticas', icon: BarChart3, roles: ['admin'] },
    { id: 'users', label: 'Usuários', icon: Users, roles: ['admin'] },
    { id: 'iptu', label: 'IPTU Verde', icon: Leaf, roles: ['admin', 'citizen'] },
  ];

  const handleNav = (id: string) => {
    setView(id as ViewState);
    setIsMobileOpen(false);
  };

  const visibleItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <>
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-green-700 text-white rounded-lg shadow-lg hover:bg-green-800 transition-colors"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 bg-green-900 text-white shadow-2xl transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-green-800 bg-green-950 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
              <Leaf size={32} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">IAeco</h1>
            <p className="text-green-400 text-[10px] uppercase tracking-widest mt-1">Gestão Inteligente</p>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-green-600 text-white shadow-md' 
                      : 'text-green-100 hover:bg-green-800 hover:text-white'}
                  `}
                >
                  <Icon size={20} className={`${isActive ? 'text-white' : 'text-green-300 group-hover:text-white'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 bg-green-950 border-t border-green-800 space-y-3">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-8 h-8 rounded-lg bg-green-800 flex items-center justify-center text-xs font-bold">
                    {user?.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                    <p className="text-xs font-bold truncate">{user?.name}</p>
                    <p className="text-[10px] text-green-500 truncate lowercase">{user?.role}</p>
                </div>
            </div>
            
            {user?.role === 'admin' && (
              <button 
                onClick={() => setView('business')}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl transition-all text-sm font-bold shadow-sm ${currentView === 'business' ? 'bg-blue-600 text-white' : 'bg-green-800 text-blue-200 hover:bg-blue-900/40'}`}
              >
                <Briefcase size={18} /> Acesso Gestores
              </button>
            )}

            <button 
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-bold"
            >
                <LogOut size={16} /> Sair do Sistema
            </button>
          </div>
        </div>
      </aside>

      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
