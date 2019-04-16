using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Infrastructure.Migrations
{
    public partial class NIN_and_Country_Added_for_Patient : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Patients",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NIN",
                table: "Patients",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Country",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "NIN",
                table: "Patients");
        }
    }
}
