import React, { useState } from "react";
import { BrowserProvider } from "ethers";
import { getCertificate } from "../api/CertificateAPI";

interface CheckCertificateProps {
    provider: BrowserProvider | null;
}

export default function CheckCertificate({ provider }: CheckCertificateProps) {
    const [certId, setCertId] = useState("");
    const [certificate, setCertificate] = useState<any>(null);

    const handleCheck = async () => {
        if (!certId) return;

        try {
            const cert = await getCertificate(Number(certId));
            setCertificate(cert);
        } catch (error) {
            console.error(error);
            alert("Сертификат не найден");
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-2">Проверить сертификат</h2>
            <input
                type="text"
                placeholder="Введите ID"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="border px-3 py-2 rounded mr-2"
            />
            <button
                onClick={handleCheck}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
                🔍 Проверить
            </button>

            {certificate && (
                <div className="mt-4 bg-white p-4 rounded shadow">
                    <p><strong>IPFS Hash:</strong> {certificate.ipfsHash}</p>
                    <p><strong>Выдан:</strong> {certificate.issuedTo}</p>
                    <p><strong>Дата:</strong> {new Date(certificate.issueDate).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
}
