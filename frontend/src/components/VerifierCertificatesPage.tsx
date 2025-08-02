import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { API_ENDPOINTS } from "../shared/config";

const VerifierCertificatesPage: React.FC = () => {
    const { account } = useWallet();
    const [certificates, setCertificates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [nameFilter, setNameFilter] = useState("");
    const [courseFilter, setCourseFilter] = useState("");
    const [gradeFilter, setGradeFilter] = useState("");
    const [durationFilter, setDurationFilter] = useState("");

    useEffect(() => {
        const fetchCertificates = async () => {
            if (!account) return;
            try {
                const res = await fetch(`${API_ENDPOINTS.CERTIFICATES.BASE}/owned-by/${account}`);
                if (!res.ok) throw new Error("Ошибка загрузки сертификатов");
                const data = await res.json();
                setCertificates(data);
            } catch (err) {
                console.error("Ошибка при получении сертификатов:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, [account]);

    const filtered = certificates.filter(cert => {
        const meta = cert.metadata || {};
        const issueDate = new Date(cert.issueDate).toLocaleDateString();

        const matchSearch = cert.ipfsHash?.toLowerCase().includes(search.toLowerCase()) ||
            issueDate.includes(search);

        const matchStatus =
            statusFilter === ""
            || (statusFilter === "valid" && !cert.isRevoked)
            || (statusFilter === "revoked" && cert.isRevoked);

        const matchName = meta.recipientName?.toLowerCase().includes(nameFilter.toLowerCase());
        const matchCourse = meta.courseName?.toLowerCase().includes(courseFilter.toLowerCase());
        const matchGrade = meta.grade?.toLowerCase().includes(gradeFilter.toLowerCase());
        const matchDuration = meta.duration?.toLowerCase().includes(durationFilter.toLowerCase());

        return matchSearch && matchStatus && matchName && matchCourse && matchGrade && matchDuration;
    });

    if (!loading && certificates.length === 0) return null;

    return (
        <div className="pt-24 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Поиск по CID или дате"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 border rounded"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">Все статусы</option>
                    <option value="valid">✅ Действителен</option>
                    <option value="revoked">❌ Отозван</option>
                </select>
                <input
                    type="text"
                    placeholder="Имя получателя"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Курс"
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Оценка"
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Продолжительность"
                    value={durationFilter}
                    onChange={(e) => setDurationFilter(e.target.value)}
                    className="p-2 border rounded"
                />
            </div>

            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <div className="space-y-4">
                    {filtered.length === 0 ? (
                        <p>Сертификаты не найдены.</p>
                    ) : (
                        filtered.map(cert => {
                            const meta = cert.metadata || {};
                            return (
                                <div
                                    key={cert.id}
                                    className="border rounded-xl p-4 shadow bg-white space-y-2"
                                >
                                    <p><strong>ID:</strong> {cert.certificateId}</p>
                                    <p><strong>CID:</strong> {cert.ipfsHash}</p>
                                    <p><strong>Дата выдачи:</strong> {new Date(cert.issueDate).toLocaleDateString()}</p>
                                    <p><strong>Статус:</strong> {cert.isRevoked ? "❌ Отозван" : "✅ Действителен"}</p>
                                    <p><strong>Имя получателя:</strong> {meta.recipientName}</p>
                                    <p><strong>Курс:</strong> {meta.courseName}</p>
                                    {meta.grade && <p><strong>Оценка:</strong> {meta.grade}</p>}
                                    {meta.duration && <p><strong>Продолжительность:</strong> {meta.duration}</p>}

                                    {!cert.isRevoked && (
                                        <a
                                            href={`http://localhost:8081/ipfs/${cert.ipfsHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition"
                                        >
                                            📥 Скачать
                                        </a>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default VerifierCertificatesPage;
