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
