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
            var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu");

            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new PatientHistoryRepository(ctx);
                var patientHistory = PatientHistory.Create(patient.PatientId, doctor.DoctorId, "Paracetamol", "Febra", "Odihna", new DateTime(1996, 02, 10));

                //Act
                await repository.AddAsync(patientHistory);

                //Assert
                Assert.AreEqual(repository.GetAllAsync().Result.Count, 1);
            });
        }

        [TestMethod]
        public void Given_PatientHistoryRepository_When_DeletingAPatientHistory_Then_ThePatientHistoryShouldBeProperlyRemoved()
        {
            var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
            var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu");

            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new PatientHistoryRepository(ctx);
                var patientHistory = PatientHistory.Create(patient.PatientId, doctor.DoctorId, "Paracetamol", "Febra", "Odihna", new DateTime(1996, 02, 10));
                await repository.AddAsync(patientHistory);

                //Act
                await repository.DeleteAsync(patientHistory.HistoryId);

                //Assert
                Assert.AreEqual(repository.GetAllAsync().Result.Count, 0);
            });
        }

        [TestMethod]
        public void Given_PatientHistoryRepository_When_EditingAPatientHistory_Then_ThePatientHistoryShouldBeProperlyEdited()
        {
            var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
            var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu");

            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new PatientHistoryRepository(ctx);
                var patientHistory = PatientHistory.Create(patient.PatientId, doctor.DoctorId, "Paracetamol", "Febra", "Odihna", new DateTime(1996, 02, 10));
                await repository.AddAsync(patientHistory);

                var prescription = patientHistory.Prescription;
                patientHistory.Update(patient.PatientId, doctor.DoctorId, "Fervex", "Febra", "Odihna", new DateTime(1996, 02, 10));
                var newPrescription = patientHistory.Prescription;

                //Act
                await repository.UpdateAsync(patientHistory);

                //Assert
                Assert.AreNotEqual(prescription, newPrescription);
            });
        }

        [TestMethod]
        public void Given_PatientHistoryRepository_When_ReturningAPatientHistory_Then_ThePatientHistoryShouldBeProperlyReturned()
        {
            var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
            var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu");


            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new PatientHistoryRepository(ctx);
                var patientHistory = PatientHistory.Create(patient.PatientId, doctor.DoctorId, "Paracetamol", "Febra", "Odihna", new DateTime(1996, 02, 10));
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
            var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu");


            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new PatientHistoryRepository(ctx);
                var patientHistory = PatientHistory.Create(patient.PatientId, doctor.DoctorId, "Paracetamol", "Febra", "Odihna", new DateTime(1996, 02, 10));
                await repository.AddAsync(patientHistory);

                //Act
                var count = repository.GetAllAsync().Result.Count;

                //Assert
                Assert.AreEqual(count, 1);
            });
        }
    }
}
