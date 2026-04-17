import { useVereda } from '@vereda/sdk';
import { ShieldCheck, Cpu, Wallet } from 'lucide-react';

function App() {
  const { address, connect, isConnected, error } = useVereda();

  return (
    <div style={{ backgroundColor: '#09090b', color: '#fafafa', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ padding: '20px 50px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #27272a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={32} color="#3b82f6" />
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>VEREDA <span style={{ color: '#3b82f6' }}>VERIFY</span></span>
        </div>
        <span style={{ color: '#71717a', fontSize: '12px' }}>MASTERCLASS • V2.0 EVOLUTION</span>
      </nav>

      <main style={{ maxWidth: '800px', margin: '100px auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '56px', fontWeight: '900', marginBottom: '30px', letterSpacing: '-2px' }}>
          Conectividade <span style={{ color: '#3b82f6' }}>Multiwallet</span>
        </h1>

        {!isConnected ? (
          <button onClick={connect} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '18px 45px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '12px', boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)' }}>
            <Cpu size={22} /> Conectar Wallet
          </button>
        ) : (
          <div style={{ backgroundColor: '#18181b', padding: '40px', borderRadius: '20px', border: '1px solid #27272a' }}>
            <p style={{ color: '#22c55e', marginBottom: '15px', fontWeight: 'bold' }}>SISTEMA ON-CHAIN ATIVO</p>
            <code style={{ fontSize: '18px', color: '#3b82f6' }}>{address}</code>
          </div>
        )}
        {error && <p style={{ color: '#ef4444', marginTop: '20px' }}>{error}</p>}
      </main>
    </div>
  );
}

export default App;