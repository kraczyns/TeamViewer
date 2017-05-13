using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TeamViewer.Controllers
{
    public class EmployeesViewController : Controller
    {
        // GET: EmployeesView
        public ActionResult List()
        {
            return View();
        }

        public ActionResult Points()
        {
            return View();
        }
    }
}