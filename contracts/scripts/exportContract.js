// scripts/exportContract.js
const fs = require("fs");
const path = require("path");

const CONTRACT_NAME = "Certificates";
const BUILD_PATH = path.resolve(__dirname, "../build/contracts", `${CONTRACT_NAME}.json`);
const FRONTEND_ABI_PATH = path.resolve(__dirname, "../../dCertificateManagementFrontend/src/contracts", `${CONTRACT_NAME}.json`);

function exportContract() {
  if (!fs.existsSync(BUILD_PATH)) {
    console.error(`❌ Контракт ${CONTRACT_NAME}.json не найден. Сначала сделай деплой.`);
    process.exit(1);
  }

  const contractData = JSON.parse(fs.readFileSync(BUILD_PATH, "utf8"));

  // Опционально — оставить только abi + address
  const output = {
    abi: contractData.abi,
    address: contractData.networks?.["5777"]?.address || "0x",
  };

  fs.mkdirSync(path.dirname(FRONTEND_ABI_PATH), { recursive: true });
  fs.writeFileSync(FRONTEND_ABI_PATH, JSON.stringify(output, null, 2));

  console.log(`✅ Контракт ${CONTRACT_NAME} экспортирован в frontend:\n→ ${FRONTEND_ABI_PATH}`);
}

exportContract();
