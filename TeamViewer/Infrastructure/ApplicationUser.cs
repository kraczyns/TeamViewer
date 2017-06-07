using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace TeamViewer.Infrastructure
{
    public class User : IdentityUser
    {
        [Required]
        [MaxLength(100)]
        public string username { get; set; }

        [Required]
        [MaxLength(100)]
        public string password { get; set; }

        [Required]
        public int id { get; set; }

    }
}