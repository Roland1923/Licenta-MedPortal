using Core.Entities;
using Core.IRepositories;
using FluentValidation;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace WebApp.Models.Validations
{
    public class DoctorValidator : AbstractValidator<DoctorModel>
    {

        private IEditableRepository<Doctor> _repository;

        public DoctorValidator(IEditableRepository<Doctor> _repository)
        {
            this._repository = _repository;
            RuleFor(c => c.DIN).NotNull().WithMessage("Trebuie sa specificati un DIN");
            //.MustAsync(DinIsUniqueAsync).WithMessage("DIN-ul trebuie sa fie unic!");
            RuleFor(c => c.FirstName).NotNull().WithMessage("Trebuie sa specificati un prenume").Length(3, 30)
                .WithMessage("Trebuie sa aiba intre 3 si 30 caractere");
            RuleFor(c => c.LastName).NotNull().WithMessage("Trebuie sa specificati un nume").Length(3, 30)
                .WithMessage("Trebuie sa aiba intre 3 si 30 caractere");
            RuleFor(c => c.Email).NotNull().WithMessage("Trebuie sa specificati o adresa de email").EmailAddress()
                .WithMessage("Trebuie sa specificati o adresa valida");
            //.MustAsync(EmailIsUniqueAsync).WithMessage("Email-ul trebuie sa fie unic!");
            RuleFor(c => c.Password).NotNull().WithMessage("Trebuie sa specificati o parola").Length(6, 35)
                .WithMessage("Parola trebuie sa fie intre 6 si 35 caractere");
            RuleFor(c => c.City).NotNull().WithMessage("Trebuie sa specificati un oras").Length(3, 30)
                .WithMessage("Numele orasului trebuie sa aiba intre 3 si 30 caractere");
            RuleFor(c => c.Country).NotNull().WithMessage("Trebuie sa specificati o tara").Length(3, 30)
                .WithMessage("Numele tarii trebuie sa aiba intre 3 si 30 caractere");
            RuleFor(c => c.PhoneNumber).NotNull().WithMessage("Trebuie sa specificati un numar de telefon");
            //.Matches(@" ^\(? ([0 - 9]{ 3})\)?[-. ]? ([0 - 9]{3})[-. ]? ([0 - 9]{4})$")
            //.WithMessage("Numarul de telefon invalid");
            RuleFor(c => c.Description).NotNull().Length(10, 50).WithMessage("Trebuie sa introduceti o descriere intre 10 si 50 caractere");
            RuleFor(c => c.Hospital).NotNull().WithMessage("Trebuie sa specificati spitalul");
            RuleFor(c => c.Address).NotNull().WithMessage("Trebuie sa specificati adresa");
            RuleFor(c => c.Speciality).NotNull().WithMessage("Trebuie sa specificati specialitatea");
        }

        private async Task<bool> DinIsUniqueAsync(string DIN, CancellationToken arg2)
        {
            string[] includes = { };
            List<Doctor> doctors = await _repository.GetAllAsync(includes);
            return !doctors.Any(x => x.DIN == DIN);
        }

        private async Task<bool> EmailIsUniqueAsync(string Email, CancellationToken arg2)
        {
            string[] includes = { };
            List<Doctor> doctors = await _repository.GetAllAsync(includes);
            return !doctors.Any(x => x.Email == Email);
        }
    }
}
