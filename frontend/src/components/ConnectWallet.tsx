import { useState } from "react";
import { API_ENDPOINTS } from "../shared/config";
import { useWallet } from "../context/WalletContext";
import { ethers } from "ethers";

export default function ConnectWallet() {
    const { account, setAccount, setSigner, setProvider } = useWallet();
    const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Установите MetaMask!");
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setProvider(provider);
        setSigner(signer);
        setAccount(address);

        try {
            const nonceRes = await fetch(`${API_ENDPOINTS.AUTH.NONCE}?address=${address}`);
            const { nonce } = await nonceRes.json();

            const message = `Authentication nonce: ${nonce}`;
            const signature = await signer.signMessage(message);

            const loginRes = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address, signature }),
            });

            const { token, role } = await loginRes.json();
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            setRole(role);
        } catch (error) {
            console.error("Ошибка авторизации:", error);
            alert("Ошибка авторизации или подключения к MetaMask");
        }
    };

    return (
        <div className="text-center my-6">
            <button
                onClick={connectWallet}
                className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition"
            >
                {account ? `🔌 ${account.slice(0, 6)}...` : "Подключить MetaMask"}
            </button>
            {role && (
                <p className="mt-3 text-gray-600">
          <span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm">
            Роль: {role}
          </span>
                </p>
            )}
        </div>
    );
}