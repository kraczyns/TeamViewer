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
    public class TasksController : ApiController
    {
        private TeamViewerContext db = new TeamViewerContext();

        // GET: api/Tasks
        public IQueryable<Models.Task> GetTasks()
        {
            return db.Tasks;
        }

        // GET: api/Tasks/5
        [ResponseType(typeof(Models.Task))]
        public async Task<IHttpActionResult> GetTask(int id)
        {
            Models.Task task = await db.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        [ResponseType(typeof(Models.Task))]
        public async Task<IHttpActionResult> GetInProgressTasks(int employeeId)
        {
            var tasks = await db.Tasks.Include(e => e.Employee).Include(e => e.Manager)
                .Where(e => e.EmployeeId == employeeId).Where(e => e.Status != Statuses.Zrobione).Where(e => e.Status != Statuses.Zamkniete).ToArrayAsync();

            if (tasks == null)
            {
                return NotFound();
            }

            return Ok(tasks);
        }

        [ResponseType(typeof(Models.Task))]
        public async Task<IHttpActionResult> GetInProgressManagerTasks(int managerId)
        {
            var tasks = await db.Tasks.Include(e => e.Manager).Include(e => e.Employee)
                .Where(e => e.ManagerId == managerId).Where(e => e.Status != Statuses.Zrobione).Where(e => e.Status != Statuses.Zamkniete).ToArrayAsync();

            if (tasks == null)
            {
                return NotFound();
            }

            return Ok(tasks);
        }

        [ResponseType(typeof(Models.Task))]
        public async Task<IHttpActionResult> GetTasksByStatusAndManager(Statuses status, int managerId)
        {
            var tasks = await db.Tasks.Include(t => t.Manager).Include(t => t.Employee).
                Where(t => t.ManagerId == managerId).Where(t => t.Status == status).ToArrayAsync();

            return Ok(tasks);
        }

        [ResponseType(typeof(Models.Task))]
        public async Task<IHttpActionResult> GetTasksByStatusAndEmployee(Statuses status, int employeeId)
        {
            var tasks = await db.Tasks.Include(t => t.Manager).Include(t => t.Employee).
                Where(t => t.EmployeeId == employeeId).Where(t => t.Status == status).ToArrayAsync();

            return Ok(tasks);
        }

        // PUT: api/Tasks/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutTask(int id, Models.Task task)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != task.Id)
            {
                return BadRequest();
            }

            db.Entry(task).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskExists(id))
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

        // POST: api/Tasks
        [ResponseType(typeof(Models.Task))]
        public async Task<IHttpActionResult> PostTask(Models.Task task)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Tasks.Add(task);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = task.Id }, task);
        }

        // DELETE: api/Tasks/5
        [ResponseType(typeof(Models.Task))]
        public async Task<IHttpActionResult> DeleteTask(int id)
        {
            Models.Task task = await db.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            db.Tasks.Remove(task);
            await db.SaveChangesAsync();

            return Ok(task);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TaskExists(int id)
        {
            return db.Tasks.Count(e => e.Id == id) > 0;
        }
    }
}