// BlockchainService.ts
import { ethers } from "ethers";
import contract from "../../../shared/contract.json";

export const CONTRACT_ABI = contract.abi;
export const CONTRACT_ADDRESS = contract.address;

export async function getBlockchain() {
  if (!window.ethereum) {
    throw new Error("MetaMask не установлен");
  }
  // Запрашиваем разрешение на подключение аккаунтов
  await window.ethereum.request({ method: "eth_requestAccounts" });
  // Создаём провайдера, получаем signer и контракт
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  return { provider, signer, contract };
}
