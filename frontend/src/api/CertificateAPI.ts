import { ethers } from "ethers";
import { getBlockchain } from "./BlockchainService";
import contract from "../shared/contract.json";
import { API_ENDPOINTS } from "../shared/config";

export const CONTRACT_ABI = contract.abi;
export const CONTRACT_ADDRESS = contract.address;

export interface Metadata {
  [key: string]: any;
}

// Получение сертификата по ID
export async function getCertificate(certId: number): Promise<any> {
  try {
    const response = await fetch(API_ENDPOINTS.CERTIFICATES.getById(certId));
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn("Ошибка при получении из БД, пробуем блокчейн:", error);
  }

  const blockchain = await getBlockchain();
  if (!blockchain) {
    throw new Error("Не удалось подключиться к блокчейну");
  }

  const { provider } = blockchain;
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

  try {
    const certificate = await contract.getCertificate(certId);
    return {
      certificateId: certId,
      issuedTo: certificate.issuedTo,
      issuer: certificate.issuer,
      ipfsHash: certificate.ipfsHash,
      issueDate: new Date(certificate.issueDate * 1000),
    };
  } catch (error) {
    throw new Error("Сертификат не найден в блокчейне и БД");
  }
}

// Выпуск сертификата
export async function issueCertificate(ipfsHash: string, metadata: Metadata): Promise<void> {
  const blockchain = await getBlockchain();
  if (!blockchain) throw new Error("Не удалось подключиться к блокчейну");

  const { signer, contract } = blockchain;

  try {
    const address = await signer.getAddress();
    const tx = await contract.issueCertificate(address, ipfsHash);
    await tx.wait();

    const blockchainHash = tx.hash;
    const ownerId = address;
    const certificateId = generateCertificateId();

    const payload = {
      certificateId,
      issuedTo: ownerId,
      issuer: metadata.issuer || "Decentralized University",
      blockchainHash,
      ipfsHash,
      issueDate: new Date().toISOString(),
      metadata,
    };

    const response = await fetch(API_ENDPOINTS.CERTIFICATES.BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Ошибка сохранения сертификата в БД: ${text}`);
    }
  } catch (error) {
    console.error("Ошибка загрузки сертификата:", error);
    throw error;
  }
}

// Генерация уникального ID сертификата
function generateCertificateId(): number {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return Number(String(timestamp).slice(-6) + String(random).padStart(3, "0"));
}
