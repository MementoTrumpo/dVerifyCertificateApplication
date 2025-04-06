import { ethers } from "ethers";
import { getBlockchain } from "./BlockchainService";
import contractABI from "../Certificates.json"; // путь к ABI контракта
import { API_URL } from "../shared/config";
import contract from "../shared/contract.json";

export const CONTRACT_ABI = contract.abi;// ABI контракта
export const CONTRACT_ADDRESS = contract.address;// Адрес контракта


export interface Metadata {
  [key: string]: any;
}

// Функция получения сертификата из БД или блокчейна
export async function getCertificate(certId: number): Promise<any> {
  try {
    // Сначала пытаемся получить данные из БД
    const response = await fetch(`${API_URL}/${certId}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn("Ошибка при получении из БД, пробуем блокчейн:", error);
  }

  // Если в БД нет, пробуем блокчейн
  const blockchain = await getBlockchain();
  if (!blockchain) {
    throw new Error("Не удалось подключиться к блокчейну");
  }
  const { provider } = blockchain;
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, provider);
  try {
    const certificate = await contract.getCertificate(certId);
    return {
      certificateId: certId,
      issuedTo: certificate.issuedTo,
      issuer: certificate.issuer,
      ipfsHash: certificate.ipfsHash,
      issueDate: new Date(certificate.issueDate * 1000)
    };
  } catch (error) {
    throw new Error("Сертификат не найден в блокчейне и БД");
  }
}

// Функция выпуска сертификата
export async function issueCertificate(ipfsHash: string, metadata: Metadata): Promise<void> {
  const blockchain = await getBlockchain();
  if (!blockchain) {
    throw new Error("Не удалось подключиться к блокчейну");
  }
  const { signer, contract } = blockchain;
  try {
    const address = await signer.getAddress();
    const tx = await contract.issueCertificate(address, ipfsHash);
    await tx.wait();

    const blockchainHash = tx.hash;
    const ownerId = address;
    const certificateId = generateCertificateId();

    // Отправляем данные в API C#
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          certificateId, // или генерируемый ID, если необходимо
          issuedTo: ownerId, // адрес пользователя из MetaMask
          issuer: metadata.issuer || "Decentralized University", // берём из metadata или по умолчанию
          blockchainHash, // tx.hash из Ethereum
          ipfsHash,       // CID из IPFS
          issueDate: new Date().toISOString(), // правильный формат даты для C#
          metadata        // любой JSON, например { course: "Math", grade: "A+" }
        })
      });
    if (!response.ok) {
      throw new Error("Ошибка сохранения сертификата в БД");
    }
  } catch (error) {
    console.error("Ошибка загрузки сертификата:", error);
    throw error;
  }
}


function generateCertificateId(): number {
    const timestamp = Date.now(); // миллисекунды
    const random = Math.floor(Math.random() * 1000); // случайные 0–999
    return Number(String(timestamp).slice(-6) + String(random).padStart(3, "0"));
  }
