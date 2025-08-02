import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const CheckPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const certificateId = searchParams.get("id");

    const [cert, setCert] = useState<any>(null);
    const [status, setStatus] = useState<"valid" | "revoked" | "notfound" | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!certificateId) return;

        fetch(`/api/certificates/${certificateId}`)
            .then(async (res) => {
                if (res.status === 404) {
                    setStatus("notfound");
                    return;
                }

                const data = await res.json();
                setCert(data);
                setStatus(data.revoked ? "revoked" : "valid");
            })
            .catch(() => setStatus("notfound"))
            .finally(() => setLoading(false));
    }, [certificateId]);

    if (!certificateId) return <div className="p-4">❗ Укажите ID сертификата в ссылке</div>;
    if (loading) return <div className="p-4">⏳ Проверка сертификата...</div>;

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Проверка сертификата</h1>

            {status === "notfound" && <p className="text-red-600">❌ Сертификат не найден</p>}
            {status === "revoked" && (
                <div className="bg-red-100 border border-red-400 p-4 rounded">
                    <p className="text-red-700 font-semibold">⚠️ Сертификат отозван</p>
                </div>
            )}
            {status === "valid" && cert && (
                <div className="bg-green-100 border border-green-400 p-4 rounded space-y-2">
                    <p><strong>ID:</strong> {cert.id}</p>
                    <p><strong>IPFS CID:</strong> {cert.ipfsHash}</p>
                    <p><strong>Дата:</strong> {new Date(cert.issueDate).toLocaleDateString()}</p>
                    <p><strong>Кому выдан:</strong> {cert.issuedTo}</p>
                    <p><strong>Кто выдал:</strong> {cert.issuer}</p>
                    <a
                        href={`https://ipfs.io/ipfs/${cert.ipfsHash}`}
                        target="_blank"
                        className="text-blue-600 underline"
                    >
                        📥 Скачать сертификат
                    </a>
                </div>
            )}
        </div>
    );
};

export default CheckPage;
