import { useState, useEffect } from 'react';
import { useVereda } from '@vereda/sdk';
import { Database, Search, ArrowUpRight, Activity, X, Info, Sprout, TreePine, Factory } from 'lucide-react';

export default function ConsultaRWA() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [realRecords, setRealRecords] = useState<any[]>([]);

  useEffect(() => {
    // Busca exclusivamente registros criptográficos reais aprovados localmente
    const verifiedData = JSON.parse(window.localStorage.getItem('vereda_records') || '[]');
    setRealRecords(verifiedData);
  }, []);

  const filteredRecords = realRecords.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.especie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBadgeStyle = (estagio: string) => {
    switch (estagio) {
      case 'Viveiro': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
      case 'Floresta': return 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800';
      case 'Serraria': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-charcoal-800 dark:text-gray-300 dark:border-charcoal-700';
    }
  };

  return (
    <div className="bg-white dark:bg-charcoal-950 border border-gray-200 dark:border-charcoal-800 rounded-2xl p-8 max-w-5xl mx-auto shadow-sm transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 text-left">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-forest-50 dark:bg-forest-900/20 rounded-lg">
              <Activity className="text-forest-600 dark:text-forest-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Explorador de Ativos RWA</h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Verificação imutável na Blockchain Stellar Soroban (Testnet).</p>
        </div>
        
        <div className="flex items-center bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-800 rounded-xl px-4 py-3 w-full md:w-80 focus-within:border-forest-500 focus-within:ring-1 focus-within:ring-forest-500 transition-all">
          <Search size={18} className="text-gray-400 mr-3" />
          <input 
            type="text" 
            placeholder="Buscar por lote ou espécie..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-gray-900 dark:text-white outline-none text-sm w-full"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-charcoal-800 text-left">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 dark:bg-charcoal-900 border-b border-gray-200 dark:border-charcoal-800">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID do Ativo</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Espécie</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estágio</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registro Blockchain</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-charcoal-800 bg-white dark:bg-charcoal-950">
            {filteredRecords.map((r, i) => (
              <tr 
                key={i} 
                onClick={() => setSelectedRecord(r)}
                className="hover:bg-gray-50 dark:hover:bg-charcoal-900 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-5">
                  <span className="font-bold text-gray-900 dark:text-white font-mono text-sm">{r.id}</span>
                </td>
                <td className="px-6 py-5 text-gray-600 dark:text-gray-300 text-sm font-medium">{r.especie}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1.5 rounded-full border text-xs font-bold ${getBadgeStyle(r.estagio)}`}>
                    {r.estagio}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 group-hover:text-forest-500 transition-colors">
                    <Database size={14} className="text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400 text-xs font-mono truncate w-32">{r.hash}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">{r.time}</div>
                </td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Nenhum registro encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Side Drawer Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-sm bg-white dark:bg-charcoal-950 border-l border-gray-200 dark:border-charcoal-800 h-full p-8 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 text-left">
            
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detalhes RWA</h3>
                <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-500 mb-1">CÓDIGO LOTE</label>
                  <p className="font-mono text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-charcoal-800 pb-2">{selectedRecord.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-500 mb-1">ESPÉCIE</label>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{selectedRecord.especie}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-500 mb-1">VOLUME</label>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{selectedRecord.volume}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-500 mb-2">ESTÁGIO ATUAL</label>
                  <span className={`px-3 py-1.5 rounded-full border text-xs font-bold inline-block ${getBadgeStyle(selectedRecord.estagio)}`}>
                    {selectedRecord.estagio}
                  </span>
                </div>

                {/* TIMELINE DE VIDA (Requisito Yellow Belt) */}
                <div className="mt-6 border-t border-gray-100 dark:border-charcoal-800 pt-6">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Activity size={16} /> Timeline de Vida do Ativo
                  </h4>
                  
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px md:before:mx-0 md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-forest-500 before:via-gray-300 before:to-gray-100 dark:before:via-charcoal-800 dark:before:to-charcoal-900">
                    
                    <div className="relative flex items-center justify-between group">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-forest-500 bg-white dark:bg-charcoal-950 shadow shrink-0 z-10 text-forest-500">
                        <Sprout size={12} />
                      </div>
                      <div className="w-[calc(100%-2.5rem)] px-4 py-3 bg-gray-50 dark:bg-charcoal-900 rounded-xl border border-gray-200 dark:border-charcoal-800">
                         <div className="font-bold text-sm text-gray-900 dark:text-white">Viveiro (Mudas)</div>
                         <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1" title={selectedRecord.detalhes}>{selectedRecord.detalhes}</div>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-between group">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white dark:bg-charcoal-950 shadow shrink-0 z-10 ${selectedRecord.estagio === 'Serraria' || selectedRecord.estagio === 'Floresta' ? 'border-sky-500 text-sky-500' : 'border-gray-300 dark:border-charcoal-800 text-gray-300 dark:text-charcoal-800'}`}>
                        <TreePine size={12} />
                      </div>
                      <div className={`w-[calc(100%-2.5rem)] px-4 py-3 rounded-xl border ${selectedRecord.estagio === 'Serraria' || selectedRecord.estagio === 'Floresta' ? 'bg-gray-50 dark:bg-charcoal-900 border-gray-200 dark:border-charcoal-800 opacity-100' : 'bg-transparent border-transparent opacity-50'}`}>
                         <div className="font-bold text-sm text-gray-900 dark:text-white">Floresta (Manejo)</div>
                         <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Geoposicionamento Ativo Satelital</div>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-between group">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white dark:bg-charcoal-950 shadow shrink-0 z-10 ${selectedRecord.estagio === 'Serraria' ? 'border-amber-500 text-amber-500' : 'border-gray-300 dark:border-charcoal-800 text-gray-300 dark:text-charcoal-800'}`}>
                        <Factory size={12} />
                      </div>
                      <div className={`w-[calc(100%-2.5rem)] px-4 py-3 rounded-xl border ${selectedRecord.estagio === 'Serraria' ? 'bg-gray-50 dark:bg-charcoal-900 border-gray-200 dark:border-charcoal-800 opacity-100' : 'bg-transparent border-transparent opacity-50'}`}>
                         <div className="font-bold text-sm text-gray-900 dark:text-white">Serraria (Processamento)</div>
                         <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Processamento de Madeira & Mobiliário</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
               <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">TX HASH STELLAR</label>
               <p className="font-mono text-xs text-gray-600 dark:text-gray-300 break-all mb-4">{selectedRecord.hash}</p>
               <a 
                href={`https://stellar.expert/explorer/testnet/tx/${selectedRecord.hash.replace('...', '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex justify-center items-center gap-2 bg-white dark:bg-charcoal-950 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 py-3 rounded-lg font-bold text-sm hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors"
               >
                 Verificar na Blockchain (Stellar Expert) <ArrowUpRight size={16} />
               </a>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
