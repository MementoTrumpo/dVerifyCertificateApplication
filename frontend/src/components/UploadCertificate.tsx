import { useState } from "react";
import { issueCertificate } from "../api/CertificateAPI";
import { toast } from "react-toastify";
import { create } from "ipfs-http-client";

const ipfs = create({
  host: "localhost",
  port: 5001,
  protocol: "http"
});

export default function UploadCertificate() {
  const [ipfsHash, setIpfsHash] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("📁 Файл выбран:", file.name);

    setFileLoading(true);
    try {
      const result = await ipfs.add(file);
      console.log("✅ Файл загружен в IPFS:", result);
      console.log("✅ CID:", result.path);
      setIpfsHash(result.path);
      toast.success("Файл загружен в IPFS");
    } catch (error) {
      console.error("❌ Ошибка загрузки в IPFS:", error);
      toast.error("Ошибка загрузки в IPFS");
    } finally {
      setFileLoading(false);
    }
  };


  const uploadCertificate = async () => {
    if (!ipfsHash) {
      alert("Сначала загрузите файл для получения IPFS-хэша.");
      return;
    }

    const metadata = {
      course: "Blockchain 101",
      issuer: "Decentralized University"
    };

    try {
      await issueCertificate(ipfsHash, metadata);
      toast.success("Сертификат успешно загружен в блокчейн и БД!");
    } catch (error) {
      console.error("Ошибка загрузки сертификата:", error);
      toast.error("Ошибка загрузки сертификата");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-xl w-full">
      <h2 className="text-xl font-bold mb-4">Загрузить сертификат</h2>

      <input
        type="file"
        onChange={handleFileUpload}
        className="mb-3"
        accept=".pdf,.jpg,.jpeg,.png,.json"
      />

      {fileLoading && <p>⏳ Загрузка в IPFS...</p>}

      {ipfsHash && (
        <div className="mb-4 text-sm">
          <p>📦 IPFS-хэш: <code>{ipfsHash}</code></p>
          <a
            href={`https://ipfs.io/ipfs/${ipfsHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Открыть в IPFS
          </a>
        </div>
      )}

      <button
        onClick={uploadCertificate}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        disabled={!ipfsHash || fileLoading}
      >
        📤 Отправить сертификат
      </button>
    </div>
  );
}
