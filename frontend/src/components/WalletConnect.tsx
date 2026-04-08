'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const connectWallet = async () => {
    setErrorMsg(null);
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
        }
      } catch (err: any) {
        console.error("Wallet connection failed:", err);
        setErrorMsg(err.message || 'Connection failed');
        setTimeout(() => setErrorMsg(null), 3000);
      }
    } else {
      setErrorMsg('MetaMask not found!');
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  return (
    <button
      onClick={connectWallet}
      className={`px-6 py-2 rounded-full font-semibold transition-all shadow-lg text-white ${
        errorMsg 
          ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50'
          : 'bg-green-500 hover:bg-green-600 shadow-green-500/50'
      }`}
    >
      {errorMsg ? errorMsg : address ? `Connected: ${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect MetaMask'}
    </button>
  );
}
