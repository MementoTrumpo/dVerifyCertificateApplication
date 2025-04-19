import React, { useState } from "react";
import { create } from "ipfs-http-client";
import { issueCertificate } from "../api/CertificateAPI";
import { useWallet } from "../context/WalletContext";


const ipfs = create({ url: "http://localhost:5001" }); // Убедись, что IPFS CLI работает

export default function UploadCertificate() {
  const { signer } = useWallet(); // 🔑 получаем глобальный signer
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const role = localStorage.getItem("role");
  if (role !== "Issuer") {
    return <p className="text-red-600 text-center mt-10">Доступ разрешён только Issuer-ам</p>;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!signer || !file) return;

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
      alert("❌ Поддерживаются только файлы PDF, PNG и JPEG.");
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
        issuer: "Decentralized University",
      };

      await issueCertificate(ipfsHash, metadata);
      alert("✅ Сертификат успешно загружен!");
      setFile(null); // сбросить состояние файла
    } catch (error) {
      console.error("❌ Ошибка загрузки сертификата:", error);
      alert("Ошибка загрузки сертификата. Проверьте IPFS и MetaMask.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
      <div className="mt-8 w-full max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">📤 Загрузить сертификат</h2>
        <input
            type="file"
            onChange={handleFileChange}
            className="block w-full border p-2 rounded mb-4"
        />
        <button
            onClick={handleUpload}
            disabled={!file || !signer || isUploading}
            className={`w-full px-4 py-2 rounded text-white transition ${
                isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {isUploading ? "Загрузка..." : "Отправить сертификат"}
        </button>
      </div>
  );
}
