using Core.Entities;
using Infrastructure.Repositories;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests.IntegrationTests
{
    [TestClass]
    public class DoctorRepositoryTests : BaseIntegrationTests
    {
        [TestMethod]
        public void Given_DoctorRepository_When_AddAsyncingADoctor_Then_TheDoctorShouldBeProperlySaved()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new DoctorRepository(ctx);
                var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);

                //Act
                await repository.AddAsync(doctor);

                //Assert
                string[] includes = { };
                Assert.AreEqual(repository.GetAllAsync(includes).Result.Count, 1);
            });
        }

        [TestMethod]
        public void Given_DoctorRepository_When_DeletingADoctor_Then_TheDoctorShouldBeProperlyRemoved()
        {
            RunOnDatabase(async ctx => {
                // Arrange
                var repository = new DoctorRepository(ctx);
              var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);
                await repository.AddAsync(doctor);

                //Act
                await repository.DeleteAsync(doctor.DoctorId);

                //Assert
                string[] includes = { };
                Assert.AreEqual(repository.GetAllAsync(includes).Result.Count, 1);
            });
        }

        [TestMethod]
        public void Given_DoctorRepository_When_EditingADoctor_Then_TheDoctorShouldBeProperlyEdited()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new DoctorRepository(ctx);
              var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);
                await repository.AddAsync(doctor);

                var firstName = doctor.FirstName;

               doctor.Update("1234", "Axinte", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);

                var newFirstName = doctor.FirstName;

                //Act
                await repository.UpdateAsync(doctor);

                //Assert
                Assert.AreNotEqual(firstName, newFirstName);
            });
        }

        [TestMethod]
        public void Given_DoctorRepository_When_ReturningADoctor_Then_TheDoctorShouldBeProperlyReturned()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new DoctorRepository(ctx);
              var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);
                await repository.AddAsync(doctor);

                //Act
                var extractedDoctor = await repository.GetByIdAsync(doctor.DoctorId);

                //Assert
                Assert.AreEqual(doctor, extractedDoctor);
            });
        }

        [TestMethod]
        public void Given_DoctorRepository_When_ReturningAllDoctors_Then_AllDoctorsShouldBeProperlyReturned()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new DoctorRepository(ctx);
              var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);
                await repository.AddAsync(doctor);

                //Act
                string[] includes = { };

                var count = repository.GetAllAsync(includes).Result.Count;

                //Assert
                Assert.AreEqual(count, 1);
            });
        }
    }
}
