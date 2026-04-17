import { useState } from 'react';
import { useVereda } from '@vereda/sdk';
import { Leaf, Box, Sprout, ShieldCheck, Loader2 } from 'lucide-react';

export default function PainelViveiro() {
  const { connectKit, isConnected, verifyAsset, status } = useVereda();

  const [formData, setFormData] = useState({
    especie: 'Khaya senegalensis',
    codigoLote: '',
    volume: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyAsset(formData);
  };

  return (
    <div style={{ backgroundColor: '#020617', padding: '30px', borderRadius: '16px', border: '1px solid #1e293b', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <Sprout color="#22c55e" size={28} />
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f8fafc', margin: 0 }}>Registro de Viveiro</h2>
      </div>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '30px' }}>
        Tokenização e Originação de Ativos Florestais (RWA).
      </p>

      {!isConnected ? (
        <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px dashed #334155' }}>
          <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '15px', fontWeight: '500' }}>
            Autenticação Corporativa Exigida:
          </p>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <button 
              onClick={() => connectKit('freighter')} 
              style={{ backgroundColor: '#1e293b', color: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #334155', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
              <ShieldCheck size={18} color="#38bdf8" /> Conectar Freighter
            </button>
            <button 
              onClick={() => connectKit('albedo')} 
              style={{ backgroundColor: '#1e293b', color: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #334155', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
              <ShieldCheck size={18} color="#818cf8" /> Conectar Albedo
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 'bold' }}>ESPÉCIE FLORESTAL</label>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '0 12px' }}>
              <Leaf size={18} color="#22c55e" />
              <input 
                type="text" 
                value={formData.especie}
                onChange={e => setFormData({...formData, especie: e.target.value})}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#f8fafc', padding: '12px', width: '100%', outline: 'none', fontSize: '15px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 'bold' }}>CÓDIGO DO LOTE (Rastreabilidade)</label>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '0 12px' }}>
              <Box size={18} color="#f59e0b" />
              <input 
                type="text" 
                placeholder="Ex: LOTE-2026-A1"
                value={formData.codigoLote}
                onChange={e => setFormData({...formData, codigoLote: e.target.value})}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#f8fafc', padding: '12px', width: '100%', outline: 'none', fontSize: '15px', textTransform: 'uppercase' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 'bold' }}>VOLUME (Qtd. de Mudas)</label>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '0 12px' }}>
              <Sprout size={18} color="#38bdf8" />
              <input 
                type="number" 
                placeholder="Ex: 5000"
                value={formData.volume}
                onChange={e => setFormData({...formData, volume: e.target.value})}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#f8fafc', padding: '12px', width: '100%', outline: 'none', fontSize: '15px' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status === 'pending' || !formData.codigoLote}
            style={{ marginTop: '10px', backgroundColor: status === 'pending' ? '#334155' : '#22c55e', color: '#020617', padding: '16px', borderRadius: '8px', border: 'none', cursor: status === 'pending' ? 'not-allowed' : 'pointer', fontWeight: '900', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: 'background 0.2s' }}>
            {status === 'pending' ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
            {status === 'pending' ? 'Registrando na Blockchain...' : 'Assinar e Salvar (RWA)'}
          </button>
        </form>
      )}
    </div>
  );
}
