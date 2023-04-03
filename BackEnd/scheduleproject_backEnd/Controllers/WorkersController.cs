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
    public class WorkersController : ApiController
    {
        // GET api/<controller>
        [EnableCors("*", "*", "*")]
        //Get all workers of company
        public IEnumerable<Worker> Get(string Company_Code)
        {
            Data_Services ds = new Data_Services();
            List<Worker> workers = ds.all_Workers(Company_Code);
            return workers;
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }


        // POST api/<controller>
        [EnableCors("*", "*", "*")]
        //Validate login
        public Worker Post([FromBody] Worker worker)
        {
            Data_Services ds = new Data_Services();
            Worker worker_result = ds.user_login(worker);
            return worker_result;
        }

        // POST api/<controller>/CreateWorker
        [EnableCors("*", "*", "*")]

        [Route("api/Workers/AddWorker")]
        [HttpPost]
        //Create ne worker
        public HttpResponseMessage AddWorker([FromBody] Worker worker)
        {
            Data_Services ds = new Data_Services();
            return ds.AddWorker(worker);
        }

        // PUT api/<controller>/5
        //edit worker
        public HttpResponseMessage Put([FromBody] Worker worker)
        {
            Data_Services ds = new Data_Services();
            return ds.UpdateWorker(worker);
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
        [EnableCors("*", "*", "*")]

        [HttpDelete]
        //Delete worker
        public HttpResponseMessage DeleteWorker(int Worker_Id, string Company_Code)
        {
            Data_Services ds = new Data_Services();
            return ds.DeleteWorker(Worker_Id, Company_Code);
            
        }
    }
}