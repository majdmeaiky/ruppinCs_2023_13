using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fair_Scheduling_Application_Server.Models
{
    public class Shift
    {
        private int Shift_Id { get; set; }
        private string Type { get; set; }
        private TimeSpan Start_Hour { get; set; }
        private TimeSpan End_Hour { get; set; }
        private int Worker_Id { get; set; }
        private DateTime Shift_date { get; set; }
        private Worker Worker { get; set; }
        private string Company_Name { get; set; }
    }
}