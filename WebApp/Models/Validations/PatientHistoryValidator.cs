using System;
using FluentValidation;

namespace WebApp.Models.Validations
{
    public class PatientHistoryValidator : AbstractValidator<PatientHistoryModel>
    {
        public PatientHistoryValidator()
        {
            RuleFor(c => c.PatientId).NotNull();
        }
        private bool BeAValidDate(DateTime date)
        {
            return date < DateTime.Now;
        }
    }
}
