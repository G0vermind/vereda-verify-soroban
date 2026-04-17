import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull';
import { AlbedoModule } from '@creit.tech/stellar-wallets-kit/modules/albedo';
import { Contract, TransactionBuilder, rpc, nativeToScVal } from '@stellar/stellar-sdk';

const CONTRACT_ID = 'CCTS6J4AQSJ2CZJ64BCFNWIGNZ3YBOA54ZVABACDPTEARTCABNMLB5XO';
const server = new rpc.Server("https://soroban-testnet.stellar.org");

StellarWalletsKit.init({
    network: Networks.TESTNET,
    modules: [
        new FreighterModule(),
        new xBullModule(),
        new AlbedoModule()
    ]
});

const VeredaContext = createContext<any>(null);

export const VeredaProvider = ({ children }: { children: React.ReactNode }) => {
    const [address, setAddress] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);

    const verifyAsset = useCallback(async (dadosDoFormulario: any) => {
        if (!address) {
            setError("Conecte a carteira primeiro.");
            return;
        }

        setStatus('pending');
        setError(null);
        setTxHash(null);

        try {
            const payloadString = typeof dadosDoFormulario === 'object'
                ? JSON.stringify(dadosDoFormulario)
                : String(dadosDoFormulario);

            const contract = new Contract(CONTRACT_ID);
            const txCall = contract.call(
                "verify_asset",
                nativeToScVal(address, { type: 'string' }),
                nativeToScVal(payloadString, { type: 'string' })
            );

            const account = await server.getAccount(address);
            const tx = new TransactionBuilder(account, { fee: "10000", networkPassphrase: Networks.TESTNET })
                .addOperation(txCall)
                .setTimeout(30)
                .build();

            // REQUISITO CRÍTICO SOROBAN: Preparar a transação para calcular o footprint (Sem isso a blockchain rejeita)
            const preparedTx: any = await server.prepareTransaction(tx);

            const { signedTxXdr } = await StellarWalletsKit.signTransaction(preparedTx.toXDR());
            const sendResponse = await server.sendTransaction(TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET));

            if (sendResponse.status !== "PENDING") throw new Error("Falha ao enviar para a rede");

            const txHash = sendResponse.hash;
            let getResponse = await server.getTransaction(txHash);

            while (getResponse.status === "NOT_FOUND") {
                await new Promise(r => setTimeout(r, 1000));
                getResponse = await server.getTransaction(txHash);
            }

            if (getResponse.status === "FAILED") {
                throw new Error("Transação falhou on-chain!");
            }

            // --- YELLOW BELT REAL INTEGRATION ---
            // Salva as transações originais perfeitamente gravadas pro Explorador carregar
            const existing = JSON.parse(window.localStorage.getItem('vereda_records') || '[]');
            const newRecord = {
                id: dadosDoFormulario.codigoLote || 'LOTE-X',
                especie: dadosDoFormulario.especie || 'Mogno',
                estagio: dadosDoFormulario.stage || 'Viveiro',
                volume: dadosDoFormulario.volume || '',
                hash: txHash,
                time: new Date().toLocaleString(),
                detalhes: payloadString,
            };
            window.localStorage.setItem('vereda_records', JSON.stringify([newRecord, ...existing]));
            // ------------------------------------

            setStatus('success');
            setTxHash(txHash);
            console.log("SUCESSO ON-CHAIN! Hash:", txHash);
            return txHash;

        } catch (err: any) {
            console.error("Erro no registro:", err);
            setStatus('error');
            setError('Transação rejeitada ou falha na rede Stellar/Soroban.');
        }
    }, [address]);

    const connectKit = useCallback(async (walletId?: string) => {
        try {
            setError(null);
            if (walletId) {
                StellarWalletsKit.setWallet(walletId);
                // ATUALIZADO: Chamar o módulo base obriga a extensão a despertar e pedir acessos na tela!
                const activeModule = StellarWalletsKit.selectedModule;
                const { address } = await activeModule.getAddress();
                setAddress(address);
            } else {
                const { address } = await StellarWalletsKit.authModal();
                setAddress(address);
            }
        } catch (e: any) {
            console.error("Erro na conexão multiwallet:", e);
            setError('Ação cancelada ou carteira não instalada.');
        }
    }, []);

    const disconnectSession = useCallback(async () => {
        try {
            await StellarWalletsKit.disconnect();
        } catch (e) {
            console.error("Erro no disconnect da extensão:", e);
        }
        setAddress(null);
        setStatus('idle');
        setError(null);
        setTxHash(null);
    }, []);

    return React.createElement(
        VeredaContext.Provider,
        { value: { address, connectKit, disconnect: disconnectSession, verifyAsset, status, error, isConnected: !!address, txHash } },
        children
    );
};

export const useVereda = () => useContext(VeredaContext);