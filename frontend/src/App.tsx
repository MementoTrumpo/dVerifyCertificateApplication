import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { WalletProvider, useWallet } from "./context/WalletContext";

import ConnectWallet from "./components/ConnectWallet";
import UploadCertificate from "./components/UploadCertificate";
import CheckCertificate from "./components/CheckCertificate";
import RoleManagement from "./components/RoleManagement";
import HomePage from "./components/HomePage";

import { AnimatePresence, motion } from "framer-motion";

function AnimatedPage({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
}

function AppContent() {
    const { account, provider } = useWallet();
    const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
    const location = useLocation();

    useEffect(() => {
        const stored = localStorage.getItem("role");
        setRole(stored);
    }, [account]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <ConnectWallet />

            {account && (
                <>
                    <nav className="flex space-x-6 mt-6 mb-10 text-lg font-medium">
                        <Link to="/" className="hover:underline">Главная</Link>
                        <Link to="/upload" className="hover:underline">Загрузить сертификат</Link>
                        <Link to="/verify" className="hover:underline">Проверить сертификат</Link>
                        {role === "Admin" && <Link to="/roles" className="hover:underline">Управление ролями</Link>}
                    </nav>

                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
                            <Route path="/upload" element={<AnimatedPage><UploadCertificate /></AnimatedPage>} />
                            <Route path="/verify" element={<AnimatedPage><CheckCertificate provider={provider} /></AnimatedPage>} />
                            <Route path="/roles" element={<AnimatedPage><RoleManagement /></AnimatedPage>} />
                        </Routes>
                    </AnimatePresence>
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
