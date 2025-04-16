import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ConnectWallet from "./components/ConnectWallet";
import UploadCertificate from "./components/UploadCertificate";
import CheckCertificate from "./components/CheckCertificate";
import RoleManagement from "./components/RoleManagement";
import { WalletProvider, useWallet } from "./context/WalletContext";
import { useEffect, useState } from "react";

function AppContent() {
    const { account, signer, provider } = useWallet();
    const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

    useEffect(() => {
        const stored = localStorage.getItem("role");
        setRole(stored);
    }, [account]);

    return (
        <div className="p-6 min-h-screen flex flex-col items-center bg-gray-100">
            <ConnectWallet />
            {account && (
                <>
                    <nav className="flex space-x-4 mt-6 mb-8">
                        <Link to="/">Главная</Link>
                        <Link to="/upload">Загрузить сертификат</Link>
                        <Link to="/verify">Проверить сертификат</Link>
                        {role === "Admin" && <Link to="/roles">Управление ролями</Link>}
                    </nav>
                    <Routes>
                        <Route path="/" element={<div>Добро пожаловать в систему управления сертификатами!</div>} />
                        <Route path="/upload" element={<UploadCertificate/>} />
                        <Route path="/verify" element={<CheckCertificate provider={provider} />} />
                        <Route path="/roles" element={<RoleManagement />} />
                    </Routes>
                </>
            )}
        </div>
    );
}

export default function App() {
    return (
        <WalletProvider>
            <Router>
                <AppContent />
            </Router>
        </WalletProvider>
    );
}
