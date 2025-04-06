module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Ganache
      port: 7545,        // Порт Ganache
      network_id: "*",   // Любая сеть
      gas: 8000000, // Увеличенный лимит газа
      gasPrice: 20000000000 // 20 Gwei
    },
  },
  compilers: {
    solc: {
      version: "0.5.16", // Версия компилятора Solidity
    },
  },
};
