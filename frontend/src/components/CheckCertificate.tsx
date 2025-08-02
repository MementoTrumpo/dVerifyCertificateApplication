import React, { useState } from "react";
import { getCertificate } from "../api/CertificateAPI";
import { BrowserProvider } from "ethers";

interface CheckCertificateProps {
    provider: BrowserProvider | null;
}

export default function CheckCertificate({ provider }: CheckCertificateProps) {
    const [certId, setCertId] = useState("");
    const [certificate, setCertificate] = useState<any | null>(null);

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
        <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">🔍 Проверка сертификата</h2>
            <input
                type="text"
                placeholder="Введите ID сертификата"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="w-full border rounded p-2 mb-4"
            />
            <button
                onClick={handleCheck}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
                Проверить
            </button>

            {certificate && (
                <div className="mt-4 text-left text-sm">
                    <p><strong>ID:</strong> {certificate.certificateId}</p>
                    <p><strong>Владелец:</strong> {certificate.issuedTo}</p>
                    <p><strong>Выдано:</strong> {certificate.issuer}</p>
                    <p><strong>Дата:</strong> {new Date(certificate.issueDate).toLocaleDateString()}</p>
                    <p><strong>IPFS:</strong> {certificate.ipfsHash}</p>
                </div>
            )}

            {certificate && certificate.isRevoked && (
                <p className="text-red-600 font-semibold mt-2">❌ Сертификат отозван</p>
            )}
        </div>
    );
}