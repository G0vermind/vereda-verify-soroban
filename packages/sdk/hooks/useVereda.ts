import { useState, useCallback } from 'react';
import {
    StellarWalletsKit,
    WalletNetwork,
    allowAllModules,
    FREIGHTER_ID
} from '@creit.tech/stellar-wallets-kit';

// Kit inicializado com todos os módulos disponíveis
const kit = new StellarWalletsKit({
    network: WalletNetwork.TESTNET,
    selectedWalletId: FREIGHTER_ID,
    modules: allowAllModules(),
});

export const useVereda = () => {
    const [address, setAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const connect = useCallback(async () => {
        try {
            setError(null);

            await kit.openModal({
                onWalletSelected: async (option) => {
                    kit.setWallet(option.id);
                    const { address } = await kit.getAddress();
                    setAddress(address);
                },
            });

        } catch (err) {
            console.error('Erro ao conectar:', err);
            setError('Falha na conexão com a carteira');
        }
    }, []);

    const disconnect = useCallback(() => {
        setAddress(null);
        setError(null);
    }, []);

    return {
        address,
        connect,
        disconnect,
        isConnected: !!address,
        error,
    };
};