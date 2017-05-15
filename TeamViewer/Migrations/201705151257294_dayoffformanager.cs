namespace TeamViewer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class dayoffformanager : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.DayOffs", "ManagerId", c => c.Int());
            CreateIndex("dbo.DayOffs", "ManagerId");
            AddForeignKey("dbo.DayOffs", "ManagerId", "dbo.Managers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.DayOffs", "ManagerId", "dbo.Managers");
            DropIndex("dbo.DayOffs", new[] { "ManagerId" });
            DropColumn("dbo.DayOffs", "ManagerId");
        }
    }
}
