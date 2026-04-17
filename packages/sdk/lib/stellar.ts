import {
    StellarWalletsKit,
    WalletNetwork,
    allowAllModules,
    FREIGHTER_ID
} from '@creit.tech/stellar-wallets-kit';
import * as StellarSdk from '@stellar/stellar-sdk';

export const NETWORK_DETAILS = {
    network: WalletNetwork.TESTNET,
    networkPassphrase: StellarSdk.Networks.TESTNET,
    rpcUrl: 'https://soroban-testnet.stellar.org',
};

export const kit = new StellarWalletsKit({
    network: NETWORK_DETAILS.network,
    selectedWalletId: FREIGHTER_ID,
    modules: allowAllModules(),
});

export const server = new StellarSdk.rpc.Server(NETWORK_DETAILS.rpcUrl);

export const horizonServer = new StellarSdk.Horizon.Server(
    'https://horizon-testnet.stellar.org'
);

export async function fetchAccountBalance(publicKey: string): Promise<string> {
    try {
        const account = await horizonServer.loadAccount(publicKey);
        const balance = account.balances.find((b: any) => b.asset_type === 'native');
        return balance ? parseFloat(balance.balance).toFixed(2) : '0.00';
    } catch (error) {
        return "0.00";
    }
}