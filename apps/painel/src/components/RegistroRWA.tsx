import { useState, useEffect } from 'react';
import { useVereda } from '@vereda/sdk';
import { Sprout, TreePine, Factory, ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegistroRWA() {
  const { verifyAsset, status, address, error: contractError, txHash } = useVereda();
  const [stage, setStage] = useState<'Viveiro' | 'Floresta' | 'Serraria'>('Viveiro');
  const [localError, setLocalError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    codigoLote: '',
    especie: 'Khaya senegalensis',
    volume: '',
    geolocalizacao: '',
    produtoFinal: ''
  });

  useEffect(() => {
    // Limpa erros locais se o status voltar para idle ou pending
    if (status === 'pending') setLocalError(null);
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // ERRO 3 (Requisito Yellow Belt): Erro de Validação no Frontend
    if (!formData.codigoLote || !formData.especie) {
       setLocalError('Erro 3: Por favor, preencha todos os campos obrigatórios antes de assinar.');
       return;
    }

    if (stage === 'Viveiro' && !formData.volume) {
       setLocalError('Erro 3: Defina a quantidade de mudas antes de continuar.');
       return;
    }

    if (stage === 'Floresta' && (!formData.geolocalizacao || !formData.volume)) {
       setLocalError('Erro 3: Dados de GPS e Volume Arbóreo são obrigatórios para a fase florestal.');
       return;
    }
    
    if (stage === 'Serraria' && (!formData.volume || !formData.produtoFinal)) {
      setLocalError('Erro 3: Insira o Volume Final e a Destinação detalhada do produto madeireiro.');
      return;
    }

    // --- REQUISITO YELLOW BELT: MERKLE TREE HIERARCHY ---
    // A partir da fase Florestal, os dados criptográficos são amarrados obrigatoriamente
    // ao hash da transação inicial de forma a construir a cadeia histórica do ativo.
    let parentHash = null;
    if (stage !== 'Viveiro') {
      const historicalRecords = JSON.parse(window.localStorage.getItem('vereda_records') || '[]');
      if (historicalRecords.length === 0) {
         setLocalError('Erro: Cadeia Merkle Rompida. Você precisa ter registrado ao menos um Viveiro primeiro para gerar o Parent Hash desta operação.');
         return;
      }
      parentHash = historicalRecords[0].hash;
    }

    verifyAsset({ stage, parentHash, ...formData });
  };

  const displayError = localError || contractError; // O contractError trará os Erros 1 e 2 do hook

  if (!address) {
    return (
      <div className="bg-white dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-800 rounded-2xl p-12 text-center shadow-sm">
        <ShieldCheck className="mx-auto text-gray-400 dark:text-gray-600 w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Autenticação Necessária</h2>
        <p className="text-gray-500 dark:text-gray-400">Por favor, conecte sua conta corporativa usando o botão de Login na barra superior para acessar o sistema de registros RWA.</p>
      </div>
    );
  }

  // TELA DE SUCESSO DO YELLOW BELT (Mostrando Hash)
  if (status === 'success' && txHash) {
     return (
      <div className="bg-white dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-800 rounded-2xl p-12 text-center shadow-sm max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto bg-forest-50 dark:bg-forest-900/30 w-24 h-24 rounded-full flex items-center justify-center mb-6">
           <CheckCircle2 className="text-forest-500 w-12 h-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Registro Consolidado!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Os dados do ativo ESG foram protegidos de forma irrefutável pela Soroban Network e já estão em posse dos validadores.</p>
        
        <div className="bg-gray-50 dark:bg-charcoal-950 p-6 rounded-xl border border-gray-200 dark:border-charcoal-800 text-left">
           <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Hash da Transação (TX)</p>
           <p className="font-mono text-sm text-forest-600 dark:text-forest-400 break-all bg-white dark:bg-charcoal-900 p-3 rounded-lg border border-gray-100 dark:border-charcoal-800">{txHash}</p>
        </div>
        
        <button onClick={() => window.location.reload()} className="mt-8 bg-charcoal-800 dark:bg-white text-white dark:text-charcoal-950 font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform">
           Realizar Novo Registro
        </button>
      </div>
     )
  }

  return (
    <div className="bg-white dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-800 rounded-2xl p-8 max-w-2xl mx-auto shadow-sm">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Novo Registro de Lote</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Adicione um novo evento à esteira de rastreabilidade do ativo on-chain.</p>
      </div>
      
      {/* EXIBIÇÃO DE ERROS (ERRO 1, ERRO 2 ou ERRO 3) */}
      {displayError && (
        <div className="mb-6 p-4 rounded-xl flex gap-3 text-left border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 animate-in fade-in duration-300">
           <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
           <div className="text-sm font-semibold">{displayError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 tracking-wider">ESTÁGIO RWA</label>
          <div className="grid grid-cols-3 gap-3">
            <button 
              type="button"
              onClick={() => setStage('Viveiro')}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${stage === 'Viveiro' ? 'bg-forest-50 dark:bg-forest-900/40 border-forest-500 text-forest-700 dark:text-forest-400 shadow-sm' : 'bg-transparent border-gray-200 dark:border-charcoal-800 text-gray-500 hover:border-gray-300 dark:hover:border-charcoal-700'}`}
            >
              <Sprout size={24} />
              <span className="font-bold text-sm">Viveiro</span>
            </button>
            <button 
              type="button"
              onClick={() => setStage('Floresta')}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${stage === 'Floresta' ? 'bg-forest-50 dark:bg-forest-900/40 border-forest-500 text-forest-700 dark:text-forest-400 shadow-sm' : 'bg-transparent border-gray-200 dark:border-charcoal-800 text-gray-500 hover:border-gray-300 dark:hover:border-charcoal-700'}`}
            >
              <TreePine size={24} />
              <span className="font-bold text-sm">Floresta</span>
            </button>
            <button 
              type="button"
              onClick={() => setStage('Serraria')}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${stage === 'Serraria' ? 'bg-forest-50 dark:bg-forest-900/40 border-forest-500 text-forest-700 dark:text-forest-400 shadow-sm' : 'bg-transparent border-gray-200 dark:border-charcoal-800 text-gray-500 hover:border-gray-300 dark:hover:border-charcoal-700'}`}
            >
              <Factory size={24} />
              <span className="font-bold text-sm">Serraria</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-charcoal-800">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 tracking-wider">CÓDIGO DE RASTREABILIDADE (Lote)</label>
            <input 
              type="text" 
              placeholder="Ex: KSA-01-VIV"
              value={formData.codigoLote}
              onChange={e => setFormData({...formData, codigoLote: e.target.value})}
              className="w-full bg-gray-50 dark:bg-charcoal-950 border border-gray-200 dark:border-charcoal-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-all font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 tracking-wider">ESPÉCIE</label>
            <select 
              value={formData.especie}
              onChange={e => setFormData({...formData, especie: e.target.value})}
              className="w-full bg-gray-50 dark:bg-charcoal-950 border border-gray-200 dark:border-charcoal-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-all"
            >
              <option value="Khaya senegalensis">Khaya senegalensis (Mogno Africano)</option>
              <option value="Khaya grandifoliola">Khaya grandifoliola (Mogno Africano)</option>
              <option value="Jucá">Jucá (Pau-ferro)</option>
            </select>
          </div>

          {(stage === 'Viveiro') && (
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 tracking-wider">VOLUME (Qtd. de Mudas)</label>
              <input 
                type="number" 
                placeholder="Ex: 5000"
                value={formData.volume}
                onChange={e => setFormData({...formData, volume: e.target.value})}
                className="w-full bg-gray-50 dark:bg-charcoal-950 border border-gray-200 dark:border-charcoal-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-all"
              />
            </div>
          )}

          {(stage === 'Floresta') && (
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 tracking-wider">LOCALIZAÇÃO (Geohash / Coordenadas)</label>
              <input 
                type="text" 
                placeholder="-15.8267, -47.9218"
                value={formData.geolocalizacao}
                onChange={e => setFormData({...formData, geolocalizacao: e.target.value})}
                className="w-full bg-gray-50 dark:bg-charcoal-950 border border-gray-200 dark:border-charcoal-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-all font-mono"
              />
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mt-4 mb-2 tracking-wider">VOLUME ARBÓREO (Árvores plantadas)</label>
              <input 
                type="number" 
                placeholder="Ex: 3000"
                value={formData.volume}
                onChange={e => setFormData({...formData, volume: e.target.value})}
                className="w-full bg-gray-50 dark:bg-charcoal-950 border border-gray-200 dark:border-charcoal-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-all"
              />
            </div>
          )}

          {(stage === 'Serraria') && (
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 tracking-wider">VOLUME LÍQUIDO FINAL (m³)</label>
              <input 
                type="number" 
                placeholder="Ex: 15.5"
                value={formData.volume}
                onChange={e => setFormData({...formData, volume: e.target.value})}
                className="w-full bg-gray-50 dark:bg-charcoal-950 border border-gray-200 dark:border-charcoal-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-all"
              />
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mt-4 mb-2 tracking-wider">PRODUTO DESTINADO</label>
              <input 
                type="text" 
                placeholder="Ex: Pranchas de Madeira Luxo"
                value={formData.produtoFinal}
                onChange={e => setFormData({...formData, produtoFinal: e.target.value})}
                className="w-full bg-gray-50 dark:bg-charcoal-950 border border-gray-200 dark:border-charcoal-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-all"
              />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={status === 'pending'}
          className="w-full bg-forest-600 hover:bg-forest-500 disabled:bg-gray-300 dark:disabled:bg-charcoal-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-bold text-lg transition-colors flex justify-center items-center gap-3 shadow-lg shadow-forest-500/20"
        >
           {status === 'pending' ? <Loader2 className="animate-spin w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          {status === 'pending' ? 'A processar na Blockchain...' : 'Assinar e Registar'}
        </button>
      </form>
    </div>
  );
}
