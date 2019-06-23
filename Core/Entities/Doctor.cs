﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
    public class Doctor
    {
        [Key]
        public Guid DoctorId { get; private set; }
        public string DIN { get; private set; }
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string Email { get; private set; }
        public string Password { get; private set; }
        public string PhoneNumber { get; private set; }
        public string Description { get; private set; }
        public string Speciality { get; private set; }
        public string Hospital { get; private set; }
        public string City { get; private set; }
        public string Country { get; private set; }
        public string Address { get; private set; }
        public bool IsMale { get; private set; }
        public List<AppointmentInterval> AppointmentIntervals => null;
        public List<Appointment> Appointments { get; private set; }
        public List<Feedback> Feedbacks => null;

        private Doctor() { }

        public static Doctor Create(string DIN, string firstName, string lastName, string email, string password, string phoneNumber, string description, string speciality, string hospital, string city, string country, string address, bool isMale)
        {
            var instance = new Doctor { DoctorId = Guid.NewGuid() };
            instance.Update(DIN, firstName, lastName, email, password, phoneNumber, description, speciality, hospital, city, country, address, isMale);
            return instance;
        }

        public void Update(string din, string firstName, string lastName, string email, string password, string phoneNumber, string description, string speciality, string hospital, string city, string country, string address, bool isMale)
        {
            DIN = din;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Password = password;
            PhoneNumber = phoneNumber;
            Description = description;
            Speciality = speciality;
            Hospital = hospital;
            City = city;
            Country = country;
            Address = address;
            IsMale = isMale;
        }
    }
}
