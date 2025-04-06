// contracts/scripts/exportContract.js
const fs = require("fs");
const path = require("path");

const CONTRACT_NAME = "Certificates";
const BUILD_PATH = path.resolve(__dirname, "../build/contracts", `${CONTRACT_NAME}.json`);
const OUTPUT_PATH = path.resolve(__dirname, "../../shared/contract.json"); // 🔁 новый путь

function exportContract() {
  if (!fs.existsSync(BUILD_PATH)) {
    console.error(`❌ Контракт ${CONTRACT_NAME}.json не найден. Убедись, что ты сделал деплой через Truffle.`);
    process.exit(1);
  }

  const contractData = JSON.parse(fs.readFileSync(BUILD_PATH, "utf8"));

  const address =
    contractData.networks && Object.values(contractData.networks)[0]?.address;

  if (!address) {
    console.error("❌ Адрес контракта не найден. Убедись, что контракт был задеплоен.");
    process.exit(1);
  }

  const output = {
    abi: contractData.abi,
    address: address,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

  console.log(`✅ Контракт экспортирован в shared/contract.json`);
  console.log(`→ Address: ${address}`);
}

exportContract();
