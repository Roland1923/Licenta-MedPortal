﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities
{
    public class Feedback
    {
        [Key]
        public Guid FeedbackId { get; private set; }
        [ForeignKey("PatientId")]
        public Patient Patient { get; private set; }
        public Guid PatientId { get; private set; }
        [ForeignKey("DoctorId")]
        public Doctor Doctor => null;
        public Guid DoctorId { get; private set; }
        public string Description { get; private set; }
        public int Rating { get; private set; }
        public DateTime ReviewDate { get; private set; }
        public DateTime AppointmentDate { get; private set; }

        private Feedback() { }

        public static Feedback Create(string description, Guid patientId, Guid doctorId, int rating, DateTime appointmentDate)
        {
            var instance = new Feedback { FeedbackId = Guid.NewGuid(), ReviewDate = DateTime.Now};
            instance.Update(description, patientId, doctorId, rating, appointmentDate);
            return instance;
        }

        public void Update(string description, Guid patientId, Guid doctorId, int rating, DateTime appointmentDate)
        {
            AppointmentDate = appointmentDate;
            Description = description;
            PatientId = patientId;
            DoctorId = doctorId;
            Rating = rating;
        }
    }
}
