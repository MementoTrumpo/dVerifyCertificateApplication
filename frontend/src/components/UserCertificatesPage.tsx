import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { API_ENDPOINTS } from "../shared/config";

const UserCertificatesPage: React.FC = () => {
    const { account } = useWallet();
    const [certificates, setCertificates] = useState<any[]>([]);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!account) return;
        const fetchCertificates = async () => {
            try {
                const res = await fetch(`${API_ENDPOINTS.CERTIFICATES.BASE}/owned-by/${account}`);
                if (!res.ok) throw new Error("Ошибка загрузки сертификатов");
                const data = await res.json();
                setCertificates(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCertificates();
    }, [account]);

    const filtered = certificates.filter(cert =>
        cert.ipfsHash.toLowerCase().includes(filter.toLowerCase()) ||
        new Date(cert.issueDate).toLocaleDateString().includes(filter)
    );

    const handleCopyLink = (id: number) => {
        const url = `${window.location.origin}/check?id=${id}`;
        navigator.clipboard.writeText(url);
        alert("Ссылка скопирована в буфер обмена");
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Мои сертификаты</h1>
            <input
                type="text"
                placeholder="Поиск по дате или CID..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
            />
            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <div className="space-y-4">
                    {filtered.length === 0 ? (
                        <p>Сертификаты не найдены.</p>
                    ) : (
                        filtered.map(cert => (
                            <div
                                key={cert.id}
                                className="border rounded-xl p-4 shadow bg-white space-y-2"
                            >
                                <p><strong>ID:</strong> {cert.id}</p>
                                <p><strong>CID:</strong> {cert.ipfsHash}</p>
                                <p><strong>Дата выдачи:</strong> {new Date(cert.issueDate).toLocaleDateString()}</p>
                                <p><strong>Статус:</strong> {cert.revoked ? "Отозван" : "Действителен"}</p>
                                <div className="flex gap-4 mt-2">
                                    <a
                                        href={`https://ipfs.io/ipfs/${cert.ipfsHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >📥 Скачать</a>

                                    <button
                                        onClick={() => handleCopyLink(cert.id)}
                                        className="text-gray-700 underline"
                                    >🔗 Скопировать ссылку</button>

                                    <a
                                        href={`/check?id=${cert.id}`}
                                        className="text-green-600 underline"
                                    >🔎 Проверить</a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default UserCertificatesPage;
