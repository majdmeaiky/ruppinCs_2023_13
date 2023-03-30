using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Fair_Scheduling_Application_Server.Models
{
    public class Worker
    {
        public int Worker_Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public DateTime Start_Date { get; set; }
        public bool Is_Manager { get; set; }
        public string Company_Code { get; set; }
        public string Company_Name { get; set; }
        public int Shift_Id { get; set; }

        public string Image { get; set; }
        public string GetDayOfWeek(DateTime date)
        {
            // Use the DayOfWeek property to get the day of the week as an enum value
            DayOfWeek dayOfWeek = date.DayOfWeek;

            // Use a switch statement to return the day of the week as a string
            switch (dayOfWeek)
            {
                case DayOfWeek.Sunday:
                    return "0";
                case DayOfWeek.Monday:
                    return "1";
                case DayOfWeek.Tuesday:
                    return "2";
                case DayOfWeek.Wednesday:
                    return "3";
                case DayOfWeek.Thursday:
                    return "4";
                case DayOfWeek.Friday:
                    return "5";
                case DayOfWeek.Saturday:
                    return "6";
                default:
                    throw new ArgumentException("Invalid day of week.");
            }
        }
    }
}