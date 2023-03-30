using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fair_Scheduling_Application_Server.Models
{
    public class WorkerInShift
    {
        //workerInShift
        public WorkerInShift(int worker_Id, string company_Name, int shift_Id)
        {
            Worker_Id = worker_Id;
            Company_Name = company_Name;
            Shift_Id = shift_Id;

        }
      

        public int Worker_Id { get; set; }
        public string Company_Name { get; set; }
        public int Shift_Id { get; set; }

    }
}