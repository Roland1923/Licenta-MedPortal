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
using WebApp.Common;

namespace WebApp.Apis
{
    [Produces("application/json")]
    [Route("api/PatientHistories")]
    public class PatientHistoriesController : Controller
    {
        private readonly IEditableRepository<PatientHistory> _repository;


        public PatientHistoriesController(IEditableRepository<PatientHistory> repository)
        {
            _repository = repository;
        }

        // GET api/PatientHistorys
        [HttpGet]
        [NoCache]
        [ProducesResponseType(typeof(List<PatientHistory>), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> PatientHistories([FromHeader(Name = "Authorization")]string value)
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
                string[] includes = { "Patient" };
                var patientHistories = await _repository.GetAllAsync(includes);
                return Ok(patientHistories);
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }



        // GET api/PatientHistories/page/10/10
        [HttpGet("page/{skip}/{take}")]
        [NoCache]
        [ProducesResponseType(typeof(List<PatientHistory>), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> PatientHistoriesPage(int skip, int take)
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

        // GET api/PatientHistorys/5
        [HttpGet("{id}", Name = "GetPatientHistoryRoute")]
        [NoCache]
        [ProducesResponseType(typeof(PatientHistory), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> PatientHistories(Guid id)
        {
            try
            {
                var patientHistory = await _repository.GetByIdAsync(id);
                return Ok(patientHistory);
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // POST api/PatientHistorys
        [HttpPost]
        //[ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(ApiResponse), 201)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> CreatePatientHistory([FromBody]PatientHistoryModel patientHistory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var instance = PatientHistory.Create(patientHistory.PatientId);

            try
            {
                var newPatientHistory = await _repository.AddAsync(instance);
                if (newPatientHistory == null)
                {
                    return BadRequest(new ApiResponse { Status = false });
                }
                return CreatedAtRoute("GetPatientHistoryRoute", new { id = newPatientHistory.HistoryId },
                    new ApiResponse { Status = true, PatientHistory = newPatientHistory });
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // PUT api/PatientHistories/5
        [HttpPut("{id}")]
        //[ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> UpdatePatientHistory(Guid id, [FromBody]PatientHistoryModel patientHistory, [FromHeader(Name = "Authorization")]string value)
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

                instance.Update(patientHistory.Smoke, patientHistory.Drink, patientHistory.Gender, patientHistory.Weight, patientHistory.Height,
                    patientHistory.HealthConditions, patientHistory.Allergies, patientHistory.Consultations, patientHistory.LastVisit);

                var status = await _repository.UpdateAsync(instance);
                if (!status)
                {
                    return BadRequest(new ApiResponse { Status = false });
                }
                return Ok(new ApiResponse { Status = true, PatientHistory = instance });
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // DELETE api/PatientHistories/5
        [HttpDelete("{id}")]
        //[ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> DeletePatientHistory(Guid id)
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

        // DELETE api/PatientHistories
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