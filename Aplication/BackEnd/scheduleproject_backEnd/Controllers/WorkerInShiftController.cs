using Fair_Scheduling_Application_Server.Models;
using Fair_Scheduling_Application_Server.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Fair_Scheduling_Application_Server.Controllers
{
    public class WorkerInShiftController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody] WorkerInShift WorkerInShift)
        {
            Data_Services ds = new Data_Services();
            ds.AddWorkerToShift(WorkerInShift);
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public HttpResponseMessage Delete([FromBody] WorkerInShift WorkerInShift)
        {
            Data_Services ds = new Data_Services();
            return ds.DeleteWorkerInShift(WorkerInShift);
        }
    }
}