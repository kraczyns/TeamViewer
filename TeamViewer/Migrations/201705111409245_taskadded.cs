namespace TeamViewer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class taskadded : DbMigration
    {
        public override void Up()
        {
            DropTable("dbo.EmployeeDTOes");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.EmployeeDTOes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
    }
}
