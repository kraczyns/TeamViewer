namespace TeamViewer.Migrations
{
    using Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<TeamViewer.Models.TeamViewerContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(TeamViewer.Models.TeamViewerContext context)
        {
            context.DayOffs.AddOrUpdate(d => d.Id,
                new DayOff() { Id = 1, Date = new DateTime(2017,5,28), EmployeeId = 1 },
                new DayOff() { Id = 2, Date = new DateTime(2017, 5, 29), EmployeeId = 1 }
                );
            context.Tasks.AddOrUpdate(t => t.Id,
                new Task()
                {
                    Id = 1,
                    EmployeeId = 1,
                    StartDate = new DateTime(2017, 5, 3),
                    EndDate = new DateTime(2017, 5, 29),
                    Description = "swierszczyk",
                    Points = 99,
                    Status = Statuses.Nowe
                },
                new Task()
                {
                    Id = 2,
                    EmployeeId = 1,
                    StartDate = new DateTime(2017, 1, 3),
                    EndDate = new DateTime(2017, 6, 29),
                    Description = "ala ma kota",
                    Points = 13,
                    Status = Statuses.Zamkniete
                });
            context.Managers.AddOrUpdate(m => m.Id,
                new Manager() { Id = 1, Name = "Manager1" },
                new Manager() { Id = 2, Name = "Manager2" }
                );
            context.Employees.AddOrUpdate(e => e.Id,
                new Employee() { Id = 1, Name = "Pracownik1", Points = 1, ManagerId = 1 },
                new Employee() { Id = 2, Name = "Pracownik2", Points = 1, ManagerId = 1 },
                new Employee() { Id = 3, Name = "Pracownik3", Points = 1, ManagerId = 1 },
                new Employee() { Id = 4, Name = "Pracownik4", Points = 1, ManagerId = 2 },
                new Employee() { Id = 5, Name = "Pracownik5", Points = 1, ManagerId = 2 },
                new Employee() { Id = 6, Name = "Pracownik6", Points = 1, ManagerId = 2 }
                );

        }
    }
}
