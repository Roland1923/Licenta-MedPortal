using System;
using Core.Entities;
using Infrastructure.Repositories;
using Microsoft.VisualStudio.TestTools.UnitTesting;


namespace Tests.IntegrationTests
{
    [TestClass]
    public class FeedbackRepositoryTests : BaseIntegrationTests
    {
        [TestMethod]
        public void Given_FeedbackRepository_When_AddAsyncingAFeedback_Then_TheFeedbackShouldBeProperlySaved()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new FeedbackRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
                var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);
                var feedback = Feedback.Create("OK", patient.PatientId, doctor.DoctorId, 5, new DateTime());
                
                //Act
                await repository.AddAsync(feedback);

                //Assert
                string[] includes = { };
                Assert.AreEqual(repository.GetAllAsync(includes).Result.Count, 1);
            });
        }

        [TestMethod]
        public void Given_FeedbackRepository_When_DeletingAFeedback_Then_TheFeedbackShouldBeProperlyRemoved()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new FeedbackRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
                var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);
                var feedback = Feedback.Create("OK", patient.PatientId, doctor.DoctorId, 5, new DateTime());
                await repository.AddAsync(feedback);

                //Act
                await repository.DeleteAsync(feedback.FeedbackId);

                //Assert
                string[] includes = { };
                Assert.AreEqual(repository.GetAllAsync(includes).Result.Count, 1);
            });
        }

        [TestMethod]
        public void Given_FeedbackRepository_When_EditingAFeedback_Then_TheFeedbackShouldBeProperlyEdited()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new FeedbackRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
                var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);
                var feedback = Feedback.Create("OK", patient.PatientId, doctor.DoctorId, 5, new DateTime());
                await repository.AddAsync(feedback);

                var description = feedback.Description;
                feedback.Update("IT's OK", patient.PatientId, doctor.DoctorId, 4, new DateTime());

                //Act
                await repository.UpdateAsync(feedback);

                //Assert
                Assert.AreNotEqual(feedback.Description, description);
            });
        }

        [TestMethod]
        public void Given_FeedbackRepository_When_ReturningAFeedback_Then_TheFeedbackShouldBeProperlyReturned()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new FeedbackRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
                var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);
                var feedback = Feedback.Create("OK", patient.PatientId, doctor.DoctorId, 5, new DateTime());
                await repository.AddAsync(feedback);

                //Act
                var extractedFeedback = await repository.GetByIdAsync(feedback.FeedbackId);

                //Assert
                Assert.AreEqual(feedback, extractedFeedback);
            });
        }

        [TestMethod]
        public void Given_FeedbackRepository_When_ReturningAllFeedbacks_Then_AllFeedbacksShouldBeProperlyReturned()
        {
            RunOnDatabase(async ctx => {
                //Arrange
                var repository = new FeedbackRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
                var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);
                var feedback = Feedback.Create("OK", patient.PatientId, doctor.DoctorId, 5, new DateTime());
                await repository.AddAsync(feedback);

                //Act
                string[] includes = { };

                var count = repository.GetAllAsync(includes).Result.Count;

                //Assert
                Assert.AreEqual(count, 1);
            });
        }
    }
}
