import { ShieldCheck, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useVereda } from '@vereda/sdk';
import { useState } from 'react';
import { WalletModal } from './WalletModal';

export function Navbar({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { theme, toggleTheme } = useTheme();
  const { address, isConnected, connectKit, disconnect } = useVereda();
  const [showModal, setShowModal] = useState(false);

  const handleLogin = (walletId: string) => {
    connectKit(walletId);
    setShowModal(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-charcoal-950/80 backdrop-blur-md border-b border-gray-200 dark:border-charcoal-800 px-6 py-4 transition-colors">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('intro')}>
            <ShieldCheck className="text-forest-500 w-8 h-8 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">VEREDA <span className="text-forest-500">VERIFY</span></span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-charcoal-800 text-gray-600 dark:text-gray-300 transition-colors">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isConnected ? (
              <div className="flex gap-4 items-center">
                <button onClick={() => onNavigate('dashboard')} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-forest-500 transition-colors">Dashboard RWA</button>
                <div className="px-4 py-2 border border-forest-500/30 bg-forest-50 dark:bg-forest-900/20 text-forest-600 dark:text-forest-400 rounded-full text-xs font-mono font-bold tracking-wider">
                  {address?.slice(0, 4)}...{address?.slice(-4)}
                </div>
                <button 
                  onClick={() => { disconnect(); onNavigate('intro'); }} 
                  className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors" 
                  title="Desconectar"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowModal(true)}
                className="bg-forest-600 hover:bg-forest-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors shadow-lg shadow-forest-500/20"
              >
                Corporativo Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {showModal && <WalletModal onSelect={handleLogin} onClose={() => setShowModal(false)} />}
    </>
  );
}
