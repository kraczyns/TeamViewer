var ViewModel = function () {
    var self = this;
    self.employees = ko.observableArray();
    self.managers = ko.observableArray();
    self.teamEmployees = ko.observableArray();
    self.daysOff = ko.observableArray();
    self.tasks = ko.observableArray();
    self._tasks = ko.observableArray();
    self._days = ko.observableArray();
    self.error = ko.observable();
    self.query = ko.observable("");
    self.name = ko.observable("");
    self.manager = ko.observable("");
    self.countDone = ko.observable("2");
    self.filteredManagers = ko.computed(function () {
        console.log('filteredManager');
        var filter = self.name().toLowerCase();
        if (!filter) {
            return self.managers();
        } else {
            return ko.utils.arrayFilter(self.managers(), function (item) {
                return item.Name.toLowerCase().indexOf(filter) !== -1;
            });
        }
    });
    self.filteredEmployees = ko.computed(function () {
        var filterSearch = self.query().toLowerCase();
        var filterManager = self.manager().toLowerCase();
        var filteredManager = self.employees();
        var filteredSearch = self.employees();

        if (filterSearch && !filterManager){
            return ko.utils.arrayFilter(filteredManager, function (item) {
                filteredSearch = item.Name.toLowerCase().indexOf(filterSearch) !== -1;
                return filteredSearch;
            });
        } else if (!filterManager && !filterSearch) {
            return self.employees();
        } else if (filterManager && !filterSearch) {
            return ko.utils.arrayFilter(filteredSearch, function (item) {
                filteredManager = item.Manager.Name.toLowerCase().indexOf(filterManager) !== -1;
                return filteredManager;
            });
        } else if (filterManager && filterSearch) {
            return ko.utils.arrayFilter(self.employees(), function (item) {
                return item.Manager.Name.toLowerCase().indexOf(filterManager) !== -1 && item.Name.toLowerCase().indexOf(filterSearch) !== -1;
            });
        }
    });
    self.filteredTasks = ko.computed(function () {
        var filterSearch = self.query().toLowerCase();
        var filteredSearch = self._tasks();

        if (filterSearch) {
            return ko.utils.arrayFilter(filteredSearch, function (item) {
                filteredSearch = item.Description.toLowerCase().indexOf(filterSearch) !== -1;
                return filteredSearch;
            });
        }

        return filteredSearch;
    });

    var employeesUri = '/api/employees';
    var daysUri = '/api/dayoffs';
    var tasksUri = '/api/tasks';
    var managersUri = '/api/managers';

    self.detail = ko.observable();
    self.detailMan = ko.observable();

    self.updatedManager = {
        Id: ko.observable(),
        Name: ko.observable()
    };

    self.employee = {
        Id: ko.observable(), 
        Name : ko.observable(), 
        Points: ko.observable(),
        Manager: ko.observable(),
        time : ko.observable(),
        team : ko.observable(),
        quality : ko.observable()
    };
    self.updatedEmployee = {
        Id: ko.observable(),
        Name: ko.observable(),
        Points: ko.observable(),
        Manager: ko.observable()
    };
    self.newDayOff = {
        Date: ko.observable(),
        EmployeeId: ko.observable()
    };
    self.addDayOff = function () {
        console.log('Adding day off');
        var dayOff = {
            Date: self.newDayOff.Date(),
            EmployeeId: self.detail().Id,
            isManager: false
        };
        ajaxHelper(daysUri, 'POST', dayOff);
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
    self.newEmployee = {
        Id: ko.observable(),
        Manager: ko.observable(),
        Name: ko.observable()
    };
    self.newManager = {
        Id: ko.observable(),
        Name: ko.observable()
    }

    self.updateManager = function () {
        console.log('Updating manager');
        var manager = {
            Id: self.detailMan().Id,
            Name: self.updatedManager.Name()
        }
        ajaxHelper(managersUri + '/' + self.detailMan().Id, 'PUT', manager);
    }

    self.addEmployee = function () {
        console.log('Adding employee');
        var employee = {
            ManagerId: self.newEmployee.Manager().Id,
            Name: self.newEmployee.Name()
        };
        ajaxHelper(employeesUri, 'POST', employee);
    };
    self.addManager = function () {
        console.log('Adding manager');
        var manager = {
            Name: self.newManager.Name()
        };
        ajaxHelper(managersUri, 'POST', manager);
    };
    self.deleteEmployee = function () {
        console.log('Usuwanie pracownika');
        ajaxHelper(employeesUri + '/' + self.detail().Id, 'DELETE');
    }
    self.deleteManager = function () {
        console.log('Usuwanie managera');
        ajaxHelper(managersUri + '/' + self.detailMan().Id, 'DELETE');
    }
    self.addPoints = function (item) {
        console.log('Adding points');
        var sum = parseInt(self.employee.time) + parseInt(self.employee.team) + parseInt(self.employee.quality) + parseInt(item.Points);
        var employee = {
            Id: item.Id,
            Name: self.updatedEmployee.Name,
            Points: item.Points,
            ManagerId: self.updatedEmployee.Manager.Id
        };

        ajaxHelper(employeesUri + '/' + item.Id, 'PUT', employee).done(function (data) {
            self.detail(data);
        });
    };
    self.updateEmployee = function () {
        console.log('Updating employee');
        var employee = {
            Id: self.detail().Id,
            Name: self.updatedEmployee.Name(),
            Points: self.detail().Points,
            ManagerId: self.updatedEmployee.Manager().Id
        };
       
        ajaxHelper(employeesUri + '/' + self.detail().Id, 'PUT', employee).done(function (data) {
            self.detail(data);
        });
    };
    self.getEmployee = function (item) {
        console.log('Getting employee');
        ajaxHelper(employeesUri + '/' + item.Id, 'GET').done(function (data) {
            self.detail(data);
        });
    }

    self.getManager = function (item) {
        console.log('Getting manager');
        ajaxHelper(managersUri + '/' + item.Id, 'GET').done(function (data) {
            self.detailMan(data);
        })
    }
   
    self.getTeam = function (item) {
        ajaxHelper(employeesUri + '?ManagerId=' + item.ManagerId, 'GET').done(function (data) {
            self.teamEmployees(data);
            self.detail(item);
        });
    };
    
    self.getManagerTeam = function (item) {
        ajaxHelper(employeesUri + '?ManagerId=' + item.Id, 'GET').done(function (data) {
            self.teamEmployees(data);
            self.detailMan(item);
        });
    };

    self.getDaysOff = function (item) {
        ajaxHelper(daysUri + '?EmployeeId=' + item.Id, 'GET').done(function (data) {
            self.daysOff(data);
            self.detail(item);
        });
    };

    self.getManagerDaysOff = function (item) {
        ajaxHelper(daysUri + '?EmployeeId=' + item.Id + '&isManager=true', 'GET').done(function (data) {
            self.daysOff(data);
            self.detailMan(item);
        });
    };

    self.getManagerTasks = function (item) {
        console.log('Pobieranie zadań managera');
        ajaxHelper(tasksUri + '?ManagerId=' + item.Id, 'GET').done(function (data) {
            self.tasks(data);
            self.detailMan(item);
        });
     };

    self.getTasks = function (item) {
        console.log('Pobieranie zadań pracownika');
        ajaxHelper(tasksUri + '?EmployeeId=' + item.Id, 'GET').done(function (data) {
            self.tasks(data);
            self.detail(item);
        });
    };

    self.getFinishedTasks = function (item) {
        console.log('Pobieranie ukończonych zadań pracownika');
        ajaxHelper(tasksUri + '?EmployeeId=' + item.Id + '&Status=Zamkniete', 'GET').done(function (data) {
            self._tasks(data);
            console.log('_tasks.length: ', _tasks.length);
            self.countDone(_tasks.length);
        });
    };

    self.getDetails = function (item) {
        self.getDaysOff(item);
        self.getTeam(item);
        self.getTasks(item);
        self.getFinishedTasks(item);
    };

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

    function getAllEmployees() {
        ajaxHelper(employeesUri, 'GET').done(function (data) {
            self.employees(data);
        });
    }
    function getAllManagers() {
        ajaxHelper(managersUri, 'GET').done(function (data) {
            self.managers(data);
        });
    }
    function getAllTasks() {
        ajaxHelper(tasksUri, 'GET').done(function (data) {
            self._tasks(data);
        });
    }
    function getAllDaysOff() {
        ajaxHelper(daysUri, 'GET').done(function (data) {
            self._days(data);
        });
    }
    self.newTask = {
        EmployeeId: ko.observable(),
        StartDate: ko.observable(),
        EndDate: ko.observable(),
        Description: ko.observable(),
        Points: ko.observable(),
    };
    self.addTask = function () {
        console.log('Adding task');
        var task = {
            EmployeeId: self.newTask.EmployeeId,
            StartDate: self.newTask.StartDate,
            EndDate: self.newTask.EndDate,
            Description: self.newTask.Description,
            Points: self.newTask.Points
        };
        ajaxHelper(tasksUri, 'POST', task);
    };
    // Fetch the initial data.
    getAllEmployees();
    getAllDaysOff();
    getAllTasks();
    getAllManagers();

};

ko.applyBindings(new ViewModel());

