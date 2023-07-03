using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fair_Scheduling_Application_Server.Models
{
    public class WeeklyRequests
    {

        public int Worker_Id { get; set; }

        public string Worker_Name { get; set; }
        public string Worker_Email { get; set; }
        public DateTime date { get; set; }

        public string Type { get; set; }
        public int priorety { get; set; }
    }
}