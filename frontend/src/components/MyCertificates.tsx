import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../shared/config";
import { revokeCertificate } from "../api/CertificateAPI";

interface Certificate {
    certificateId: number;
    issuedTo: string;
    issuerWallet: string;
    ipfsHash: string;
    issueDate: string;
    isRevoked: boolean;
}

export default function MyIssuedCertificates() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(API_ENDPOINTS.CERTIFICATES.issuedByMe, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    console.error("Ошибка API:", res.status, text);
                    return [];
                }
                return res.json();
            })
            .then(setCertificates)
            .catch((err) => {
                console.error("Ошибка загрузки сертификатов:", err);
                setCertificates([]);
            });
    }, []);


    const handleRevoke = async (certId: number) => {
        try {
            await revokeCertificate(certId);
            setCertificates((prev) =>
                prev.map((c) =>
                    c.certificateId === certId ? { ...c, isRevoked: true } : c
                )
            );
            alert("✅ Сертификат отозван");
        } catch (err: any) {
            alert("❌ Ошибка при отзыве:\n" + err.message);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🧾 Выданные сертификаты</h2>

            <div className="overflow-x-auto rounded shadow">
                <table className="min-w-full text-sm bg-white border">
                    <thead className="bg-gray-100 text-gray-700 text-left">
                    <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">Получатель</th>
                        <th className="p-3">CID (IPFS)</th>
                        <th className="p-3">Дата</th>
                        <th className="p-3">Статус</th>
                        <th className="p-3 text-right">Действие</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {certificates.map((cert) => (
                        <tr key={cert.certificateId} className={cert.isRevoked ? "opacity-60" : ""}>
                            <td className="p-3">{cert.certificateId}</td>
                            <td className="p-3 font-mono">{cert.issuedTo}</td>
                            <td className="p-3 text-blue-600">{cert.ipfsHash.slice(0, 12)}...</td>
                            <td className="p-3">{new Date(cert.issueDate).toLocaleDateString()}</td>
                            <td className="p-3">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium
                    ${cert.isRevoked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {cert.isRevoked ? "❌ Отозван" : "✅ Активен"}
                  </span>
                            </td>
                            <td className="p-3 text-right">
                                {!cert.isRevoked && (
                                    <button
                                        onClick={() => handleRevoke(cert.certificateId)}
                                        className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
                                    >
                                        🛑 Отозвать
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
