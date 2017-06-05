var EmployeeViewModel = function () {
    var self = this;

    self.employees = ko.observableArray();
    self.managers = ko.observableArray();
    self.teamEmployees = ko.observableArray();
    self.daysOff = ko.observableArray();
    self.daysOffHistory = ko.observableArray();
    self.daysOffFuture = ko.observableArray();
    self.tasks = ko.observableArray();
    self.finishedTasks = ko.observableArray();
    self.error = ko.observable();
    self.query = ko.observable("");
    self.manager = ko.observable("");
    self.countDone = ko.observable("2");

    // Filtowanie pracowników po ich nazwie i po managerze
    self.filteredEmployees = ko.computed(function () {
        var filterSearch = self.query().toLowerCase();
        var filterManager = self.manager();
        
        var filteredManager = self.employees();
        var filteredSearch = self.employees();

        if (filterSearch && !filterManager) {
            return ko.utils.arrayFilter(filteredManager, function (item) {
                filteredSearch = item.Name.toLowerCase().indexOf(filterSearch) !== -1;
                return filteredSearch;
            });
        } else if (!filterManager && !filterSearch) {
            return self.employees();
        } else if (filterManager && !filterSearch) {
            return ko.utils.arrayFilter(filteredSearch, function (item) {
                filteredManager = item.Manager.Name == filterManager.Name;
                return filteredManager;
            });
        } else if (filterManager && filterSearch) {
            return ko.utils.arrayFilter(self.employees(), function (item) {
                return item.Manager.Name == filterManager.Name && item.Name.toLowerCase().indexOf(filterSearch) !== -1;
            });
        }
    });

    self.refresh = function (item) {
        getAllEmployees();
        getAllDaysOff();
        getAllManagers;
        getAllTasks;
        self.getDetails(item);
}
    //pracownicy 

    var employeesUri = '/api/employees';
    self.detail = ko.observable();
    self.employee = {
        Id: ko.observable(),
        Name: ko.observable(),
        Points: ko.observable(),
        Manager: ko.observable(),
        time: ko.observable(0),
        team: ko.observable(0),
        quality: ko.observable(0)
    };
    self.updatedEmployee = {
        Id: ko.observable(),
        Name: ko.observable(),
        Points: ko.observable(),
        Manager: ko.observable()
    };
    self.updateEmployee = function () {
        console.log('Updating employee');
        var id = self.detail().Id;
        var employee = {
            Id: self.detail().Id,
            Name: (self.updatedEmployee.Name() == undefined) ?
             self.detail().Name : self.updatedEmployee.Name(),
            Points: self.detail().Points,
            ManagerId: (self.updatedEmployee.Manager() == undefined) ?
             self.detail().Manager.Id : self.updatedEmployee.Manager().Id
        };

        ajaxHelper(employeesUri + '/' + self.detail().Id, 'PUT', employee).done(function (data) {
            console.log('Updating employee', self.detail().Id);
            getAllEmployees();
            self.getEmployee(id);
            self.getTeam(data);     
        });
    };
    self.getEmployee = function (id) {
        console.log('Getting employee');
        ajaxHelper(employeesUri + '/' + id, 'GET').done(function (data) {
            self.detail(data);
        });
    }
    function getAllEmployees() {
        ajaxHelper(employeesUri, 'GET').done(function (data) {
            self.employees(data);
        });
    }
    self.getDetails = function (item) {
        self.detail(item);
        self.getDaysOffHistory(item);
        self.getDaysOffFuture(item);
        self.getTeam(item);
        self.getTasks(item);
        self.getFinishedTasks(item);
    };
    
    //managerowie
    var managersUri = '/api/managers';
    function getAllManagers() {
        ajaxHelper(managersUri, 'GET').done(function (data) {
            self.managers(data);
        });
    }

    //zadania
    var tasksUri = '/api/tasks';
    self.detailTask = ko.observable();
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
            self.finishedTasks(data);
            console.log('finishedTasks.length: ', self.finishedTasks().length);
            self.countDone(self.finishedTasks().length);
        });
    };
    self.updatedTask = {
        Id: ko.observable(),
        Employee: ko.observable(),
        Manager: ko.observable(),
        StartDate: ko.observable(),
        EndDate: ko.observable(),
        Description: ko.observable(),
        Points: ko.observable(),
        Status: ko.observable()
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
            self.getTasks(self.detail());
        });
    };
    function getAllTasks() {
        ajaxHelper(tasksUri, 'GET').done(function (data) {
            self.tasks(data);
        });
    }

    //dni wolne
    var daysUri = '/api/dayoffs';
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
        ajaxHelper(daysUri, 'POST', dayOff).done(function () {
            getAllDaysOff();
            self.getDaysOffFuture(self.detail());
        })
    };
    self.getDaysOffHistory = function (item) {
        ajaxHelper(daysUri + '?EmployeeId=' + item.Id + '&isManager=false&history=true', 'GET').done(function (data) {
            self.daysOffHistory(data);
            self.detail(item);
        });
    };
    self.getDaysOffFuture = function (item) {
        ajaxHelper(daysUri + '?EmployeeId=' + item.Id + '&isManager=false&future=true', 'GET').done(function (data) {
            self.daysOffFuture(data);
            self.detail(item);
        });
    };
    self.deleteDayOff = function (item) {
        console.log('Usuwanie dnia wolnego');
        ajaxHelper(daysUri + '/' + item.Id, 'DELETE').done(function (data) {
            self.getDaysOffFuture(self.detail());
        });
    }
    function getAllDaysOff() {
        ajaxHelper(daysUri, 'GET').done(function (data) {
            self.daysOff(data);
        });
    }



    //punkty
    self.addPoints = function () {
        console.log('Dodawanie punktów');
        var sum = parseInt(self.employee.time()) + parseInt(self.employee.team()) + parseInt(self.employee.quality()) + parseInt(self.detail().Points);
        console.log('Punkty z bazy:', parseInt(self.detail().Points))
        var id = self.detail().Id;
        var employee = {
            Id: self.detail().Id,
            Name: self.detail().Name,
            Points: sum,
            ManagerId: self.detail().Manager.Id
        };

        console.log('Pracownik:', typeof (self.detail().Name), self.detail().Name)
        console.log('Punkty po przypisaniu:', employee.Points)

        ajaxHelper(employeesUri + '/' + self.detail().Id, 'PUT', employee).done(function (data) {
            self.getEmployee(id);
        });
    };

   //zespół
    self.getTeam = function (item) {
        ajaxHelper(employeesUri + '?ManagerId=' + item.ManagerId, 'GET').done(function (data) {
            self.teamEmployees(data);
        });
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
    };

    // Fetch the initial data.
    getAllEmployees();
    getAllDaysOff();
    getAllTasks();
    getAllManagers();

};

ko.applyBindings(new EmployeeViewModel());