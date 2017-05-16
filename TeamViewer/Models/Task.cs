using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace TeamViewer.Models
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum Statuses
    {
        Nowe,
        DoZrobienia,
        Wtrakcie,
        Zrobione,
        Zamkniete
    };
    public class Task
    {
        public int Id { get; set; }
        public int? ManagerId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Description { get; set; }
        public int Points { get; set; }
        public Statuses Status { get; set; }

        public Manager Manager { get; set; }
        public Employee Employee { get; set; }
    }
}