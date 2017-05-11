namespace TeamViewer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class newemployeedto : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Employees", "Points", c => c.Int(nullable: false));
            DropColumn("dbo.EmployeeDTOes", "ManagerName");
        }
        
        public override void Down()
        {
            AddColumn("dbo.EmployeeDTOes", "ManagerName", c => c.String());
            DropColumn("dbo.Employees", "Points");
        }
    }
}
