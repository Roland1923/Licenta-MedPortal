using FluentValidation;

namespace WebApp.Models.Validations
{
    public class BloodDonorValidator : AbstractValidator<BloodDonorModel>
    {
        public BloodDonorValidator()
        {
            RuleFor(c => c.Type).NotNull();
            RuleFor(c => c.PatientId).NotNull();
        }
    }
}
