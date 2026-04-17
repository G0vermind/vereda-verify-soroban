import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/Navbar';
import { IntroPage } from './components/IntroPage';
import RegistroRWA from './components/RegistroRWA';
import ConsultaRWA from './components/ConsultaRWA';
import { ShieldCheck, Database, CheckCircle2 } from 'lucide-react';
import { useVereda } from '@vereda/sdk';

function Dashboard() {
  const [activeTab, setActiveTab] = useState<'registro' | 'consulta'>('registro');

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 transition-colors">
      
      <div className="flex justify-center mb-10">
        <div className="bg-gray-100 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-800 p-1.5 rounded-xl inline-flex gap-2 shadow-inner">
          <button 
            onClick={() => setActiveTab('registro')}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'registro' ? 'bg-white dark:bg-charcoal-800 text-forest-600 dark:text-forest-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <ShieldCheck size={18} />
            Registro Criptográfico
          </button>
          <button 
            onClick={() => setActiveTab('consulta')}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'consulta' ? 'bg-white dark:bg-charcoal-800 text-forest-600 dark:text-forest-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <Database size={18} />
            Explorer de Ativos (Transparência)
          </button>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'registro' ? <RegistroRWA /> : <ConsultaRWA />}
      </div>
    </div>
  );
}

function MainApp() {
  const [route, setRoute] = useState<'intro' | 'dashboard'>('intro');
  const { status, txHash } = useVereda();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Activity Feed Event Sync Requirement
    if (status === 'success') {
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-charcoal-950 transition-colors relative pb-20">
      <Navbar onNavigate={(page) => setRoute(page as 'intro' | 'dashboard')} />
      
      {route === 'intro' && <IntroPage onEnter={() => setRoute('dashboard')} />}
      {route === 'dashboard' && <Dashboard />}

      {/* YELLOW BELT: Activity Feed - Stream contract events as notifications */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 bg-forest-900 border border-forest-500 rounded-xl p-4 shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-8 fade-in z-50 max-w-sm">
          <div className="bg-forest-500 p-2 rounded-full text-white">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm leading-tight">Novo Evento On-Chain Recebido</h4>
            <p className="text-forest-200 text-xs font-mono truncate mt-1">Hash: {txHash?.slice(0, 15)}...</p>
          </div>
        </div>
      )}
    </div>
  )
}

import { VeredaProvider } from '@vereda/sdk';

export default function App() {
  return (
    <VeredaProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </VeredaProvider>
  );
}