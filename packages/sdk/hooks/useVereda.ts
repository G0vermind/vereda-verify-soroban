import { useState, useCallback } from 'react';
import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull';
import { AlbedoModule } from '@creit.tech/stellar-wallets-kit/modules/albedo';

StellarWalletsKit.init({
    network: Networks.TESTNET,
    modules: [
        new FreighterModule(),
        new xBullModule(),
        new AlbedoModule()
    ]
});

export const useVereda = () => {
    const [address, setAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const connect = useCallback(async () => {
        try {
            setError(null);
            const { address } = await StellarWalletsKit.authModal();
            setAddress(address);
        } catch (err) {
            setError('Falha na conexão Multiwallet.');
        }
    }, []);

    return { address, connect, isConnected: !!address, error };
};