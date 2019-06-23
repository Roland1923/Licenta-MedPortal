using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities
{
    public class BloodDonor
    {
        [Key]
        public Guid BloodDonorId { get; private set; }
        public string Type { get; private set; }
        [ForeignKey("PatientId")]
        public Patient Patient { get; private set; }
        public Guid PatientId { get; private set; }
        public DateTime ApplyDate { get; private set; }
        public bool HaveDonated { get; private set; }
        public bool PatientConfirmed { get; private set; }
        public string PendingPatientId { get; private set; }

        private BloodDonor() { }

        public static BloodDonor Create(string type, Guid patientId, DateTime applyDate)
        {
            var instance = new BloodDonor { BloodDonorId = Guid.NewGuid() };
            instance.Update(type, patientId, applyDate, false, false, null);
            return instance;
        }

        public void Update(string type, Guid patientId, DateTime applyDate, bool haveDonated, bool patientConfirmed, string pendingPatientId)
        {
            Type = type;
            PatientId = patientId;
            ApplyDate = applyDate;
            HaveDonated = haveDonated;
            PatientConfirmed = patientConfirmed;
            PendingPatientId = pendingPatientId;
        }
    }
}
