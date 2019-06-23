using System;
using Core.Entities;
using Infrastructure.Repositories;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Tests.IntegrationTests
{
    [TestClass]
    public class AppointmentRepositoryTests : BaseIntegrationTests
    {
        [TestMethod]
        public void Given_AppointmentRepository_When_AddAsyncingAnAppointment_Then_TheAppointmentShouldBeProperlySaved()
        {
            RunOnDatabase(async ctx =>
            {
                //Arrange
                var repository = new AppointmentRepository(ctx);
                
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
                var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);
                var appointmentInterval = AppointmentInterval.Create(3, new TimeSpan(0,10,0,0), new TimeSpan(0, 11, 0, 0), doctor.DoctorId);
                var appointment = Appointment.Create(appointmentInterval.AppointmentIntervalId, new DateTime(1996, 02, 10), doctor.DoctorId, patient.PatientId);

                //Act
                await repository.AddAsync(appointment);

                //Assert
                string[] includes = { };
                Assert.AreEqual(repository.GetAllAsync(includes).Result.Count, 1);
            });
        }

        [TestMethod]
        public void Given_AppointmentRepository_When_DeletingAnAppointment_Then_TheAppointmentShouldBeProperlyRemoved()
        {
            RunOnDatabase(async ctx =>
            {
                //Arrange
                var repository = new AppointmentRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
              var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);
                var appointmentInterval = AppointmentInterval.Create(3, new TimeSpan(0, 10, 0, 0), new TimeSpan(0, 11, 0, 0), doctor.DoctorId);
                var appointment = Appointment.Create(appointmentInterval.AppointmentIntervalId, new DateTime(1996, 02, 10), doctor.DoctorId, patient.PatientId);
                await repository.AddAsync(appointment);

                //Act
                await repository.DeleteAsync(appointment.PatientId);

                //Assert
                string[] includes = { };
                Assert.AreEqual(repository.GetAllAsync(includes).Result.Count, 0);
            });
        }

        [TestMethod]
        public void Given_AppointmentRepository_When_EditingAnAppointment_Then_TheAppointmentShouldBeProperlyEdited()
        {
            RunOnDatabase(async ctx =>
            {
                //Arrange
                var repository = new AppointmentRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
                var patient2 = Patient.Create("1234", "Roland", "Iordache2", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
              var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);
          
                var appointmentInterval = AppointmentInterval.Create(3, new TimeSpan(0, 10, 0, 0), new TimeSpan(0, 11, 0, 0), doctor.DoctorId);
                var appointment = Appointment.Create(appointmentInterval.AppointmentIntervalId, new DateTime(1996, 02, 10), doctor.DoctorId, patient.PatientId);
   


                await repository.AddAsync(appointment);

                var appointmentPatient = appointment.Patient;
                appointment.Update(appointmentInterval.AppointmentIntervalId, new DateTime(1996, 02, 10), doctor.DoctorId, patient2.PatientId, appointment.HaveFeedback, appointment.HaveMedicalHistory);

                //Act
                await repository.UpdateAsync(appointment);

                //Assert
                Assert.AreNotEqual(appointmentPatient, appointment.Patient);
            });
        }

        [TestMethod]
        public void Given_AppointmentRepository_When_ReturningAnAppointment_Then_TheAppointmentShouldBeProperlyReturned()
        {
            RunOnDatabase(async ctx =>
            {
                //Arrange
                var repository = new AppointmentRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
              var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);
                var appointmentInterval = AppointmentInterval.Create(3, new TimeSpan(0, 10, 0, 0), new TimeSpan(0, 11, 0, 0), doctor.DoctorId);
                var appointment = Appointment.Create(appointmentInterval.AppointmentIntervalId, new DateTime(1996, 02, 10), doctor.DoctorId, patient.PatientId);
                await repository.AddAsync(appointment);

                //Act
                var extractedAppointment = repository.GetByIdAsync(appointment.AppointmentId);

                //Assert
                Assert.AreEqual(appointment, extractedAppointment);
            });
        }

        [TestMethod]
        public void Given_AppointmentRepository_When_ReturningAllAppointments_Then_AllAppointmentsShouldBeProperlyReturned()
        {
            RunOnDatabase(async ctx =>
            {
                //Arrange
                var repository = new AppointmentRepository(ctx);
                var patient = Patient.Create("1234", "Roland", "Iordache", "roland.iordache96@gmail.com", "asfdsdssd", "Iasi", "Romania", new DateTime(1996, 02, 10), "0746524459", null);
              var doctor = Doctor.Create("1234", "Mircea", "Cartarescu", "mircea.cartarescu@gmail.com", "parola", "0746524459", "blasdadsadsada", "Cardiologie", "Sf. Spiridon", "Iasi", "Romania", "Str. Vasile Lupu", true);
                var appointmentInterval = AppointmentInterval.Create(3, new TimeSpan(0, 10, 0, 0), new TimeSpan(0, 11, 0, 0), doctor.DoctorId);
                var appointment = Appointment.Create(appointmentInterval.AppointmentIntervalId, new DateTime(1996, 02, 10), doctor.DoctorId, patient.PatientId);
                await repository.AddAsync(appointment);

                //Act
                string[] includes = { };
                var count = repository.GetAllAsync(includes).Result.Count;

                //Assert
                Assert.AreEqual(count, 1);
            });
        }
    }
}
