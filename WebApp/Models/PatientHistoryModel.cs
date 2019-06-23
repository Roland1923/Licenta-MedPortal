using System;

namespace WebApp.Models
{
    public class PatientHistoryModel
    {
        public Guid PatientId { get; set; }
        public string Smoke { get; set; }
        public string Drink { get; set; }
        public string Gender { get; set; }
        public string Weight { get; set; }
        public string Height { get; set; }
        public string HealthConditions { get; set; }
        public string Allergies { get; set; }
        public string Consultations { get; set; }
        public DateTime LastVisit { get; set; }
    }
}
