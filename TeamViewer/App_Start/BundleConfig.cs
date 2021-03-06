﻿using System.Web;
using System.Web.Optimization;

namespace TeamViewer
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                      "~/Scripts/knockout-{version}.js",
             "~/Scripts/moment.js",
             "~/Scripts/app.js"));
            bundles.Add(new ScriptBundle("~/bundles/task").Include(
             "~/Scripts/knockout-{version}.js",
             "~/Scripts/moment.js",
             "~/Scripts/task.js"));

            bundles.Add(new ScriptBundle("~/bundles/employee").Include(
            "~/Scripts/knockout-{version}.js",
            "~/Scripts/moment.js",
            "~/Scripts/employee.js"));

            bundles.Add(new ScriptBundle("~/bundles/manager").Include(
            "~/Scripts/knockout-{version}.js",
            "~/Scripts/moment.js",
            "~/Scripts/manager.js"));

            bundles.Add(new ScriptBundle("~/bundles/admin").Include(
            "~/Scripts/knockout-{version}.js",
            "~/Scripts/moment.js",
            "~/Scripts/admin.js"));

            bundles.Add(new ScriptBundle("~/bundles/stats").Include(
"~/Scripts/knockout-{version}.js",
"~/Scripts/moment.js",
"~/Scripts/stats.js",
"~/Scripts/Chart.js",
"~/Scripts/Chart.min.js",
"~/Scripts/knockout.chart.js"));
        }
    }
}
