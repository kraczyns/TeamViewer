namespace TeamViewer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class taskaddeddb : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.DayOffs",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Date = c.DateTime(nullable: false),
                        EmployeeId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Employees", t => t.EmployeeId, cascadeDelete: true)
                .Index(t => t.EmployeeId);
            
            CreateTable(
                "dbo.Tasks",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ManagerId = c.Int(),
                        EmployeeId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Employees", t => t.EmployeeId, cascadeDelete: true)
                .ForeignKey("dbo.Managers", t => t.ManagerId)
                .Index(t => t.ManagerId)
                .Index(t => t.EmployeeId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Tasks", "ManagerId", "dbo.Managers");
            DropForeignKey("dbo.Tasks", "EmployeeId", "dbo.Employees");
            DropForeignKey("dbo.DayOffs", "EmployeeId", "dbo.Employees");
            DropIndex("dbo.Tasks", new[] { "EmployeeId" });
            DropIndex("dbo.Tasks", new[] { "ManagerId" });
            DropIndex("dbo.DayOffs", new[] { "EmployeeId" });
            DropTable("dbo.Tasks");
            DropTable("dbo.DayOffs");
        }
    }
}
