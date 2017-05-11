using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TeamViewer.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Points { get; set; }
        public List<DateTime> DaysOff { get; set; }

        public int ManagerId { get; set; }
        public Manager Manager { get; set; }

    }

    public class EmployeeDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class EmployeeDetailDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Points { get; set; }
        public List<DateTime> DaysOff { get; set; }
        public string ManagerName { get; set; }
    }

}