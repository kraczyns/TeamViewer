using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TeamViewer.Models
{
    public class Task
    {
        public int Id { get; set; }
        public int? ManagerId { get; set; }
        public int EmployeeId { get; set; }

        public Manager Manager { get; set; }
        public Employee Employee { get; set; }
    }
}