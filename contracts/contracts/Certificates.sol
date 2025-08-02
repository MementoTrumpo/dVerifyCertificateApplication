// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract Certificates {
    struct Certificate {
        address issuedTo;
        address issuer;
        string ipfsHash;
        uint256 issueDate;
        bool revoked;
    }

    mapping(uint256 => Certificate) private certificates;
    uint256 public totalCertificates;

    event CertificateIssued(
        uint256 indexed id,
        address indexed issuedTo,
        address indexed issuer,
        string ipfsHash,
        uint256 issueDate
    );

    event CertificateRevoked(
        uint256 indexed id,
        address indexed issuer,
        uint256 timestamp
    );

    constructor() public {
        totalCertificates = 0;
    }

    function issueCertificate(address _to, string memory _ipfsHash) public {
        totalCertificates++;
        certificates[totalCertificates] = Certificate(
            _to,
            msg.sender,
            _ipfsHash,
            block.timestamp,
            false
        );
        emit CertificateIssued(
            totalCertificates,
            _to,
            msg.sender,
            _ipfsHash,
            block.timestamp
        );
    }

    function getCertificate(uint256 _certId) public view returns (
        address issuedTo,
        address issuer,
        string memory ipfsHash,
        uint256 issueDate,
        bool revoked
    ) {
        require(_certId > 0 && _certId <= totalCertificates, "Certificate does not exist");
        Certificate storage cert = certificates[_certId];
        return (cert.issuedTo, cert.issuer, cert.ipfsHash, cert.issueDate, cert.revoked);
    }

    modifier onlyIssuer(uint256 _certId) {
        require(_certId > 0 && _certId <= totalCertificates, "Certificate does not exist");
        require(msg.sender == certificates[_certId].issuer, "Only issuer can perform this action");
        _;
    }

    function revokeCertificate(uint256 _certId) external onlyIssuer(_certId) {
        Certificate storage cert = certificates[_certId];
        require(!cert.revoked, "Certificate already revoked");
        cert.revoked = true;
        emit CertificateRevoked(_certId, msg.sender, block.timestamp);
    }
}
