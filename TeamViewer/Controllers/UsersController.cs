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
            var user = from User u in db.Users
                       where u.username.StartsWith(username)
                       select u;


            return false;
        }
    }
}