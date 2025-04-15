import { useState } from "react";

const API_URL = "http://localhost:5001/api/auth/login";

export function useAuth() {
    const [account, setAccount] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    async function loginWithMetaMask() {
        if (!window.ethereum) {
            alert("MetaMask не установлен");
            return;
        }

        const [address] = await window.ethereum.request({ method: "eth_requestAccounts" });
        const message = "Login to dApp";

        const signature = await window.ethereum.request({
            method: "personal_sign",
            params: [message, address]
        });

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                address,
                message,
                signature
            })
        });

        if (!response.ok) {
            const error = await response.text();
            alert(`Ошибка авторизации: ${error}`);
            return;
        }

        const data = await response.json();
        setAccount(address);
        setRole(data.role);
        setToken(data.token);

        // Сохраняем токен в localStorage для последующих запросов
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("address", address);
    }

    return {
        loginWithMetaMask,
        account,
        role,
        token
    };
}
