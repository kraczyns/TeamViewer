using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TeamViewer.Controllers
{
    public class ViewController : Controller
    {
        // GET: EmployeesView
        public ActionResult EmployeeList()
        {
            return View();
        }

        public ActionResult Administrator()
        {
            return View();
        }

        public ActionResult ManagerList()
        {
            return View();
        }

        public ActionResult Stats()
        {
            return View();
        }

        public ActionResult TaskList()
        {
            return View();
        }

        public ActionResult Login()
        {
            return View();
        }
    }
}