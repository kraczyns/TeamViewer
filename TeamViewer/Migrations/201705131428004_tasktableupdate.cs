namespace TeamViewer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tasktableupdate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Tasks", "StartDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Tasks", "EndDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Tasks", "Description", c => c.String());
            AddColumn("dbo.Tasks", "Points", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Tasks", "Points");
            DropColumn("dbo.Tasks", "Description");
            DropColumn("dbo.Tasks", "EndDate");
            DropColumn("dbo.Tasks", "StartDate");
        }
    }
}
