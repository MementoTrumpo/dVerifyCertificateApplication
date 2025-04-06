// UploadCertificate.tsx
import { useState } from "react";
import { issueCertificate } from "../api/CertificateAPI";
import { toast } from "react-toastify";

export default function UploadCertificate() {
  const [ipfsHash, setIpfsHash] = useState("");

  const uploadCertificate = async () => {
    if (!ipfsHash) return alert("Введите IPFS Hash");

    // Собираем metadata. Здесь пример с пустым объектом – при необходимости расширьте форму.
    const metadata = {};
    try {
      await issueCertificate(ipfsHash, metadata);
      toast.success("Сертификат успешно загружен!");
    } catch (error) {
      console.error(error);
      toast.error("Ошибка загрузки сертификата");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-2">Загрузить сертификат</h2>
      <input
        type="text"
        placeholder="Введите IPFS Hash"
        value={ipfsHash}
        onChange={(e) => setIpfsHash(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button onClick={uploadCertificate} className="p-2 bg-green-500 text-white rounded">
        📤 Загрузить
      </button>
    </div>
  );
}
