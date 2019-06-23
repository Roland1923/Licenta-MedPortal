using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities
{
    public class AppointmentInterval
    {
        [Key]
        public Guid AppointmentIntervalId { get; private set; }
        public int Day { get; private set; }
        public TimeSpan StartHour { get; private set; }
        public TimeSpan EndHour { get; private set; }

        public Guid DoctorId { get; private set; }
        [ForeignKey("DoctorId")]
        public Doctor Doctor => null;

        public virtual List<Appointment> Appointments { get; private set; }


        public AppointmentInterval() { }

        public static AppointmentInterval Create(int day, TimeSpan startHour, TimeSpan endHour, Guid doctorId)
        {
            var instance = new AppointmentInterval { AppointmentIntervalId = Guid.NewGuid() };
            instance.Update(day, startHour, endHour, doctorId);
            return instance;
        }

        public void Update(int day, TimeSpan startHour, TimeSpan endHour, Guid doctorId)
        {
            Day = day;
            StartHour = startHour;
            EndHour = endHour;
            DoctorId = doctorId;

        }
    }
}
