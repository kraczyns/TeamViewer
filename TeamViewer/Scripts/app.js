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
    self.getCurrentEmployees = function () {
        var selectedVal = self.manager();

        if (!selectedVal)
            return self.employees;

        return self.employees().filter(function (f) {
            return f.ManagerId === selectedVal.ManagerId;
        });
    };

    var employeesUri = '/api/employees';
    var daysUri = '/api/dayoffs';
    var tasksUri = '/api/tasks';
    var managersUri = '/api/managers';

    self.detail = ko.observable();
    self.detailMan = ko.observable();

    self.updatedManager = {
        Id: ko.observable(),
        Name: ko.observable()
    }

    self.employee = {
        Id: ko.observable(), 
        Name : ko.observable(), 
        Points: ko.observable(),
        Manager: ko.observable(),
        time : ko.observable(),
        team : ko.observable(),
        quality : ko.observable()
    }

    self.updatedEmployee = {
        Id: ko.observable(),
        Name: ko.observable(),
        Points: ko.observable(),
        Manager: ko.observable()
    }

    self.newDayOff = {
        Date: ko.observable(),
        EmployeeId: ko.observable()
    }

    self.addDayOff = function () {
        console.log('Adding day off');
        var dayOff = {
            Date: self.newDayOff.Date(),
            EmployeeId: self.detail().Id
        }
        ajaxHelper(daysUri, 'POST', dayOff);
    }

    self.newEmployee = {
        Id: ko.observable(),
        Manager: ko.observable(),
        Name: ko.observable()
    }

    self.newManager = {
        Id: ko.observable(),
        Name: ko.observable()
    }

    self.updateManager = function () {
        console.log('Updating manager');
        var manager = {
            Id: self.detailMan().Id,
            Name: updatedManager.Name()
        }
        ajaxHelper(managersUri + '/' + self.detailMan().Id, 'PUT', manager);
    }

    self.addEmployee = function () {
        console.log('Adding employee');
        var employee = {
            ManagerId: self.newEmployee.Manager().Id,
            Name: self.newEmployee.Name()
        }
        ajaxHelper(employeesUri, 'POST', employee);
    }

    self.addManager = function () {
        console.log('Adding manager');
        var manager = {
            Name: self.newManager.Name()
        }
        ajaxHelper(managersUri, 'POST', manager);
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
    }

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
    }

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
        })
    }
    
    self.getDaysOff = function (item) {
        ajaxHelper(daysUri + '?EmployeeId=' + item.Id, 'GET').done(function (data) {
            self.daysOff(data);
            self.detail(item);
        })
    }

    self.getTasks = function (item) {
        ajaxHelper(tasksUri + '?EmployeeId=' + item.Id, 'GET').done(function (data) {
            self.tasks(data);
            self.detail(item);
        })
    }

    self.getDetails = function (item) {
        self.getDaysOff(item);
        self.getTeam(item);
        self.getTasks(item)
    }

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
    // Fetch the initial data.
    getAllEmployees();
    getAllDaysOff();
    getAllTasks();
    getAllManagers();

};

ko.applyBindings(new ViewModel());

