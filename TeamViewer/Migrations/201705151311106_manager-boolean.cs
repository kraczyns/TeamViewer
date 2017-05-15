namespace TeamViewer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class managerboolean : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.DayOffs", name: "ManagerId", newName: "Manager_Id");
            RenameIndex(table: "dbo.DayOffs", name: "IX_ManagerId", newName: "IX_Manager_Id");
            AddColumn("dbo.DayOffs", "isManager", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.DayOffs", "isManager");
            RenameIndex(table: "dbo.DayOffs", name: "IX_Manager_Id", newName: "IX_ManagerId");
            RenameColumn(table: "dbo.DayOffs", name: "Manager_Id", newName: "ManagerId");
        }
    }
}
