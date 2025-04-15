import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

interface WalletContextProps {
    account: string | null;
    signer: ethers.Signer | null;
    provider: ethers.BrowserProvider | null;
    connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextProps>({
    account: null,
    signer: null,
    provider: null,
    connectWallet: async () => {},
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

    const connectWallet = async () => {
        if (!window.ethereum) return alert("Установите MetaMask!");

        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        await browserProvider.send("eth_requestAccounts", []);
        const signer = await browserProvider.getSigner();
        const address = await signer.getAddress();

        setProvider(browserProvider);
        setSigner(signer);
        setAccount(address);
    };

    useEffect(() => {
        connectWallet().catch(console.error);
    }, []);

    return (
        <WalletContext.Provider value={{ account, signer, provider, connectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
