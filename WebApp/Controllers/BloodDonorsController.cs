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
using System.Linq.Expressions;

namespace WebApp.Apis
{
    [Produces("application/json")]
    [Route("api/BloodDonors")]
    public class BloodDonorsController : Controller
    {
        private readonly IEditableRepository<BloodDonor> _repository;


        public BloodDonorsController(IEditableRepository<BloodDonor> repository)
        {
            _repository = repository;
        }

        // GET api/BloodDonors
        [HttpGet]
        [NoCache]
        [ProducesResponseType(typeof(List<BloodDonor>), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> BloodDonors([FromHeader(Name = "Authorization")]string value)
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
                var bloodDonors = await _repository.GetAllAsync(includes);
                return Ok(bloodDonors);
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }


        // GET api/BloodDonors/page/name/10/10
        [HttpPut("page/{skip}/{take}")]
        [NoCache]
        [ProducesResponseType(typeof(List<BloodDonor>), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> BloodDonorsNamePage([FromBody]BloodDonorFilterModel filter, int skip, int take, [FromHeader(Name = "Authorization")]string value)
        {

            var token = new JwtSecurityTokenHandler().ReadJwtToken(value);
            var issuer = token.Claims.First(claim => claim.Type == "iss").Value;
            var audience = token.Claims.First(claim => claim.Type == "aud").Value;
            if (issuer != "MyIssuer" && audience != "MyAudience")
            {
                return Unauthorized();
            }

            try
            {
                string[] includes = { "Patient" };
                var pagingResult = await _repository.GetByFilter(FilterDelegate(filter.Type, filter.City), skip, take, includes);
                Response.Headers.Add("X-InlineCount", pagingResult.TotalRecords.ToString());
                return Ok(pagingResult.Records);
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }


        // GET api/BloodDonors/page/10/10
        [HttpGet("page/{skip}/{take}")]
        [NoCache]
        [ProducesResponseType(typeof(List<BloodDonor>), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> BloodDonorsPage(int skip, int take)
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

        // GET api/BloodDonors/5
        [HttpGet("{id}", Name = "GetBloodDonorRoute")]
        [NoCache]
        [ProducesResponseType(typeof(BloodDonor), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> BloodDonors(Guid id)
        {
            try
            {
                var bloodDonor = await _repository.GetByIdAsync(id);
                return Ok(bloodDonor);
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // POST api/BloodDonors
        [HttpPost]
        //[ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(ApiResponse), 201)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> CreateBloodDonor([FromBody]BloodDonorModel bloodDonor, [FromHeader(Name = "Authorization")]string value)
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

            var instance = BloodDonor.Create(bloodDonor.Type, bloodDonor.PatientId, bloodDonor.ApplyDate);

            try
            {
                var newBloodDonor = await _repository.AddAsync(instance);
                if (newBloodDonor == null)
                {
                    return BadRequest(new ApiResponse { Status = false });
                }
                return CreatedAtRoute("GetBloodDonorRoute", new { id = newBloodDonor.BloodDonorId },
                    new ApiResponse { Status = true, BloodDonor = newBloodDonor });
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // PUT api/BloodDonors/5
        [HttpPut("{id}")]
        //[ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> UpdateBloodDonor(Guid id, [FromBody]BloodDonorModel bloodDonor, [FromHeader(Name = "Authorization")]string value)
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

                instance.Update(bloodDonor.Type, bloodDonor.PatientId, bloodDonor.ApplyDate, bloodDonor.HaveDonated, bloodDonor.PatientConfirmed, bloodDonor.PendingPatientId);

                var status = await _repository.UpdateAsync(instance);
                if (!status)
                {
                    return BadRequest(new ApiResponse { Status = false });
                }
                return Ok(new ApiResponse { Status = true, BloodDonor = instance });
            }
            catch
            {
                return BadRequest(new ApiResponse { Status = false });
            }
        }

        // DELETE api/BloodDonors/5
        [HttpDelete("{id}")]
        //[ValidateAntiForgeryToken]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        [ProducesResponseType(typeof(ApiResponse), 400)]
        public async Task<ActionResult> DeleteBloodDonor(Guid id)
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

        // DELETE api/BloodDonors
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

        private static Expression<Func<BloodDonor, bool>> FilterDelegate(string type, string city)
        {
            if (type != "" && city != "")
                return x => x.Type.Contains(type) &&
                            x.Patient.City.Contains(city);


            if (type == "" && city != "")
                return x => x.Patient.City.Contains(city);

            if (type != "" && city == "")
                return x => x.Type.Contains(type);

            return x => x.Patient.City.Contains(city);

        }
    }
}