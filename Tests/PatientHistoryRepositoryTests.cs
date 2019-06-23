using System;
using Core.Entities;
using Infrastructure.Repositories;
using Microsoft.VisualStudio.TestTools.UnitTesting;


namespace Tests.IntegrationTests
{

    [TestClass]
    public class PatientHistoryRepositoryTests : BaseIntegrationTests
    {
        [TestMethod]
        public void Given_PatientHistoryRepository_When_AddAsyncingAPatientHistory_Then_ThePatientHistoryShouldBeProperlySaved()
        {
            var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
            var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);

            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new PatientHistoryRepository(ctx);
                var patientHistory = PatientHistory.Create(patient.PatientId);

                //Act
                await repository.AddAsync(patientHistory);

                //Assert
                string[] includes = {" "};
                Assert.AreEqual(repository.GetAllAsync(includes).Result.Count, 1);
            });
        }

        [TestMethod]
        public void Given_PatientHistoryRepository_When_DeletingAPatientHistory_Then_ThePatientHistoryShouldBeProperlyRemoved()
        {
            var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
            var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);

            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new PatientHistoryRepository(ctx);
                var patientHistory = PatientHistory.Create(patient.PatientId);
                await repository.AddAsync(patientHistory);

                //Act
                await repository.DeleteAsync(patientHistory.HistoryId);

                //Assert
                string[] includes = { };
                Assert.AreEqual(repository.GetAllAsync(includes).Result.Count, 0);
            });
        }

        [TestMethod]
        public void Given_PatientHistoryRepository_When_EditingAPatientHistory_Then_ThePatientHistoryShouldBeProperlyEdited()
        {
            var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
            var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);

            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new PatientHistoryRepository(ctx);
                var patientHistory = PatientHistory.Create(patient.PatientId);
                await repository.AddAsync(patientHistory);

                var drink = patientHistory.Drink;
                patientHistory.Update(null, null, null, null, null, null, null, null, null);
                var newDrink = patientHistory.Drink;

                //Act
                await repository.UpdateAsync(patientHistory);

                //Assert
                Assert.AreNotEqual(drink, newDrink);
            });
        }

        [TestMethod]
        public void Given_PatientHistoryRepository_When_ReturningAPatientHistory_Then_ThePatientHistoryShouldBeProperlyReturned()
        {
            var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
            var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);


            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new PatientHistoryRepository(ctx);
                var patientHistory = PatientHistory.Create(patient.PatientId);
                await repository.AddAsync(patientHistory);

                //Act
                var extractedPatientHistory = await repository.GetByIdAsync(patientHistory.HistoryId);

                //Assert
                Assert.AreEqual(patientHistory, extractedPatientHistory);
            });
        }

        [TestMethod]
        public void Given_PatientHistoryRepository_When_ReturningAllPatientHistories_Then_AllPatientHistoriesShouldBeProperlyReturned()
        {
            var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
            var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);


            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new PatientHistoryRepository(ctx);
                var patientHistory = PatientHistory.Create(patient.PatientId);
                await repository.AddAsync(patientHistory);

                //Act
                string[] includes = { };

                var count = repository.GetAllAsync(includes).Result.Count;

                //Assert
                Assert.AreEqual(count, 1);
            });
        }
    }
}
