var ManagerViewModel = function () {
    var self = this;
    self.employees = ko.observableArray();
    self.managers = ko.observableArray();
    self.teamEmployees = ko.observableArray();
    self.daysOff = ko.observableArray();
    self.tasks = ko.observableArray();
    self.finishedTasks = ko.observableArray();
    self.error = ko.observable();
    self.name = ko.observable("");
    self.helper = ko.observableArray();

    //filtrowana lista managerów
    self.filteredManagers = ko.computed(function () {
        var filter = self.name().toLowerCase();
        if (!filter) {
            return self.managers();
        } else {
            return ko.utils.arrayFilter(self.managers(), function (item) {
                return item.Name.toLowerCase().indexOf(filter) !== -1;
            });
        }
    });

    //employees
    var employeesUri = '/api/employees';
    function getAllEmployees() {
        ajaxHelper(employeesUri, 'GET').done(function (data) {
            self.employees(data);
        });
    }
    self.getManagerTeam = function (item) {
        ajaxHelper(employeesUri + '?ManagerId=' + item.Id, 'GET').done(function (data) {
            self.teamEmployees(data);
            self.detailMan(item);
        });
    };

    //managers
    var managersUri = '/api/managers';
    self.detailMan = ko.observable();
    self.updatedManager = {
        Id: ko.observable(),
        Name: ko.observable()
    };
    self.updateManager = function () {
        console.log('Updating manager');

        var manager = {
            Id: self.detailMan().Id,
            Name: (self.updatedManager.Name() == undefined) ? self.detailMan().Name : self.updatedManager.Name()
        }
        ajaxHelper(managersUri + '/' + self.detailMan().Id, 'PUT', manager).done(function () {
            getAllManagers();
            self.getManager(self.detailMan());
            self.getManagerTeam(self.detailMan());
        });
    }

    self.getManager = function (item) {
        console.log('Getting manager');
        ajaxHelper(managersUri + '/' + item.Id, 'GET').done(function (data) {
            self.detailMan(data);
        })
    }
    function getAllManagers() {
        ajaxHelper(managersUri, 'GET').done(function (data) {
            self.managers(data);
        });
    }

    //tasks
    var tasksUri = '/api/tasks';
    self.detailTask = ko.observable();
    self.getManagerTasks = function (item) {
        console.log('Pobieranie zadań managera');
        ajaxHelper(tasksUri + '?ManagerId=' + item.Id, 'GET').done(function (data) {
            self.tasks(data);
            self.detailMan(item);
        });
    };
    function getAllTasks() {
        ajaxHelper(tasksUri, 'GET').done(function (data) {
            self.tasks(data);
        });
    }
    self.updatedTask = {
        Id: ko.observable(),
        Employee: ko.observable(),
        Manager: ko.observable(),
        StartDate: ko.observable(),
        EndDate: ko.observable(),
        Description: ko.observable(),
        Points: ko.observable()
    };
    self.setTask = function (item) {
        console.log('Getting task ', item.Id);
        ajaxHelper(tasksUri + '/' + item.Id, 'GET').done(function (data) {
            self.detailTask(data);
        });
    }
    self.updateTask = function () {
        console.log('Updating task');
        var task = {
            Id: self.detailTask().Id,
            EmployeeId: (self.updatedTask.Employee() == undefined) ?
             self.detailTask().Employee.Id : self.updatedTask.Employee().Id,
            ManagerId: (self.updatedTask.Manager() == undefined) ?
             self.detailTask().Manager.Id : self.updatedTask.Manager().Id,
            StartDate: (self.updatedTask.StartDate() == undefined) ?
             self.detailTask().StartDate : self.updatedTask.StartDate(),
            EndDate: (self.updatedTask.EndDate() == undefined) ?
              self.detailTask().EndDate : self.updatedTask.EndDate(),
            Description: (self.updatedTask.Description() == undefined) ?
              self.detailTask().Description : self.updatedTask.Description(),
            Points: (self.updatedTask.Points() == undefined) ?
              self.detailTask().Points : self.updatedTask.Points(),
            Status: (self.updatedTask.Status() == undefined) ?
              self.detailTask().Status : self.updatedTask.Status()
        };
        ajaxHelper(tasksUri + '/' + self.detailTask().Id, 'PUT', task).done(function (data) {
            self.getManagerTasks(self.detailMan());
        });
    };

    //daysoff
    var daysUri = '/api/dayoffs';
    self.newDayOff = {
        Date: ko.observable(),
        EmployeeId: ko.observable()
    };
    self.addManagerDayOff = function () {
        console.log('Adding day off');
        var dayOff = {
            Date: self.newDayOff.Date(),
            EmployeeId: self.detailMan().Id,
            isManager: true
        };
        ajaxHelper(daysUri, 'POST', dayOff);
    };
    self.getManagerDaysOff = function (item) {
        ajaxHelper(daysUri + '?EmployeeId=' + item.Id + '&isManager=true', 'GET').done(function (data) {
            self.daysOff(data);
            self.detailMan(item);
        });
    };
    function getAllDaysOff() {
        ajaxHelper(daysUri, 'GET').done(function (data) {
            self.daysOff(data);
        });
    }


    self.getManagerDetails = function (item) {
        self.getManagerDaysOff(item);
        self.getManagerTeam(item);
        self.getManagerTasks(item);
    };


    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        }).fail(function (jqXHR, textStatus, errorThrown) {
            self.error(errorThrown);
        });
    }

    // Fetch the initial data.
    getAllEmployees();
    getAllDaysOff();
    getAllTasks();
    getAllManagers();

};

ko.applyBindings(new ManagerViewModel());

