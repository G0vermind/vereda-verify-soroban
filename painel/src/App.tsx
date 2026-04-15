import { useState } from 'react';
import { isConnected, requestAccess } from '@stellar/freighter-api';
import './App.css';

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      console.log("Verificando conexão...");
      const connected = await isConnected();
      console.log("Status de conexão:", connected);

      if (connected) {
        console.log("Pedindo acesso...");
        // A Freighter moderna devolve um objeto, precisamos extrair a propriedade .address
        const response = await requestAccess();
        console.log("Resposta da Freighter:", response);

        if (response && response.address) {
          setWalletAddress(response.address);
        } else if (response && response.error) {
          alert("Erro da carteira: " + response.error);
        }
      } else {
        alert('Freighter Wallet não detectada. Verifique se ela está desbloqueada.');
      }
    } catch (e) {
      console.error("Falha geral:", e);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh', paddingTop: '20px' }}>
      <h1>🌳 Vereda.Verify - Painel do Técnico</h1>
      {!walletAddress ? (
        <button onClick={connectWallet} style={{ padding: '10px 20px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#042f14', color: 'white', border: 'none', borderRadius: '5px' }}>
          Conectar Freighter Wallet
        </button>
      ) : (
        <div style={{ padding: '20px', border: '1px solid #ccc', display: 'inline-block', borderRadius: '8px', backgroundColor: 'white' }}>
          <p style={{ color: 'green', fontSize: '18px' }}>
            ✅ Técnico Autenticado
          </p>
          <p><strong>Carteira:</strong> {walletAddress.slice(0, 5)}...{walletAddress.slice(-5)}</p>
          <button onClick={() => setWalletAddress(null)} style={{ padding: '8px 16px', cursor: 'pointer', marginTop: '10px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '5px' }}>
            Desconectar
          </button>
        </div>
      )}
    </div>
  );
}

export default App;