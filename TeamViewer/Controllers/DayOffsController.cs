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
    public class DayOffsController : ApiController
    {
        private TeamViewerContext db = new TeamViewerContext();

        // GET: api/DayOffs
        public IQueryable<DayOff> GetDayOffs()
        {
            return db.DayOffs;
        }

        // GET: api/DayOffs/5
        [ResponseType(typeof(DayOff))]
        public async Task<IHttpActionResult> GetDayOff(int id)
        {
            DayOff dayOff = await db.DayOffs.FindAsync(id);
            if (dayOff == null)
            {
                return NotFound();
            }

            return Ok(dayOff);
        }

        [ResponseType(typeof(DayOff))]
        public async Task<IHttpActionResult> GetDaysOff(int employeeId, bool isManager)
        {
            var daysoff = await db.DayOffs.Include(e => e.Employee)
                .Where(e => e.EmployeeId == employeeId).Where(e => e.isManager == isManager).ToArrayAsync();

            if (daysoff == null)
            {
                return NotFound();
            }

            return Ok(daysoff);
        }

        // PUT: api/DayOffs/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutDayOff(int id, DayOff dayOff)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != dayOff.Id)
            {
                return BadRequest();
            }

            db.Entry(dayOff).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DayOffExists(id))
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

        // POST: api/DayOffs
        [ResponseType(typeof(DayOff))]
        public async Task<IHttpActionResult> PostDayOff(DayOff dayOff)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.DayOffs.Add(dayOff);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = dayOff.Id }, dayOff);
        }

        // DELETE: api/DayOffs/5
        [ResponseType(typeof(DayOff))]
        public async Task<IHttpActionResult> DeleteDayOff(int id)
        {
            DayOff dayOff = await db.DayOffs.FindAsync(id);
            if (dayOff == null)
            {
                return NotFound();
            }

            db.DayOffs.Remove(dayOff);
            await db.SaveChangesAsync();

            return Ok(dayOff);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DayOffExists(int id)
        {
            return db.DayOffs.Count(e => e.Id == id) > 0;
        }
    }
}