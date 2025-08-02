import React from "react";
import { ArrowRight } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { API_ENDPOINTS } from "../shared/config";
import { ethers } from "ethers";

interface LoginPageProps {
    onConnected: () => void;
}

export default function LoginPage({ onConnected }: LoginPageProps) {
    const { setAccount, setSigner, setProvider } = useWallet();

    const handleConnect = async () => {
        if (!window.ethereum) {
            alert("Установите MetaMask!");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            setProvider(provider);
            setSigner(signer);
            setAccount(address);

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
            onConnected();
        } catch (error) {
            console.error("Ошибка авторизации:", error);
            alert("Ошибка авторизации или подключения к MetaMask");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-100 via-white to-blue-100">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-80 text-center">
                <h1 className="text-4xl font-semibold mb-2 text-gray-800">👋 Привет!</h1>
                <p className="text-gray-500 mb-6">Добро пожаловать</p>

                <button
                    onClick={handleConnect}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full flex items-center justify-center w-full transition"
                >
                    Подключить MetaMask <ArrowRight className="ml-2 h-5 w-5" />
                </button>

                <p className="text-xs text-gray-400 mt-6">
                    Нет аккаунта? <span className="text-black font-semibold">Зарегистрируйтесь</span>
                </p>
            </div>
        </div>
    );
}
