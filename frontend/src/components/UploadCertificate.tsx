import React, { useState } from "react";
import { create } from "ipfs-http-client";
import { issueCertificate } from "../api/CertificateAPI";
import { useWallet } from "../context/WalletContext";

const ipfs = create({ url: "http://localhost:5001" });

const allowedTypes = [
    { mime: "application/pdf", label: "PDF" },
    { mime: "image/png", label: "PNG" },
    { mime: "image/jpeg", label: "JPEG" },
    { mime: "application/msword", label: "DOC" },
    { mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", label: "DOCX" },
    { mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", label: "XLSX" },
    { mime: "application/zip", label: "ZIP" },
    { mime: "text/plain", label: "TXT" }
];

const allowedMimeList = allowedTypes.map(t => t.mime);
const allowedLabelList = allowedTypes.map(t => t.label).join(", ");

export default function UploadCertificate() {
    const { signer } = useWallet();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [recipient, setRecipient] = useState("");
    const [recipientName, setRecipientName] = useState("");
    const [courseName, setCourseName] = useState("");
    const [grade, setGrade] = useState("");
    const [duration, setDuration] = useState("");

    const role = localStorage.getItem("role");
    if (role !== "Issuer") {
        return <p className="text-red-600 text-center mt-10">Доступ разрешён только Issuer-ам</p>;
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!signer || !file || !recipient || !courseName || !recipientName) {
            alert("Заполните все обязательные поля и выберите файл.");
            return;
        }

        if (!allowedMimeList.includes(file.type)) {
            alert(`❌ Недопустимый тип файла. Поддерживаются: ${allowedLabelList}`);
            return;
        }

        try {
            setIsUploading(true);
            console.log("📄 Выбран файл:", file.name, file.type);

            const added = await ipfs.add(file);
            const ipfsHash = added.cid.toString();
            console.log("🌀 Загружено в IPFS, CID:", ipfsHash);

            const metadata = {
                filename: file.name,
                note: "Сертификат курса",
                courseName,
                recipientName,
                grade,
                duration,
                issuedAt: new Date().toISOString()
            };

            await issueCertificate(ipfsHash, metadata, recipient);

            alert("✅ Сертификат успешно выдан!");
            setFile(null);
            setRecipient("");
            setRecipientName("");
            setCourseName("");
            setGrade("");
            setDuration("");
        } catch (error) {
            console.error("❌ Ошибка загрузки сертификата:", error);
            alert("Ошибка при выпуске. Проверьте IPFS и MetaMask.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="mt-10 w-full max-w-xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">📤 Загрузить сертификат</h2>

            <label className="block text-sm font-medium mb-1">Кому выдать (адрес получателя)</label>
            <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                placeholder="0x..."
            />

            <label className="block text-sm font-medium mb-1">Имя получателя</label>
            <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                placeholder="Иван Иванов"
            />

            <label className="block text-sm font-medium mb-1">Название курса</label>
            <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                placeholder="Solidity 101"
            />

            <label className="block text-sm font-medium mb-1">Оценка</label>
            <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                placeholder="Отлично"
            />

            <label className="block text-sm font-medium mb-1">Продолжительность</label>
            <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                placeholder="40 часов"
            />

            <label className="block text-sm font-medium mb-1">Файл сертификата</label>
            <input
                type="file"
                accept={allowedMimeList.join(",")}
                onChange={handleFileChange}
                className="block w-full border p-2 rounded mb-2"
            />
            <p className="text-sm text-gray-500 mb-4">
                Поддерживаемые форматы: <span className="font-medium text-gray-700">{allowedLabelList}</span>
            </p>

            <button
                onClick={handleUpload}
                disabled={!file || !signer || isUploading || !recipient}
                className={`w-full px-4 py-2 rounded text-white transition ${
                    isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {isUploading ? "Загрузка..." : "Отправить сертификат"}
            </button>
        </div>
    );
}
