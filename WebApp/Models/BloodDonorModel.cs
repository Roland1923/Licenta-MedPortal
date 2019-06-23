using System;

namespace WebApp.Models
{
    public class BloodDonorModel
    {
        public string Type { get; set; }
        public Guid PatientId { get; set; }
        public DateTime ApplyDate { get; set; }
        public bool HaveDonated { get; set; }
        public bool PatientConfirmed { get; set; }
        public string PendingPatientId { get; set; }
    }
}
