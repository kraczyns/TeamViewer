﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TeamViewer.Controllers
{
    public class TasksViewController : Controller
    {
        // GET: TasksView
        public ActionResult List()
        {
            return View();
        }
    }
}