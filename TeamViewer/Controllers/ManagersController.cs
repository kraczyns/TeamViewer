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
    public class ManagersController : ApiController
    {
        private TeamViewerContext db = new TeamViewerContext();

        // GET: api/Managers
        public IQueryable<Manager> GetManagers()
        {
            return db.Managers;
        }

        // GET: api/Managers/5
        [ResponseType(typeof(Manager))]
        public async Task<IHttpActionResult> GetManager(int id)
        {
            Manager manager = await db.Managers.FindAsync(id);
            if (manager == null)
            {
                return NotFound();
            }

            return Ok(manager);
        }

        // PUT: api/Managers/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutManager(int id, Manager manager)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != manager.Id)
            {
                return BadRequest();
            }

            db.Entry(manager).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ManagerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Managers
        [ResponseType(typeof(Manager))]
        public async Task<IHttpActionResult> PostManager(Manager manager)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Managers.Add(manager);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = manager.Id }, manager);
        }

        // DELETE: api/Managers/5
        [ResponseType(typeof(Manager))]
        public async Task<IHttpActionResult> DeleteManager(int id)
        {
            Manager manager = await db.Managers.FindAsync(id);
            if (manager == null)
            {
                return NotFound();
            }

            db.Managers.Remove(manager);
            await db.SaveChangesAsync();

            return Ok(manager);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ManagerExists(int id)
        {
            return db.Managers.Count(e => e.Id == id) > 0;
        }
    }
}