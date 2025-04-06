const Certificates = artifacts.require("Certificates");

module.exports = function (deployer) {
  deployer.deploy(Certificates, { gas: 6000000 });
};
