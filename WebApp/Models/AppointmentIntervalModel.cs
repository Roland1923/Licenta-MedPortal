using System;

namespace WebApp.Models
{
    public class AppointmentIntervalModel
    {
        public int Day { get; set; }
        public TimeSpan StartHour { get; set; }
        public TimeSpan EndHour { get; set; }
        public Guid DoctorId { get; set; }


    }
}
