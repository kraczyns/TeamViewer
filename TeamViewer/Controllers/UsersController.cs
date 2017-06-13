using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using TeamViewer.Infrastructure;
using TeamViewer.Models;

namespace TeamViewer.Controllers
{
    public class UsersController : ApiController
    {
        private TeamViewerContext db = new TeamViewerContext();

        [ResponseType(typeof(ApplicationUser))]
        public IQueryable<ApplicationUser> GetUsers()
        {
            return db.ApplicationUser;
        }

        // GET: api/Login
        public async Task<bool> Login(string username, string password)
        {
            var user = (from u in db.ApplicationUser
                        where u.UserName.Equals(username)
                        select u).Single();

            if (user != null && user.PasswordHash.Equals(password) == true)
                return true;

            return false;
        }

        // POST: api/Login
        [ResponseType(typeof(ApplicationUser))]
        public async Task<IHttpActionResult> Register(ApplicationUser user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            db.ApplicationUser.Add(user);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = user.Id }, user);
        }
    }
}