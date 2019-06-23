using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities
{
    public class Patient
    {
        [Key]
        public Guid PatientId { get; private set; }
        public string NIN { get; private set; }
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string Email { get; private set; }
        public string Password { get; private set; }
        public string City { get; private set; }
        public string Country { get; private set; }
        public DateTime Birthdate { get; private set; }
        public string PhoneNumber { get; private set; }
        [ForeignKey("BloodDonorId")]
        public BloodDonor BloodDonor { get; private set; }
        public Guid? BloodDonorId { get; private set; }

        
        [ForeignKey("HistoryId")]
        public PatientHistory PatientHistory { get; private set; }
        public Guid HistoryId { get; private set; }

        public List<Appointment> Appointments { get; private set; }
        
        public List<Feedback> Feedbacks { get; private set; }

        private Patient() { }

        public static Patient Create(string NIN, string firstName, string lastName, string email, string password, string city, string country, DateTime birthdate, string phoneNumber, BloodDonor bloodDonor)
        {
            var instance = new Patient { PatientId = Guid.NewGuid() };
            instance.Update(NIN, firstName, lastName, email, password, city, country, birthdate, phoneNumber);
            return instance;
        }

        public void Update(string nin, string firstName, string lastName, string email, string password, string city, string country, DateTime birthdate, string phoneNumber)
        {
            NIN = nin;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Password = password;
            City = city;
            Country = country;
            Birthdate = birthdate;
            PhoneNumber = phoneNumber;
        }
    }
}
