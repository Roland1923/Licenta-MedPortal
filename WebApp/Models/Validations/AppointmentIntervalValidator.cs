using FluentValidation;
using System;

namespace WebApp.Models.Validations
{
    public class AppointmentIntervalValidator : AbstractValidator<AppointmentIntervalModel>
    {
        public AppointmentIntervalValidator()
        {
            RuleFor(c => c.Day).NotNull().WithMessage("Trebuie sa specificati o data").Must(BeAValidDate).WithMessage("Ziua saptamanii trebuie sa fie intre 1 si 7 (luni-vineri)");
            RuleFor(c => c.StartHour).NotNull().Must((appointmentIntervalModel, startHour) =>
                StartHourMustBeLessThanEndHour(appointmentIntervalModel.EndHour, startHour)).WithMessage("Ora de inceput trebuie sa fie mai mica decat ora de sfarsit");
            RuleFor(c => c.EndHour).NotNull();
            RuleFor(c => c.DoctorId).NotNull();
        }

        private bool BeAValidDate(int day)
        {
            return day > 0 && day < 8;
        }

        private bool StartHourMustBeLessThanEndHour(TimeSpan startHour, TimeSpan endHour)
        {
            if (TimeSpan.Compare(startHour, endHour) == 0 || TimeSpan.Compare(startHour, endHour) == -1)
            {
                return false;
            }
            return true;
        }
    }
}
