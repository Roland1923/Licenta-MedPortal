﻿using System;
using Core.Entities;
using Infrastructure.Repositories;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests.IntegrationTests
{
    [TestClass]
    public class BloodDonorRepositoryTests : BaseIntegrationTests
    {
        [TestMethod]
        public void Given_BloodDonorRepository_When_AddingAnBloodDonor_Then_TheBloodDonorShouldBeProperlySaved()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new BloodDonorRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
                var bloodDonor = BloodDonor.Create("AB4", patient.PatientId, new DateTime());

                //Act
                await repository.AddAsync(bloodDonor);

                //Assert
                string[] includes = { };
                Assert.AreEqual(repository.GetAllAsync(includes).Result.Count, 1);
            });
        }
        [TestMethod]
        public void Given_BloodDonorRepository_When_DeletingAnBloodDonor_Then_TheBloodDonorShouldBeProperlyRemoved()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new BloodDonorRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
                var bloodDonor = BloodDonor.Create("AB4", patient.PatientId, new DateTime());

                await repository.AddAsync(bloodDonor);

                //Act
                await repository.DeleteAsync(bloodDonor.BloodDonorId);

                //Assert
                string[] includes = { };
                Assert.AreEqual(repository.GetAllAsync(includes).Result.Count, 1);
            });
        }
        [TestMethod]
        public void Given_BloodDonorRepository_When_EditingAnBloodDonor_Then_TheBloodDonorShouldBeProperlyEdited()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new BloodDonorRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
                var bloodDonor = BloodDonor.Create("AB4", patient.PatientId, new DateTime());
                await repository.AddAsync(bloodDonor);
                var currentType = bloodDonor.Type;
                bloodDonor.Update("A4", patient.PatientId, new DateTime(), false, false, null);
                var newCurrentType = bloodDonor.Type;

                //Act
                await repository.UpdateAsync(bloodDonor);

                //Assert
                Assert.AreNotEqual(currentType, newCurrentType);
            });
        }
        [TestMethod]
        public void Given_BloodDonorRepository_When_ReturningAnBloodDonor_Then_TheBloodDonorShouldBeProperlyReturned()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new BloodDonorRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
                var bloodDonor = BloodDonor.Create("AB4", patient.PatientId, new DateTime());
                await repository.AddAsync(bloodDonor);

                //Act
                var extractedBloodDonor = repository.GetByIdAsync(bloodDonor.BloodDonorId);

                //Assert
                Assert.AreEqual(bloodDonor, extractedBloodDonor);
            });
        }
        [TestMethod]
        public void Given_BloodDonorRepository_When_ReturningAllBloodDonors_Then_AllBloodDonorsShouldBeProperlyReturned()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new BloodDonorRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
                var bloodDonor = BloodDonor.Create("AB4", patient.PatientId, new DateTime());
                await repository.AddAsync(bloodDonor);

                //Act
                string[] includes = { };

                var count = repository.GetAllAsync(includes).Result.Count;

                //Assert
                Assert.AreEqual(count, 1);
            });
        }
    }
}
