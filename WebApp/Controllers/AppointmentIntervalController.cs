using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Core.Entities;
using Core.IRepositories;
using Infrastructure.Attributes;
using WebApp.Models;
using System.Linq.Expressions;
using System.Linq;
using System.IdentityModel.Tokens.Jwt;

namespace WebApp.Apis
{
    [Produces("application/json")]
    [Route("api/AppointmentIntervals")]
    public class AppointmentIntervalController : Controller
    {
        private readonly IEditableRepository<AppointmentInterval> _repository;

        public AppointmentIntervalController(IEditableRepository<AppointmentInterval> repository)
        {
            _repository = repository;
        }

        // GET api/AppointmentIntervals
        [HttpGet]
        [NoCache]
        [ProducesResponseType(typeof(List<AppointmentInterval>), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> AppointmentIntervals([FromHeader(Name = "Authorization")]string value)
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
                string[] includes = { "Appointments" };
                var appointmentIntervals = await _repository.GetAllAsync(includes);
                return Ok(appointmentIntervals);
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }





        // GET api/AppointmentIntervals/doctorId
        [HttpGet("{doctorId}")]
        [NoCache]
        [ProducesResponseType(typeof(List<AppointmentInterval>), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> AppointmentIntervalsByDoctor(Guid doctorId, [FromHeader(Name = "Authorization")]string value)
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
                string[] includes = { };
                var appointmentIntervals = await _repository.GetByConditionsAsync(FilterDelegate(doctorId, -1), includes);
                return Ok(appointmentIntervals);
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // GET api/AppointmentIntervals/doctorId/day
        [HttpGet("{doctorId}/{day}")]
        [NoCache]
        [ProducesResponseType(typeof(List<AppointmentInterval>), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> AppointmentIntervalsByDoctorAndDay(Guid doctorId, int day)
        {
            try
            {
                string[] includes = { "Appointments" };
                var appointmentIntervals = await _repository.GetByConditionsAsync(FilterDelegate(doctorId, day), includes);
                return Ok(appointmentIntervals);
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }


        // GET api/AppointmentIntervals/5
        [HttpGet("{id}", Name = "GetAppointmentIntervalRoute")]
        [NoCache]
        [ProducesResponseType(typeof(AppointmentInterval), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> AppointmentIntervals(Guid id)
        {
            try
            {
                var appointmentInterval = await _repository.GetByIdAsync(id);
                return Ok(appointmentInterval);
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        //POST api/AppointmentIntervals
        [HttpPost]
        //[ValidateAntiForgeryToken]
        //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [ProducesResponseType(typeof(ApiResponse), 201)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> CreateAppointmentInterval([FromBody]AppointmentIntervalModel appointmentInterval, [FromHeader(Name = "Authorization")]string value)
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

            var instance = AppointmentInterval.Create(appointmentInterval.Day, appointmentInterval.StartHour, appointmentInterval.EndHour, appointmentInterval.DoctorId);

            try
            {
                var newAppointmentInterval = await _repository.AddAsync(instance);
                if (newAppointmentInterval == null)
                {
                    return BadRequest(new ApiResponse { Status = false });
                }
                return CreatedAtRoute("GetAppointmentIntervalRoute", new { id = newAppointmentInterval.AppointmentIntervalId },
                    new ApiResponse { Status = true, AppointmentInterval = newAppointmentInterval });
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // PUT api/AppointmentIntervals/5
        [HttpPut("{id}")]
        //[ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> UpdateAppointmentInterval(Guid id, [FromBody]AppointmentIntervalModel appointmentInterval)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var instance = await _repository.GetByIdAsync(id);

            try
            {

                instance.Update(appointmentInterval.Day, appointmentInterval.StartHour, appointmentInterval.EndHour, appointmentInterval.DoctorId);

                var status = await _repository.UpdateAsync(instance);
                if (!status)
                {
                    return BadRequest(new ApiResponse { Status = false });
                }
                return Ok(new ApiResponse { Status = true, AppointmentInterval = instance });
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // DELETE api/AppointmentIntervals/5
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


        private static Expression<Func<AppointmentInterval, bool>> FilterDelegate(Guid doctorId, int day)
        {
            if(day==-1)
            {
                return x => (x.DoctorId.CompareTo(doctorId) == 0);
            }
            else
            {
                return x => (x.DoctorId.CompareTo(doctorId) == 0) && x.Day == day;
            }
        }

    }
}