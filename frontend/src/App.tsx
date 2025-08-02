import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import UploadCertificate from "./components/UploadCertificate";
import CheckCertificate from "./components/CheckCertificate";
import RoleManagement from "./components/RoleManagement";
import MyIssuedCertificates from "./components/MyCertificates";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import CheckPage from "./components/CheckPage";
import VerifierCertificatesPage from "./components/VerifierCertificatesPage";
import { WalletProvider, useWallet } from "./context/WalletContext";
import { API_ENDPOINTS } from "./shared/config";

function AppContent() {
    const { account, provider } = useWallet();
    const location = useLocation();
    const navigate = useNavigate();
    const [role, setRole] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasUserCertificates, setHasUserCertificates] = useState(false);

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);
        if (account) {
            setIsAuthenticated(true);
            if (storedRole === "Issuer") navigate("/upload");
            else if (storedRole === "Admin") navigate("/roles");
            else navigate("/");
        }
    }, [account]);

    useEffect(() => {
        const fetchCertificates = async () => {
            if (!account || role !== "Verifier") return;
            try {
                const res = await fetch(API_ENDPOINTS.CERTIFICATES.ownedBy(account));
                const data = await res.json();
                console.log("Ответ от API (owned-by):", data);
                setHasUserCertificates(Array.isArray(data) && data.length > 0);
            } catch {
                setHasUserCertificates(false);
            }
        };
        fetchCertificates();
    }, [account, role]);

    const handleConnect = async () => {
        setIsAuthenticated(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-100 via-white to-blue-100 relative">
            {isAuthenticated && <Navbar role={role} hasUserCertificates={hasUserCertificates} />}
            <main className="max-w-5xl mx-auto px-4 pt-10 pb-6">
            <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/check" element={<CheckPage />} />
                        <Route path="/login" element={<LoginPage onConnected={handleConnect} />} />
                        {isAuthenticated ? (
                            <>
                                <Route path="/" element={<HomePage />} />
                                {role === "Issuer" && <Route path="/upload" element={<UploadCertificate />} />}
                                <Route path="/verify" element={<CheckCertificate provider={provider} />} />
                                {role === "Admin" && <Route path="/roles" element={<RoleManagement />} />}
                                {role === "Issuer" && <Route path="/my-certificates" element={<MyIssuedCertificates />} />}
                                {role === "Verifier" && hasUserCertificates && (
                                    <Route path="/my-certificates-view" element={<VerifierCertificatesPage />} />
                                )}
                                <Route path="*" element={<Navigate to="/" />} />
                            </>
                        ) : (
                            <Route path="*" element={<Navigate to="/login" />} />
                        )}
                    </Routes>
                </AnimatePresence>
            </main>
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
