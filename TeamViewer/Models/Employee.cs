﻿using System;
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

        public int ManagerId { get; set; }
        public Manager Manager { get; set; }

    }

}