using System;

namespace WebApp.Models

{
    public class FeedbackModel
    {
        public string Description { get; set; }
        public Guid PatientId { get; set; }
        public Guid DoctorId { get; set; }
        public int Rating { get; set; }
        public DateTime ReviewDate { get; set; }
        public DateTime AppointmentDate { get; set; }
    }
}