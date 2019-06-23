using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities
{
    public class Appointment
    {
        [Key]
        public Guid AppointmentId { get; private set; }

        public Guid PatientId { get; private set; }
        [ForeignKey("PatientId")]
        public Patient Patient { get; private set; }

        public Guid DoctorId { get; private set; }
        [ForeignKey("DoctorId")]
        public Doctor Doctor { get; private set; }

        public DateTime AppointmentDate { get; private set; }

        public Guid? AppointmentIntervalId { get; private set; }
        [ForeignKey("AppointmentIntervalId")]
        public virtual AppointmentInterval AppointmentInterval { get; private set; }

        public bool HaveFeedback { get; private set; }
        public bool HaveMedicalHistory { get; private set; }
        

        public Appointment() { }

        public static Appointment Create(Guid appointmentIntervalId, DateTime appointmentDate, Guid doctorId, Guid patientId)
        {
            var instance = new Appointment { AppointmentId = Guid.NewGuid() };
            instance.Update(appointmentIntervalId, appointmentDate, doctorId, patientId, false, false);
            return instance;
        }

        public void Update(Guid appointmentIntervalId, DateTime appointmentDate, Guid doctorId, Guid patientId, bool haveFeedback, bool haveMedicalHistory)
        {
            HaveFeedback = haveFeedback;
            AppointmentIntervalId = appointmentIntervalId;
            AppointmentDate = appointmentDate;
            DoctorId = doctorId;
            PatientId = patientId;
            HaveMedicalHistory = haveMedicalHistory;
        }
    }
}
