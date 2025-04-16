
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Signer, BrowserProvider } from "ethers";

interface WalletContextType {
    account: string | null;
    signer: Signer | null;
    provider: BrowserProvider | null;
    setSigner: (signer: Signer | null) => void;
    setProvider: (provider: BrowserProvider | null) => void;
    setAccount: (account: string | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [signer, setSigner] = useState<Signer | null>(null);
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [account, setAccount] = useState<string | null>(null);

    useEffect(() => {
        if (window.ethereum) {
            (window.ethereum as any).on("accountsChanged", () => {
                localStorage.removeItem("role");
                window.location.reload();
            });
        }
    }, []);

    return (
        <WalletContext.Provider value={{ signer, provider, account, setSigner, setProvider, setAccount }}>
            {children}
        </WalletContext.Provider>
    );
};
