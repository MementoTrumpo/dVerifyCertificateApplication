import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../shared/config";

interface User {
    walletAddress: string;
    role: string;
}

export default function RoleManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [roles] = useState(["Admin", "Issuer", "Verifier"]);
    const [updatedRoles, setUpdatedRoles] = useState<Record<string, string>>({});

    const token = localStorage.getItem("token");
    const currentRole = localStorage.getItem("role");

    useEffect(() => {
        if (currentRole !== "Admin") return;

        fetch(API_ENDPOINTS.USERS.ALL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then(setUsers)
            .catch((err) => console.error("Ошибка загрузки пользователей:", err));
    }, []);

    const handleRoleChange = (wallet: string, newRole: string) => {
        setUpdatedRoles((prev) => ({ ...prev, [wallet]: newRole }));
    };

    const handleSubmit = async (wallet: string) => {
        const newRole = updatedRoles[wallet];
        if (!newRole) return;
        console.log("Перед отправкой:", {
            WalletAddress: wallet,
            NewRole: newRole
        });

        const res = await fetch(API_ENDPOINTS.USERS.SET_ROLE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                WalletAddress: wallet,
                NewRole: newRole
            })
        });

        if (res.ok) {
            alert("✅ Роль обновлена");
            setUsers((prev) =>
                prev.map((u) =>
                    u.walletAddress === wallet ? { ...u, role: newRole } : u
                )
            );
        } else {
            const error = await res.text();
            console.error("❌ Ошибка назначения роли:", error);
            alert("❌ Ошибка назначения роли:\n" + error);
        }
    };


    if (currentRole !== "Admin") {
        return <p className="text-red-600 text-center mt-10">Доступ разрешён только администраторам</p>;
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Управление ролями пользователей</h2>

            <div className="overflow-x-auto rounded-lg shadow border">
                <table className="min-w-full bg-white text-sm">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Кошелёк</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Текущая роль</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Назначить новую</th>
                        <th className="px-6 py-3"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {users.map((user) => (
                        <tr key={user.walletAddress}>
                            <td className="px-6 py-4 font-mono text-sm text-blue-700">{user.walletAddress}</td>
                            <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                    ${user.role === "Admin" ? "bg-red-100 text-red-700"
                      : user.role === "Issuer" ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"}`}>
                    {user.role}
                  </span>
                            </td>
                            <td className="px-6 py-4">
                                <select
                                    value={updatedRoles[user.walletAddress] || user.role}
                                    onChange={(e) =>
                                        handleRoleChange(user.walletAddress, e.target.value)
                                    }
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    {roles.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button
                                    onClick={() => handleSubmit(user.walletAddress)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded text-sm transition"
                                >
                                    Применить
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
