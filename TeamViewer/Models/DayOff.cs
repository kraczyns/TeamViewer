using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TeamViewer.Models
{
    public class DayOff
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int EmployeeId { get; set; }
        public Boolean isManager { get; set; }

        public Employee Employee { get; set; }
        public Manager Manager { get; set; }
    }
}