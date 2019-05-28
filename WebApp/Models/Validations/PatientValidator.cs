﻿using System;
using FluentValidation;
using Core.Entities;
using Core.IRepositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace WebApp.Models.Validations
{
    public class PatientValidator : AbstractValidator<PatientModel>
    {
        private IEditableRepository<Patient> _repository;

        public PatientValidator(IEditableRepository<Patient> _repository)
        {
            this._repository = _repository;
            RuleFor(c => c.NIN).NotNull().WithMessage("Trebuie sa specificati un NIN").MustAsync(NinIsUniqueAsync).WithMessage("NIN-ul trebuie sa fie unic!");
            RuleFor(c => c.FirstName).NotNull().WithMessage("Trebuie sa specificati un prenume").Length(3, 30)
                .WithMessage("Trebuie sa aiba intre 3 si 30 caractere");
            RuleFor(c => c.LastName).NotNull().WithMessage("Trebuie sa specificati un nume").Length(3, 30)
                .WithMessage("Trebuie sa aiba intre 3 si 30 caractere");
            RuleFor(c => c.Email).NotNull().WithMessage("Trebuie sa specificati o adresa de email").EmailAddress()
                .WithMessage("Trebuie sa specificati o adresa valida").MustAsync(EmailIsUniqueAsync).WithMessage("Email-ul trebuie sa fie unic!");
            RuleFor(c => c.Password).NotNull().WithMessage("Trebuie sa specificati o parola").Length(6, 20)
                .WithMessage("Parola trebuie sa fie intre 6 si 20 caractere");
            RuleFor(c => c.City).NotNull().WithMessage("Trebuie sa specificati un oras").Length(3, 30)
                .WithMessage("Numele orasului trebuie sa aiba intre 3 si 30 caractere");
            RuleFor(c => c.Country).NotNull().WithMessage("Trebuie sa specificati o tara").Length(3, 30)
                .WithMessage("Numele tarii trebuie sa aiba intre 3 si 30 caractere");
            RuleFor(c => c.Birthdate).NotNull().WithMessage("Trebuie sa specificati data de nastere").Must(BeAValidDate);
            RuleFor(c => c.PhoneNumber).NotNull().WithMessage("Trebuie sa specificati un numar de telefon");
            //.Matches(@" ^\(? ([0 - 9]{ 3})\)?[-. ]? ([0 - 9]{3})[-. ]? ([0 - 9]{4})$")
            //.WithMessage("Numarul de telefon invalid");
        }

        private bool BeAValidDate(DateTime date)
        {
            return date < DateTime.Now;
        }

        private async Task<bool> NinIsUniqueAsync(string NIN, CancellationToken arg2)
        {
            List<Patient> patients = await _repository.GetAllAsync();
            return !patients.Any(x => x.NIN == NIN);
        }

        private async Task<bool> EmailIsUniqueAsync(string Email, CancellationToken arg2)
        {
            List<Patient> patients = await _repository.GetAllAsync();
            return !patients.Any(x => x.Email == Email);
        }
    }
}
