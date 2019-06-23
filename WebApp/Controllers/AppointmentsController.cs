using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Core.Entities;
using Core.IRepositories;
using Infrastructure.Attributes;
using WebApp.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace WebApp.Apis
{
    [Produces("application/json")]
    [Route("api/Appointments")]
    public class AppointmentController : Controller
    {
        private readonly IEditableRepository<Appointment> _repository;
        
        public AppointmentController(IEditableRepository<Appointment> repository)
        {
            _repository = repository;
        }

        // GET api/Appointments
        [HttpGet]
        [NoCache]
        [ProducesResponseType(typeof(List<Appointment>), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> Appointments([FromHeader(Name = "Authorization")]string value)
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
                string[] includes = { "AppointmentInterval", "Patient", "Doctor" };

                var appointments = await _repository.GetAllAsync(includes);

                //System.Diagnostics.Debug.WriteLine("SomeText", appointments);
                return Ok(appointments);
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }


        // GET api/Appointments/page/10/10
        [HttpGet("page/{skip}/{take}")]
        [NoCache]
        [ProducesResponseType(typeof(List<Appointment>), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> AppointmentsPage(int skip, int take)
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

        // GET api/Appointments/5
        [HttpGet("{id}", Name = "GetAppointmentRoute")]
        [NoCache]
        [ProducesResponseType(typeof(Appointment), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> Appointments(Guid id)
        {
            try
            {
                var appointment = await _repository.GetByIdAsync(id);
                return Ok(appointment);
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // POST api/Appointments
        [HttpPost]
        //[ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(ApiResponse), 201)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> CreateAppointment([FromBody]AppointmentModel appointment, [FromHeader(Name = "Authorization")]string value)
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

            var instance = Appointment.Create(appointment.AppointmentIntervalId, appointment.AppointmentDate, appointment.DoctorId, appointment.PatientId);
            
            try
            {
                var newAppointment = await _repository.AddAsync(instance);
                if (newAppointment == null)
                {
                    return BadRequest(new ApiResponse { Status = false });
                }
                return CreatedAtRoute("GetAppointmentRoute", new { id = newAppointment.AppointmentId },
                    new ApiResponse { Status = true, Appointment = newAppointment });
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // PUT api/Appointments/5
        [HttpPut("{id}")]
        //[ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> UpdateAppointment(Guid id, [FromBody]AppointmentModel appointment, [FromHeader(Name = "Authorization")]string value)
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

            var instance = await _repository.GetByIdAsync(id);

            try
            {

                instance.Update(appointment.AppointmentIntervalId, appointment.AppointmentDate, appointment.DoctorId, appointment.PatientId, appointment.HaveFeedback, appointment.HaveMedicalHistory);

                var status = await _repository.UpdateAsync(instance);
                if (!status)
                {
                    return BadRequest(new ApiResponse { Status = false });
                }
                return Ok(new ApiResponse { Status = true, Appointment = instance });
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // DELETE api/Appointments/5
        [HttpDelete("{id}")]
       // [ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> DeleteAppointment(Guid id, [FromHeader(Name = "Authorization")]string value)
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


        // DELETE api/Appointments
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