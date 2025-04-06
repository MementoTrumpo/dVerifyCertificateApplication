// BlockchainService.ts
import { ethers } from "ethers";
import contractABI from "../Certificates.json"; // путь к ABI контракта

const CONTRACT_ADDRESS = "0x474d22D05033A3ccfB5743f97cD1F73e19Cc4375"; // Замените на адрес вашего контракта

export async function getBlockchain() {
  if (!window.ethereum) {
    throw new Error("MetaMask не установлен");
  }
  // Запрашиваем разрешение на подключение аккаунтов
  await window.ethereum.request({ method: "eth_requestAccounts" });
  // Создаём провайдера, получаем signer и контракт
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
  return { provider, signer, contract };
}
