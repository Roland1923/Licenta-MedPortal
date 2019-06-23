using System;

namespace WebApp.Models
{
    public class AppointmentModel
    {
        public DateTime AppointmentDate { get; set; }
        public Guid DoctorId { get; set; }
        public Guid PatientId { get; set; }
        public Guid AppointmentIntervalId { get; set; }
        public bool HaveFeedback { get; set; }
        public bool HaveMedicalHistory { get; set; }
    }
}
