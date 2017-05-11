using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Mvc;
using TeamViewer.Models;

namespace TeamViewer.Controllers
{
    public class EmployeesController : ApiController
    {
        private TeamViewerContext db = new TeamViewerContext();

        // GET: api/Employees
        //Zwraca listę wszystkich pracowników z bazy danych
        public IQueryable<Employee> GetEmployees()
        {
          /*  var employees = from e in db.Employees
                            select new EmployeeDTO()
                            {
                                Id = e.Id,
                                Name = e.Name
                            };*/
            return db.Employees.Include(e=>e.Manager);
        }
        
        // GET: api/Employees/5
        //Zwraca konkretnego pracownika i informację o nim
        [ResponseType(typeof(Employee))]
        public async Task<IHttpActionResult> GetEmployee(int id)
        {
            Employee employee = await db.Employees.Include(e => e.Manager).
                SingleOrDefaultAsync(e => e.Id == id);

            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);

        }

        // GET: api/Employees?ManagerId=5
        //Zwraca listę pracowników przypisanych do danego managera
        [ResponseType(typeof(Employee))]
        public async Task<IHttpActionResult> GetTeam(int managerId)
        {
            var employees = await db.Employees.Include(e => e.Manager)
                .Where(e => e.ManagerId == managerId).ToArrayAsync();

            if (employees == null)
            {
                return NotFound();
            }

            return Ok(employees);

        }
        /*
        // PUT: api/Employees/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutEmployee(int id, Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != employee.Id)
            {
                return BadRequest();
            }

            db.Entry(employee).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
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

        // POST: api/Employees
        [ResponseType(typeof(Employee))]
        public async Task<IHttpActionResult> PostEmployee(Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Employees.Add(employee);
            await db.SaveChangesAsync();

            db.Entry(employee).Reference(x => x.Manager).Load();

            var dto = new EmployeeDTO()
            {
                Id = employee.Id,
                Name = employee.Name,
                ManagerName = employee.Name
            };
            return CreatedAtRoute("DefaultApi", new { id = employee.Id }, dto);
        }

        // DELETE: api/Employees/5
        [ResponseType(typeof(Employee))]
        public async Task<IHttpActionResult> DeleteEmployee(int id)
        {
            Employee employee = await db.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            db.Employees.Remove(employee);
            await db.SaveChangesAsync();

            return Ok(employee);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EmployeeExists(int id)
        {
            return db.Employees.Count(e => e.Id == id) > 0;
        }*/
    }
    
}