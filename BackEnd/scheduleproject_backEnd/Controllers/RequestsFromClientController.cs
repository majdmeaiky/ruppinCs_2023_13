using Fair_Scheduling_Application_Server.Models;
using Fair_Scheduling_Application_Server.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Mvc;

namespace Fair_Scheduling_Application_Server.Controllers
{
    public class RequestsFromClientController : ApiController
    {
       

        // GET api/<controller>/5
        [EnableCors("*", "*", "*")]
        //Get Weekly requests of specific worker
        public List<WorkerRequestsFromClient> Get(int Worker_ID,string Company_Name,int WeeklyCounter)
        {
            Data_Services ds = new Data_Services();
            return ds.GetEmployRequests(Worker_ID, Company_Name, WeeklyCounter);
        }

        // GET api/<controller>
        [EnableCors("*", "*", "*")]
        [System.Web.Http.Route("api/RequestsFromClient/WeeklyRequests")]
        [System.Web.Http.HttpGet]
        //Get Weekly requests for a company
        public List<WeeklyRequests> WeeklyRequests(string Company_Name, int Weekly_Counter)
        {
            Data_Services ds = new Data_Services();
            return ds.GETWeeklyRequests(Company_Name, Weekly_Counter);
            
        }

        [EnableCors("*", "*", "*")]
        //Post requests of specific worker
        public HttpResponseMessage ProcessWorkerRequests([FromBody] List<WorkerRequestsFromClient> workerRequests)
        {
            Data_Services ds = new Data_Services();
            return ds.PostEmployRequests(workerRequests);
           
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