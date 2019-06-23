using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Infrastructure.Migrations
{
    public partial class BloodDonor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BloodDonorId",
                table: "Patients",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ApplyDate",
                table: "BloodDonors",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "HaveDonated",
                table: "BloodDonors",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PatientConfirmed",
                table: "BloodDonors",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PendingPatientId",
                table: "BloodDonors",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Patients_BloodDonorId",
                table: "Patients",
                column: "BloodDonorId");

            migrationBuilder.CreateIndex(
                name: "IX_BloodDonors_PatientId",
                table: "BloodDonors",
                column: "PatientId");

            migrationBuilder.AddForeignKey(
                name: "FK_BloodDonors_Patients_PatientId",
                table: "BloodDonors",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "PatientId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_BloodDonors_BloodDonorId",
                table: "Patients",
                column: "BloodDonorId",
                principalTable: "BloodDonors",
                principalColumn: "BloodDonorId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BloodDonors_Patients_PatientId",
                table: "BloodDonors");

            migrationBuilder.DropForeignKey(
                name: "FK_Patients_BloodDonors_BloodDonorId",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_Patients_BloodDonorId",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_BloodDonors_PatientId",
                table: "BloodDonors");

            migrationBuilder.DropColumn(
                name: "BloodDonorId",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "ApplyDate",
                table: "BloodDonors");

            migrationBuilder.DropColumn(
                name: "HaveDonated",
                table: "BloodDonors");

            migrationBuilder.DropColumn(
                name: "PatientConfirmed",
                table: "BloodDonors");

            migrationBuilder.DropColumn(
                name: "PendingPatientId",
                table: "BloodDonors");
        }
    }
}
