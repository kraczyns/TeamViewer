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
using TeamViewer.Models;

namespace TeamViewer.Controllers
{
    public class UsersController : ApiController
    {
        private TeamViewerContext db = new TeamViewerContext();

        [ResponseType(typeof(User))]
        public IQueryable<User> GetUsers()
        {
            return db.Users;
        }

        public async Task<bool> Login(string username, string password)
        {
            var user = (from u in db.Users
                        where u.username.Equals(username)
                        select u).Single();

            if (user != null && user.password.Equals(password) == true)
                return true;

            return false;
        }

        [ResponseType(typeof(User))]
        public async Task<IHttpActionResult> Register(string username, string password)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new User();
            user.username = username;
            user.password = password;

            db.Users.Add(user);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = user.Id }, user);
        }
    }
}