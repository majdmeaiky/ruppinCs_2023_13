using Fair_Scheduling_Application_Server.Models;
using Fair_Scheduling_Application_Server.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Fair_Scheduling_Application_Server.Controllers
{
    public class ScheduleController : ApiController
    {
        // GET api/<controller>
        [EnableCors("*", "*", "*")]
        //Get weekly schedule
        public Dictionary<string, Dictionary<string, List<Worker>>> Get(string Company_Code, int week_counter)
        {
            Data_Services ds = new Data_Services();
            Dictionary<string, Dictionary<string,List< Worker>>> weekly_schedule = ds.WeekliShift(Company_Code, week_counter);
            return weekly_schedule;
        }

        [EnableCors("*", "*", "*")]
        [Route("api/Schedule/CreateSchedule")]
        [HttpGet]
        //create new schedule
        public List<WorkerInShift> CreateSchedule(string Company_Code,int WeeklyCounter)
        {
            Data_Services ds = new Data_Services();
            return ds.CreateSchedule(Company_Code, WeeklyCounter);
        }
        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}