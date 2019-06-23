using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities
{
    public class PatientHistory
    {
        [Key]
        public Guid HistoryId { get; private set; }

        [ForeignKey("PatientId")]
        public Patient Patient { get; private set; }
        public Guid PatientId { get; private set; }

        public string Smoke { get; private set; }
        public string Drink { get; private set; }
        public string Gender { get; private set; }
        public string Weight { get; private set; }
        public string Height { get; private set; }
        public string HealthConditions { get; private set; }
        public string Allergies { get; private set; }
        public string Consultations { get; private set; }
        public DateTime? LastVisit { get; private set; }

        private PatientHistory() { }

        public static PatientHistory Create(Guid patientId)
        {
            var instance = new PatientHistory { HistoryId = Guid.NewGuid(), PatientId = patientId };
            return instance;
        }

        public void Update(string smoke, string drink, string gender, string weight, string height, string healthCondition,
                            string allergy, string consultation, DateTime? lastVisit)
        {
            Smoke = smoke;
            Drink = drink;
            Gender = gender;
            Weight = weight;
            Height = height;
            if(healthCondition!= null)
            {
                HealthConditions = HealthConditions + healthCondition + Environment.NewLine;
            }

            if (allergy != null)
            {
                Allergies = Allergies + allergy + Environment.NewLine;
            }

            if(consultation != null)
            {
                Consultations = Consultations + consultation + Environment.NewLine;
            }

            LastVisit = lastVisit;
        }
    }
}
