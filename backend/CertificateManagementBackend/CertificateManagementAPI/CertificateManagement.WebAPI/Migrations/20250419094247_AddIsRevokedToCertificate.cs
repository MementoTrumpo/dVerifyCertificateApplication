using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CertificateManagement.WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddIsRevokedToCertificate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRevoked",
                table: "Certificates",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRevoked",
                table: "Certificates");
        }
    }
}
