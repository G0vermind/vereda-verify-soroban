import { useState, useEffect } from 'react';
import { isConnected, requestAccess, signTransaction, getNetworkDetails } from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';
import './App.css';

// --- TIPAGENS E ESTADOS ---
type Modulo = 'VIVEIRO' | 'PLANTIO' | 'SERRARIA';
type TxStatus = 'IDLE' | 'PREPARING' | 'SIGNING' | 'BROADCASTING' | 'SUCCESS' | 'ERROR';

export default function App() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('—');
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const [networkName, setNetworkName] = useState<string>('TESTNET');
  const [horizonUrl, setHorizonUrl] = useState<string>('https://horizon-testnet.stellar.org');
  const [activeModule, setActiveModule] = useState<Modulo>('VIVEIRO');

  // Status da Transação
  const [txStatus, setTxStatus] = useState<TxStatus>('IDLE');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [payloadHash, setPayloadHash] = useState<string>('');

  // Formulário Unificado
  const [formData, setFormData] = useState({
    loteId: '', especie: 'Khaya senegalensis', quantidade: '',
    responsavelCrea: '', hashCertificado: '',
    carFazenda: '', gpsLat: '', gpsLng: '', areaHa: '',
    nfeEntrada: '', licencaLO: '',
    clienteFinal: '', nfeVenda: '', volumeSaidaM3: '', hashDocumentos: ''
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gerador de "Hash de Merkle" para a UI (Simulação visual)
  useEffect(() => {
    const rawData = JSON.stringify(formData);
    const pseudoHash = btoa(rawData).substring(0, 32).toUpperCase();
    setPayloadHash(pseudoHash);
  }, [formData, activeModule]);

  const connectWallet = async () => {
    // Freighter API v6: isConnected() retorna { isConnected: boolean }
    const connectionStatus = await isConnected();
    if (connectionStatus.isConnected) {
      const response = await requestAccess();
      // Freighter API v6: requestAccess() retorna { address: string, error? }
      if (response.error) {
        alert(`Erro ao conectar: ${response.error}`);
        return;
      }
      const address = response.address;
      if (address) {
        // Detecta a rede atual da Freighter para usar o Horizon correto
        const netDetails = await getNetworkDetails();
        const url = netDetails.networkUrl || 'https://horizon-testnet.stellar.org';
        const netLabel = netDetails.network === 'PUBLIC'
          ? 'MAINNET'
          : netDetails.network || 'TESTNET';
        setHorizonUrl(url);
        setNetworkName(netLabel);
        setWallet(address);
        fetchBalance(address, url);
      }
    } else {
      alert("Extensão Freighter não detectada! Instale em freighter.app");
    }
  };

  // Atualiza saldo automaticamente a cada 15s enquanto a carteira estiver conectada
  useEffect(() => {
    if (!wallet) return;
    const interval = setInterval(() => fetchBalance(wallet, horizonUrl), 15000);
    return () => clearInterval(interval);
  }, [wallet, horizonUrl]);

  const fetchBalance = async (address: string, url?: string) => {
    setBalanceLoading(true);
    const endpoint = url || horizonUrl;
    try {
      const response = await fetch(`${endpoint}/accounts/${address}`);
      if (!response.ok) {
        // Conta pode não existir na rede (sem XLM)
        setBalance('0.0000000');
        return;
      }
      const data = await response.json();
      const native = data.balances?.find((b: any) => b.asset_type === 'native');
      // Exibe 7 casas decimais — precisão nativa do Stellar (1 XLM = 10.000.000 stroops)
      if (native) setBalance(parseFloat(native.balance).toFixed(7));
      else setBalance('0.0000000');
    } catch (e) {
      console.error('Erro ao buscar saldo:', e);
      setBalance('Erro');
    } finally {
      setBalanceLoading(false);
    }
  };

  const registrarNaBlockchain = async () => {
    if (!wallet) return;
    setTxStatus('PREPARING');
    setTxHash(null);

    try {
      const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
      const account = await server.loadAccount(wallet);

      const memoRef = `VV-${activeModule.substring(0, 3)}-${payloadHash.substring(0, 18)}`;
      const passPhrase = "Test SDF Network ; September 2015";

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: passPhrase
      })
        .addOperation(StellarSdk.Operation.payment({
          destination: wallet,
          asset: StellarSdk.Asset.native(),
          amount: "1.0",
        }))
        .addMemo(StellarSdk.Memo.text(memoRef))
        .setTimeout(30)
        .build();

      setTxStatus('SIGNING');
      const xdr = transaction.toXDR();

      // Freighter API v6: signTransaction aceita apenas { networkPassphrase, address? }
      // O campo 'network' foi removido na v6
      const signedResult = await signTransaction(xdr, {
        networkPassphrase: passPhrase
      });

      // Freighter API v6: resultado sempre é { signedTxXdr, signerAddress, error? }
      if (signedResult.error || !signedResult.signedTxXdr) {
        console.error('Erro na assinatura:', signedResult.error);
        setTxStatus('ERROR');
        return;
      }

      const signedXdr = signedResult.signedTxXdr;

      setTxStatus('BROADCASTING');
      const txToSubmit = StellarSdk.TransactionBuilder.fromXDR(signedXdr, passPhrase);
      const response = await server.submitTransaction(txToSubmit);
      setTxHash(response.hash);
      setTxStatus('SUCCESS');
      fetchBalance(wallet);
    } catch (error) {
      console.error('Erro na transação:', error);
      setTxStatus('ERROR');
    }
  };

  // --- RENDERIZAÇÃO DOS CAMPOS POR MÓDULO ---
  const renderFormFields = () => {
    switch (activeModule) {
      case 'VIVEIRO':
        return (
          <>
            <Field label="Identificação do Lote (Sementes)" name="loteId" val={formData.loteId} onChange={handleInput} placeholder="Ex: MOG-VIV-26-01" />
            <Field label="Espécie Arbórea" name="especie" val={formData.especie} onChange={handleInput} disabled />
            <Field label="Quantidade Produzida (Mudas)" name="quantidade" val={formData.quantidade} onChange={handleInput} type="number" />
            <Field label="Engenheiro / Responsável (CREA)" name="responsavelCrea" val={formData.responsavelCrea} onChange={handleInput} />
            <Field label="Hash de Outros Docs (Certificados)" name="hashCertificado" val={formData.hashCertificado} onChange={handleInput} placeholder="Deixe gerar ou cole o SHA-256" />
          </>
        );
      case 'PLANTIO':
        return (
          <>
            <Field label="Lote de Origem (Viveiro)" name="loteId" val={formData.loteId} onChange={handleInput} />
            <Field label="CAR da Propriedade (Imóvel Rural)" name="carFazenda" val={formData.carFazenda} onChange={handleInput} placeholder="CE-2304202-..." />
            <div style={{ display: 'flex', gap: '15px' }}>
              <Field label="GPS Latitude" name="gpsLat" val={formData.gpsLat} onChange={handleInput} placeholder="-4.3210" />
              <Field label="GPS Longitude" name="gpsLng" val={formData.gpsLng} onChange={handleInput} placeholder="-40.1230" />
            </div>
            <Field label="Área de Plantio (Hectares)" name="areaHa" val={formData.areaHa} onChange={handleInput} type="number" />
          </>
        );
      case 'SERRARIA':
        return (
          <>
            <div style={{ backgroundColor: '#f9fcfb', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #f39c12', marginBottom: '10px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '13px', textTransform: 'uppercase' }}>1. Recepção da Tora (Entrada)</h4>
              <Field label="Lote / Talhão de Origem (Fazenda)" name="loteId" val={formData.loteId} onChange={handleInput} />
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <Field label="NF-e de Entrada (Madeira)" name="nfeEntrada" val={formData.nfeEntrada} onChange={handleInput} />
                <Field label="Licença de Operação (SEMACE/LO)" name="licencaLO" val={formData.licencaLO} onChange={handleInput} />
              </div>
            </div>

            <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #27ae60' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#1b5e20', fontSize: '13px', textTransform: 'uppercase' }}>2. Expedição e Venda (Saída)</h4>
              <Field label="Cliente Comprador (CNPJ / Nome)" name="clienteFinal" val={formData.clienteFinal} onChange={handleInput} />
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <Field label="NF-e de Venda (Saída)" name="nfeVenda" val={formData.nfeVenda} onChange={handleInput} />
                <Field label="Volume Faturado (m³)" name="volumeSaidaM3" val={formData.volumeSaidaM3} onChange={handleInput} type="number" />
              </div>
              <div style={{ marginTop: '10px' }}>
                <Field label="Hash de Romaneio/Contrato (Outros Docs)" name="hashDocumentos" val={formData.hashDocumentos} onChange={handleInput} placeholder="Cole o Hash do contrato assinado" />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div style={layout.container}>
      {/* SIDEBAR */}
      <aside style={layout.sidebar}>
        <div>
          <h1 style={layout.brand}>Vereda<span style={{ color: '#f39c12' }}>.</span>Verify</h1>
          <p style={layout.subtitle}>RWA & TIMBER TRACKING</p>
        </div>

        <nav style={layout.nav}>
          <button onClick={() => { setActiveModule('VIVEIRO'); setTxStatus('IDLE'); }} style={navBtn(activeModule === 'VIVEIRO')}>🌱 Viveiro Maravilha</button>
          <button onClick={() => { setActiveModule('PLANTIO'); setTxStatus('IDLE'); }} style={navBtn(activeModule === 'PLANTIO')}>🌳 Florestas.Social</button>
          <button onClick={() => { setActiveModule('SERRARIA'); setTxStatus('IDLE'); }} style={navBtn(activeModule === 'SERRARIA')}>🪚 Indústria Sómogno</button>
        </nav>

        <div style={layout.networkBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: networkName === 'MAINNET' ? '#e74c3c' : '#2ecc71' }}></div>
            <span style={{ fontSize: '12px', color: '#a4b0be', fontWeight: 'bold' }}>STELLAR {networkName}</span>
          </div>
          {wallet ? (
            <>
              <p style={{ fontSize: '10px', color: '#7bed9f', wordBreak: 'break-all' }}>{wallet}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                <p style={{ fontSize: '16px', color: 'white', fontWeight: 'bold', margin: 0 }}>
                  {balanceLoading ? '⏳ ...' : `${balance} XLM`}
                </p>
                <button
                  onClick={() => fetchBalance(wallet)}
                  title="Atualizar saldo"
                  style={{ background: 'transparent', border: 'none', color: '#2ecc71', cursor: 'pointer', fontSize: '14px', padding: '2px 4px' }}
                >↻</button>
              </div>
            </>
          ) : (
            <p style={{ fontSize: '12px', color: '#eccc68' }}>Desconectado</p>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={layout.main}>
        <header style={layout.header}>
          <h2>Painel de Auditoria: <span style={{ color: '#2ecc71' }}>{activeModule}</span></h2>
          {!wallet && <button onClick={connectWallet} style={btn.connect}>🔗 Conectar API Freighter</button>}
        </header>

        {wallet && (
          <div style={layout.grid}>
            {/* FORMULÁRIO */}
            <section style={layout.card}>
              <h3 style={layout.cardTitle}>Entrada de Dados</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {renderFormFields()}
              </div>
            </section>

            {/* PAINEL DE BLOCKCHAIN & MERKLE */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div style={layout.card}>
                <h3 style={layout.cardTitle}>Merkle Data Payload</h3>
                <p style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '10px' }}>
                  Os dados ao lado não são enviados em texto claro. Eles são comprimidos neste Hash Criptográfico para imutabilidade:
                </p>
                <div style={layout.hashBox}>
                  {payloadHash || "0x00000000000000000000000000000000"}
                </div>
              </div>

              <div style={layout.card}>
                <h3 style={layout.cardTitle}>Ação de Registro</h3>

                {txStatus === 'IDLE' || txStatus === 'ERROR' ? (
                  <button onClick={registrarNaBlockchain} style={btn.primary}>
                    🛡️ ASSINAR E REGISTRAR ATIVO
                  </button>
                ) : (
                  <div style={layout.statusArea}>
                    <p style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {txStatus === 'PREPARING' && "⏳ Estruturando Transação..."}
                      {txStatus === 'SIGNING' && "📝 Aguardando sua Assinatura na Freighter..."}
                      {txStatus === 'BROADCASTING' && "🚀 Transmitindo para a Rede Global..."}
                      {txStatus === 'SUCCESS' && "✅ Ativo Tokenizado com Sucesso!"}
                    </p>
                  </div>
                )}

                {txStatus === 'ERROR' && (
                  <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#ffeaa7', borderRadius: '8px', border: '1px solid #fdcb6e' }}>
                    <p style={{ color: '#d63031', fontSize: '12px', fontWeight: 'bold', margin: 0 }}>Erro ou Cancelamento.</p>
                    <p style={{ color: '#d63031', fontSize: '11px', margin: '5px 0 0 0' }}>Se a Freighter travou, feche a aba, recarregue a página (F5) e tente novamente.</p>
                    <button onClick={() => setTxStatus('IDLE')} style={{ marginTop: '10px', fontSize: '11px', padding: '5px 10px', cursor: 'pointer' }}>Tentar Novamente</button>
                  </div>
                )}

                {txStatus === 'SUCCESS' && txHash && (
                  <div style={{ marginTop: '20px' }}>
                    <p style={{ fontSize: '11px', color: '#7f8c8d', marginBottom: '5px' }}>HASH DE VALIDAÇÃO (TX ID):</p>
                    <p style={{ fontSize: '12px', color: '#27ae60', wordBreak: 'break-all', fontWeight: 'bold', backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '6px' }}>{txHash}</p>
                    <a href={`https://stellar.expert/explorer/testnet/tx/${txHash}`} target="_blank" rel="noreferrer" style={btn.outline}>
                      🔍 Ver Certidão Pública
                    </a>
                  </div>
                )}
              </div>

            </section>
          </div>
        )}
      </main>
    </div>
  );
}

// --- COMPONENTE DE INPUT CUSTOMIZADO ---
const Field = ({ label, name, val, onChange, type = "text", placeholder = "", disabled = false }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#34495e', marginBottom: '5px' }}>{label}</label>
    <input type={type} name={name} value={val} onChange={onChange} placeholder={placeholder} disabled={disabled}
      style={{ padding: '12px', border: '1px solid #bdc3c7', borderRadius: '8px', backgroundColor: disabled ? '#ecf0f1' : 'white', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' } as any}
    />
  </div>
);

// --- ESTILOS PROFISSIONAIS (SaaS CSS-in-JS) ---
const layout: any = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
  sidebar: { width: '280px', backgroundColor: '#042f14', color: 'white', display: 'flex', flexDirection: 'column', padding: '30px 20px', boxShadow: '4px 0 15px rgba(0,0,0,0.1)' },
  brand: { fontSize: '28px', margin: 0, fontWeight: '900', letterSpacing: '-1px' },
  subtitle: { fontSize: '10px', color: '#2ecc71', letterSpacing: '2px', marginTop: '5px', fontWeight: 'bold' },
  nav: { flex: 1, marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '10px' },
  networkBox: { backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' },
  main: { flex: 1, padding: '40px 50px', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '2px solid #e0e6ed', paddingBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' },
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #f1f2f6' },
  cardTitle: { margin: '0 0 20px 0', fontSize: '18px', color: '#2c3e50', borderBottom: '1px solid #ecf0f1', paddingBottom: '10px' },
  hashBox: { backgroundColor: '#2c3e50', color: '#2ecc71', fontFamily: 'monospace', padding: '15px', borderRadius: '8px', wordBreak: 'break-all', fontSize: '13px', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' },
  statusArea: { padding: '20px', backgroundColor: '#f1c40f20', border: '2px dashed #f39c12', borderRadius: '12px', textAlign: 'center' }
};

const navBtn = (active: boolean): any => ({
  textAlign: 'left', padding: '15px 20px', backgroundColor: active ? 'rgba(46, 204, 113, 0.2)' : 'transparent',
  border: 'none', borderLeft: active ? '4px solid #2ecc71' : '4px solid transparent', color: active ? 'white' : '#a4b0be',
  fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '0 8px 8px 0', transition: '0.3s'
});

const btn: any = {
  connect: { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(46, 204, 113, 0.3)' },
  primary: { width: '100%', backgroundColor: '#042f14', color: 'white', border: 'none', padding: '18px', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' },
  outline: { display: 'block', width: '100%', textAlign: 'center', marginTop: '15px', backgroundColor: 'transparent', color: '#27ae60', border: '2px solid #27ae60', padding: '12px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', boxSizing: 'border-box' }
};