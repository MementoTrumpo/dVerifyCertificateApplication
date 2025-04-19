import React, { useState } from "react";
import { Signer } from "ethers";
import { issueCertificate } from "../api/CertificateAPI";

interface Props {
    signer: Signer | null;
}

export default function IssueCertificate({ signer }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async () => {
        if (!signer || !file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("http://localhost:5001/api/v0/add", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();
            const ipfsHash = result.Hash;

            const metadata = {
                filename: file.name,
                issuer: "Decentralized University",
            };

            await issueCertificate(ipfsHash, metadata);
            alert("✅ Сертификат успешно выпущен!");
        } catch (err) {
            console.error(err);
            alert("❌ Ошибка при выпуске сертификата");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow-sm">
                <h3 className="mb-3">📜 Выпуск сертификата</h3>
                <div className="mb-3">
                    <label htmlFor="fileInput" className="form-label">
                        Выберите файл сертификата
                    </label>
                    <input
                        type="file"
                        className="form-control"
                        id="fileInput"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleUpload}
                    disabled={!file || !signer || isUploading}
                >
                    {isUploading ? "Загрузка..." : "📤 Выпустить"}
                </button>
            </div>
        </div>
    );
}