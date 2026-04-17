import { ShieldCheck, X } from 'lucide-react';

interface WalletModalProps {
  onSelect: (walletId: string) => void;
  onClose: () => void;
}

export function WalletModal({ onSelect, onClose }: WalletModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors">
          <X size={24} />
        </button>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Conectar Carteira</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">Selecione seu provedor corporativo na Blockchain Stellar.</p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => onSelect('freighter')}
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-charcoal-800 bg-gray-50 dark:bg-charcoal-950 hover:border-forest-500 hover:bg-forest-50 dark:hover:bg-forest-900/30 transition-all font-semibold text-gray-800 dark:text-gray-200"
          >
            <ShieldCheck className="text-forest-500" />
            Freighter (Recomendado B2B)
          </button>
          <button 
            onClick={() => onSelect('albedo')}
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-charcoal-800 bg-gray-50 dark:bg-charcoal-950 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all font-semibold text-gray-800 dark:text-gray-200"
          >
            <ShieldCheck className="text-blue-500" />
            Albedo Link
          </button>
        </div>
      </div>
    </div>
  );
}
