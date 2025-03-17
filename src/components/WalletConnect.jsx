import React, { useState } from 'react';
import { web3 } from '../web3';

const WalletConnect = ({ setAccount }) => {
    const [connected, setConnected] = useState(false);

    const connectWallet = async () => {
        try {
            const accounts = await web3.eth.requestAccounts();
            setAccount(accounts[0]);
            setConnected(true);
        } catch (error) {
            console.error("Gagal menghubungkan ke wallet:", error);
        }
    };

    return (
        <div>
            {connected ? (
                <p>Wallet Terhubung ✅</p>
            ) : (
                <button onClick={connectWallet}>Hubungkan MetaMask</button>
            )}
        </div>
    );
};

export default WalletConnect;
