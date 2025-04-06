namespace CertificateManagement.WebAPI.Dtos
{
    public class CertificateRequest
    {
        public uint CertificateId { get; set; }  // ID сертификата в блокчейне
        public string IssuedTo { get; set; }     // Кому выдан (адрес)
        public string Issuer { get; set; }       // Кто выдал (адрес)
        public string BlockchainHash { get; set; } // Хеш транзакции
        public string IpfsHash { get; set; }     // Ссылка на IPFS
        public DateTime IssueDate { get; set; }      // Время выпуска (timestamp)
        public object Metadata { get; set; }     // Доп. данные
    }
}
