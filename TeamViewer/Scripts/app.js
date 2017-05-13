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
    self.manager = ko.observable("");

    self.filteredEmployees = ko.computed(function () {
        console.log('manager: ', self.manager());
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
                console.log('managerId: ', item.ManagerId);
                console.log('manager: ', filterManager);
                filteredManager = item.Manager.Name.toLowerCase().indexOf(filterManager) !== -1;
                return filteredManager;
            });
        } else if (filterManager && filterSearch) {
            return ko.utils.arrayFilter(self.employees(), function (item) {
                console.log('managerId: ', item.ManagerId);
                console.log('manager: ', filterManager);
                return item.Manager.Name.toLowerCase().indexOf(filterManager) !== -1 && item.Name.toLowerCase().indexOf(filterSearch) !== -1;
            });
        }
    });
    self.getCurrentEmployees = function() {
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

    self.employee = {
        Id: ko.observable(), 
        Name : ko.observable(), 
        Points: ko.observable(),
        Manager: ko.observable(),
        time : ko.observable(),
        team : ko.observable(),
        quality : ko.observable()
    }

    self.addPoints = function (item) {
        var sum = parseInt(self.employee.time) + parseInt(self.employee.team) + parseInt(self.employee.quality) + parseInt(item.Points);
        var employee = {
            Id: item.Id,
            Name: item.Name,
            Points: self.employee.time,
            ManagerId: item.ManagerId
        };

        ajaxHelper(employeesUri + '/' + item.Id, 'PUT', employee).done(function (data) {
            self.detail(data);
        });
    }

    self.getEmployee = function (item) {
        ajaxHelper(employeesUri + '/' + item.Id, 'GET').done(function (data) {
            self.detail(data);
        });
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

