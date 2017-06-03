using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace TeamViewer.Models
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum Statuses
    {
        [Display(Name = "Nowe"), EnumMember(Value = "Nowe")]
        Nowe,
        [Display(Name = "Do Zrobienia"), EnumMember(Value = "Do Zrobienia")]
        DoZrobienia,
        [Display(Name = "W trakcie"), EnumMember(Value = "W trakcie")]
        Wtrakcie,
        [Display(Name = "Zrobione"), EnumMember(Value = "Zrobione")]
        Zrobione,
        [Display(Name = "Zamknięte"), EnumMember(Value = "Zamknięte")]
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
        [JsonConverter(typeof(StringEnumConverter))]
        public Statuses Status { get; set; }

        public Manager Manager { get; set; }
        public Employee Employee { get; set; }
    }
}