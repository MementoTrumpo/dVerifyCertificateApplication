import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import UploadCertificate from "./components/UploadCertificate";
import CheckCertificate from "./components/CheckCertificate";
import { ethers } from "ethers";

export default function App() {
  const [account, setAccount] = useState("");

  return (
    <div className="p-6 min-h-screen flex flex-col items-center bg-gray-100">
      <ConnectWallet
        onConnected={async (address) => {
          setAccount(address);
        }}
      />
      {account && (
        <>
          <UploadCertificate />
          <CheckCertificate />
        </>
      )}
    </div>
  );
}
