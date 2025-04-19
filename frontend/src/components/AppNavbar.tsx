import { Link } from "react-router-dom";

export default function AppNavbar({ role }: { role: string | null }) {
    return (
        <nav className="bg-white border-b shadow-sm px-4 py-3">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-semibold text-indigo-600">🎓 CertManager</Link>
                <div className="flex space-x-4 text-sm text-gray-600">
                    <Link to="/upload" className="hover:text-indigo-500">Загрузить</Link>
                    <Link to="/verify" className="hover:text-indigo-500">Проверить</Link>
                    {role === "Issuer" && (
                        <Link to="/issue" className="hover:text-indigo-500">Выпустить</Link>
                    )}
                    {role === "Admin" && (
                        <Link to="/roles" className="hover:text-indigo-500">Роли</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}