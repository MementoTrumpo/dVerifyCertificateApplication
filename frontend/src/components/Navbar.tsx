import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, Copy, Check } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import IpfsStatus from "./IpfsStatus";

export default function Navbar({ role, hasUserCertificates }: { role: string | null; hasUserCertificates?: boolean }) {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { account } = useWallet();
    const [copied, setCopied] = useState(false);
    const [copiedMobile, setCopiedMobile] = useState(false);

    const links = [
        { label: "Главная", to: "/", show: true },
        { label: "Загрузить", to: "/upload", show: role === "Issuer" },
        { label: "Проверка", to: "/verify", show: true },
        { label: "Мои сертификаты", to: "/my-certificates", show: role === "Issuer" },
        { label: "Мои сертификаты", to: "/my-certificates-view", show: role === "Verifier" && hasUserCertificates },
        { label: "Роли", to: "/roles", show: role === "Admin" },
    ];


    const handleLogout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("role");
        window.location.reload();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-full fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
            <div className="flex justify-between items-center py-2 px-4 md:px-8">
                {/* Название */}
                <div className="flex items-center gap-4">
                    <span className="text-xl font-semibold text-indigo-600 pr-3">dApp</span>

                    {/* Навигация (десктоп) */}
                    <div className="hidden md:flex gap-6 text-gray-700 text-base font-medium">
                        {links.filter((l) => l.show).map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`transition ${
                                    location.pathname === link.to
                                        ? "text-indigo-600 font-semibold"
                                        : "hover:text-indigo-500"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <IpfsStatus />

                    {/* Кошелёк и роль */}
                    {account && (
                        <div className="relative hidden md:flex" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdown((prev) => !prev)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
                            >
                                {account.slice(0, 6)}...{account.slice(-4)}
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            <AnimatePresence>
                                {dropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="absolute right-0 mt-2 w-56 bg-white shadow-md rounded-lg p-4 z-50"
                                    >
                                        <div className="text-sm mb-2">
                                            <span className="block text-gray-600 font-medium mb-1">Кошелёк</span>
                                            <div className="relative group max-w-[240px]">
                                                <span className="font-mono text-blue-600 text-xs break-all block pr-6">
                                                    {account}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(account);
                                                        setCopied(true);
                                                        setTimeout(() => setCopied(false), 1500);
                                                    }}
                                                    className="absolute right-0 top-0 text-gray-400 hover:text-indigo-600 transition"
                                                    title="Скопировать"
                                                >
                                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-sm mb-4">
                                            <span className="block text-gray-600 font-medium">Роль</span>
                                            <span className="text-gray-800">{role}</span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-sm bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-1 rounded transition"
                                        >
                                            Выйти
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Бургер */}
                <button className="md:hidden ml-auto" onClick={() => setOpen(!open)}>
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Мобильное меню */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white border-t px-4 pb-4"
                    >
                        <div className="flex flex-col gap-3">
                            {links.filter((l) => l.show).map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setOpen(false)}
                                    className={`block py-2 text-gray-800 ${
                                        location.pathname === link.to ? "text-indigo-600 font-semibold" : ""
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {account && (
                                <div className="mt-4 text-sm text-gray-700">
                                    <div className="mb-2">
                                        <span className="block text-gray-500 mb-1">Кошелёк:</span>
                                        <div className="relative group max-w-full">
                                            <span className="font-mono text-blue-600 text-xs break-all block pr-6">
                                                {account}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(account);
                                                    setCopiedMobile(true);
                                                    setTimeout(() => setCopiedMobile(false), 1500);
                                                }}
                                                className="absolute right-0 top-0 text-gray-400 hover:text-indigo-600 transition"
                                                title="Скопировать"
                                            >
                                                {copiedMobile ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <span className="text-gray-500">Роль:</span> {role}
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-sm bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-1 rounded transition"
                                    >
                                        Выйти
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
