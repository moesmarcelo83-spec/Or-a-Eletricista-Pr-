
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, PlusCircle, BookOpen, Menu, X, Zap, ChevronRight, Phone, MapPin, User, Calculator } from 'lucide-react';
import { AppState, Quote, ServiceCategory } from './types';
import { Dashboard } from './components/Dashboard';
import { QuoteList } from './components/QuoteList';
import { QuoteForm } from './components/QuoteForm';
import { Catalog } from './components/Catalog';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('orca_eletricista_state');
    if (saved) return JSON.parse(saved);
    return {
      quotes: [],
      activeTab: 'dashboard'
    };
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('orca_eletricista_state', JSON.stringify(state));
  }, [state]);

  const addQuote = (quote: Quote) => {
    setState(prev => ({
      ...prev,
      quotes: [quote, ...prev.quotes],
      activeTab: 'quotes'
    }));
  };

  const deleteQuote = (id: string) => {
    setState(prev => ({
      ...prev,
      quotes: prev.quotes.filter(q => q.id !== id)
    }));
  };

  const updateQuoteStatus = (id: string, status: Quote['status']) => {
    setState(prev => ({
      ...prev,
      quotes: prev.quotes.map(q => q.id === id ? { ...q, status } : q)
    }));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'quotes', label: 'Meus Orçamentos', icon: FileText },
    { id: 'new-quote', label: 'Novo Orçamento', icon: PlusCircle },
    { id: 'catalog', label: 'Tabela de Preços', icon: BookOpen },
  ];

  const renderContent = () => {
    switch (state.activeTab) {
      case 'dashboard':
        return <Dashboard state={state} onNewQuote={() => setState(p => ({ ...p, activeTab: 'new-quote' }))} />;
      case 'quotes':
        return <QuoteList quotes={state.quotes} onDelete={deleteQuote} onUpdateStatus={updateQuoteStatus} />;
      case 'new-quote':
        return <QuoteForm onSave={addQuote} onCancel={() => setState(p => ({ ...p, activeTab: 'dashboard' }))} />;
      case 'catalog':
        return <Catalog />;
      default:
        return <Dashboard state={state} onNewQuote={() => setState(p => ({ ...p, activeTab: 'new-quote' }))} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-blue-700 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <Zap className="text-orange-400" />
          <h1 className="font-bold text-lg">Orça Eletricista Pro</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <nav className={`
        fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 transition duration-200 ease-in-out
        z-40 w-64 bg-slate-900 text-white flex flex-col shadow-xl
      `}>
        <div className="p-6 hidden md:flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Zap className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl leading-tight">Orça Pro</h1>
            <p className="text-xs text-slate-400">Eletricista Premium</p>
          </div>
        </div>

        <div className="flex-1 mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setState(prev => ({ ...prev, activeTab: item.id as AppState['activeTab'] }));
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-4 px-6 py-4 transition-colors
                ${state.activeTab === item.id ? 'bg-blue-600 text-white border-r-4 border-orange-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 text-xs text-slate-500 border-t border-slate-800">
          <p>© 2025 Orça Eletricista Pro</p>
          <p>Tabela Base: Engehall 2025</p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-slate-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* FAB for Mobile New Quote */}
      {state.activeTab !== 'new-quote' && (
        <button
          onClick={() => setState(p => ({ ...p, activeTab: 'new-quote' }))}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 active:scale-95 transition-all z-30"
        >
          <PlusCircle size={28} />
        </button>
      )}
    </div>
  );
};

export default App;
