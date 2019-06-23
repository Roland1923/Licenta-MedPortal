using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Core.Entities;
using Core.IRepositories;
using Infrastructure.Attributes;
using WebApp.Common;
using WebApp.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace WebApp.Apis
{
    [Produces("application/json")]
    [Route("api/Patients")]
    public class PatientsController : Controller
    {
        private readonly IEditableRepository<Patient> _repository;


        public PatientsController(IEditableRepository<Patient> repository)
        {
            _repository = repository;
        }

        // GET api/patients
        [HttpGet]
        [NoCache]
        [ProducesResponseType(typeof(List<Patient>), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> Patients()
        { 
            try
            {
                string[] includes = { "PatientHistory" };
                var patients = await _repository.GetAllAsync(includes);
                return Ok(patients);
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }


        // GET api/patients/page/10/10
        [HttpGet("page/{skip}/{take}")]
        [NoCache]
        [ProducesResponseType(typeof(List<Patient>), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> PatientsPage(int skip, int take)
        {
            try
            {
                var pagingResult = await _repository.GetAllPageAsync(skip, take);
                Response.Headers.Add("X-InlineCount", pagingResult.TotalRecords.ToString());
                return Ok(pagingResult.Records);
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // GET api/patients/5
        [HttpGet("{id}", Name = "GetPatientRoute")]
        [NoCache]
        [ProducesResponseType(typeof(Patient), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> Patients(Guid id, [FromHeader(Name = "Authorization")]string value)
        {
            var token = new JwtSecurityTokenHandler().ReadJwtToken(value);
            var issuer = token.Claims.First(claim => claim.Type == "iss").Value;
            var audience = token.Claims.First(claim => claim.Type == "aud").Value;
            if (issuer != "MyIssuer" || audience != "MyAudience")
            {
                return Unauthorized();
            }

            try
            {
                var patient = await _repository.GetByIdAsync(id);
                return Ok(patient);
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // POST api/patients
        [HttpPost]
        //[ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(ApiResponse), 201)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> CreatePatient([FromBody]PatientModel patient)
        {
            if (!ModelState.IsValid)
            {
               return BadRequest(ModelState);
            }

            MD5 md5Hash = MD5.Create();
            string passwordHash = PasswordHashMd5.GetMd5Hash(md5Hash, patient.Password);
            string ninHash = PasswordHashMd5.GetMd5Hash(md5Hash, patient.NIN);

            var instance = Patient.Create(ninHash, patient.FirstName, patient.LastName, patient.Email, passwordHash, patient.City, patient.Country, patient.Birthdate, patient.PhoneNumber, null);

            try
            {
                var newPatient = await _repository.AddAsync(instance);
                if (newPatient == null)
                {
                    return BadRequest(new ApiResponse { Status = false });
                }
                return CreatedAtRoute("GetPatientRoute", new { id = newPatient.PatientId },
                    new ApiResponse { Status = true, Patient = newPatient });
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // PUT api/patients/5
        [HttpPut("{id}")]
        //[ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> UpdatePatient(Guid id, [FromBody]PatientModel patient, [FromHeader(Name = "Authorization")]string value)
        {

            var token = new JwtSecurityTokenHandler().ReadJwtToken(value);
            var issuer = token.Claims.First(claim => claim.Type == "iss").Value;
            var audience = token.Claims.First(claim => claim.Type == "aud").Value;
            if (issuer != "MyIssuer" || audience != "MyAudience")
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            MD5 md5Hash = MD5.Create();
            string passwordHash = PasswordHashMd5.GetMd5Hash(md5Hash, patient.Password);

            var instance = await _repository.GetByIdAsync(id);

            try
            {
                instance.Update(patient.NIN, patient.FirstName, patient.LastName, patient.Email, passwordHash, patient.City, patient.Country, patient.Birthdate, patient.PhoneNumber);

                var status = await _repository.UpdateAsync(instance);
                if (!status)
                {
                    return BadRequest(new ApiResponse { Status = false });
                }
                return Ok(new ApiResponse { Status = true, Patient = instance });
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // DELETE api/patients/5
        [HttpDelete("{id}")]
        //[ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> DeletePatient(Guid id)
        {
            try
            {
                var status = await _repository.DeleteAsync(id);
                if (!status)
                {
                    return BadRequest(new ApiResponse { Status = false });
                }
                return Ok(new ApiResponse { Status = true });
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // DELETE api/Patients
        [HttpDelete]
        // [ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> DeleteAll()
        {
            try
            {
                var status = await _repository.DeleteAll();
                if (!status)
                {
                    return BadRequest(new ApiResponse { Status = false });
                }
                return Ok(new ApiResponse { Status = true });
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }


    }
}