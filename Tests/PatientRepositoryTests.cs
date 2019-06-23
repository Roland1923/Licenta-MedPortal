using System;
using Core.Entities;
using Infrastructure.Repositories;
using Microsoft.VisualStudio.TestTools.UnitTesting;


namespace Tests.IntegrationTests
{
    [TestClass]
    public class PatientRepositoryTests : BaseIntegrationTests
    {
        [TestMethod]
        public void Given_PatientRepository_When_AddAsyncingAPatient_Then_ThePatientShouldBeProperlySaved()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new PatientRepository(ctx);
                Patient patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);

                //Act
                await repository.AddAsync(patient);

                //Assert
                string[] includes = { };
                Assert.AreEqual(repository.GetAllAsync(includes).Result.Count, 1);
            });
        }

        [TestMethod]
        public void Given_PatientRepository_When_DeletingAPatient_Then_ThePatientShouldBeProperlyRemoved()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new PatientRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
                await repository.AddAsync(patient);

                //Act
                await repository.DeleteAsync(patient.PatientId);

                //Assert
                string[] includes = { };
                Assert.AreEqual(repository.GetAllAsync(includes).Result.Count, 1);
            });
        }

        [TestMethod]
        public void Given_PatientRepository_When_EditingAPatient_Then_ThePatientShouldBeProperlyEdited()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new PatientRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
                var firstName = patient.FirstName;

                await repository.AddAsync(patient);

                patient.Update("1234", "Gigi", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459");
                var newFirstName = patient.FirstName;

                //Act
                await repository.UpdateAsync(patient);

                //Assert
                Assert.AreNotEqual(firstName, newFirstName);
            });
        }

        [TestMethod]
        public void Given_PatientRepository_When_ReturningAPatient_Then_ThePatientShouldBeProperlyReturned()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new PatientRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
                await repository.AddAsync(patient);

                //Act
                var extractedPatient = await repository.GetByIdAsync(patient.PatientId);

                //Assert
                Assert.AreEqual(patient, extractedPatient);
            });
        }

        [TestMethod]
        public void Given_PatientRepository_When_ReturningAllPatients_Then_AllPatientsShouldBeProperlyReturned()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new PatientRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
                BloodDonor bloodDonor = BloodDonor.Create("A2", patient.PatientId, new DateTime());
                await repository.AddAsync(patient);

                //Act
                string[] includes = { };

                var count =  repository.GetAllAsync(includes).Result.Count;

                //Assert
                Assert.AreEqual(count, 1);
            });
        }
    }
}
