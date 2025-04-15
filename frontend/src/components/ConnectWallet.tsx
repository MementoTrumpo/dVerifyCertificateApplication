import { useWallet } from "../context/WalletContext";

export default function ConnectWallet() {
  const { account, connectWallet } = useWallet();
  const role = localStorage.getItem("role");

  return (
      <div className="flex flex-col items-center space-y-2">
        <button onClick={connectWallet} className="p-2 bg-blue-500 text-white rounded">
          {account ? `🔌 Подключено: ${account.slice(0, 6)}...` : "Подключить MetaMask"}
        </button>
        {role && <div className="text-sm text-gray-700">🔐 Ваша роль: <strong>{role}</strong></div>}
      </div>
  );
}
