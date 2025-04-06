// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract Certificates {
    struct Certificate {
        address issuedTo;
        address issuer;
        string ipfsHash;
        uint256 issueDate;
    }

    mapping(uint256 => Certificate) private certificates;
    uint256 public totalCertificates;

    event CertificateIssued(
        uint256 indexed id,
        address indexed issuedTo,
        address issuer,
        string ipfsHash,
        uint256 issueDate
    );

    constructor() public {
        totalCertificates = 0;
    }

    function issueCertificate(address _to, string memory _ipfsHash) public {
        totalCertificates++;
        certificates[totalCertificates] = Certificate(_to, msg.sender, _ipfsHash, block.timestamp);
        emit CertificateIssued(totalCertificates, _to, msg.sender, _ipfsHash, block.timestamp);
    }

    function getCertificate(uint256 _certId) public view returns (
        address issuedTo,
        address issuer,
        string memory ipfsHash,
        uint256 issueDate
    ) {
        require(_certId > 0 && _certId <= totalCertificates, "Certificate does not exist");
        Certificate storage cert = certificates[_certId];
        return (cert.issuedTo, cert.issuer, cert.ipfsHash, cert.issueDate);
    }
}
