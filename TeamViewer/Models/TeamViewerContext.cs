using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using TeamViewer.Infrastructure;

namespace TeamViewer.Models
{
    public class TeamViewerContext : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx
    
        public TeamViewerContext() : base("name=TeamViewerAzure")
        {
            this.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
        }

        public System.Data.Entity.DbSet<TeamViewer.Models.Manager> Managers { get; set; }

        public System.Data.Entity.DbSet<TeamViewer.Models.Employee> Employees { get; set; }

        public System.Data.Entity.DbSet<TeamViewer.Models.DayOff> DayOffs { get; set; }

        public System.Data.Entity.DbSet<TeamViewer.Models.Task> Tasks { get; set; }

        public System.Data.Entity.DbSet<ApplicationUser> ApplicationUser { get; set; }
    }
}
