using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fair_Scheduling_Application_Server.Models
{
    public class Request
    {
        public int Request_Id { get; set; }
        public int priorety { get; set; }
        public int Shift_Id { get; set; }
        public int Worker_Id { get; set; }
        public string Company_Name { get; set; }

        public Shift Shift { get; set; }
        public Worker Worker { get; set; }
    }
}