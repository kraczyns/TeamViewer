var EmployeeViewModel = function () {
    var self = this;

    self.employees = ko.observableArray();
    self.managers = ko.observableArray();
    self.teamEmployees = ko.observableArray();
    self.daysOff = ko.observableArray();
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
            console.log('manager: ', manager);
            return ko.utils.arrayFilter(filteredSearch, function (item) {
                filteredManager = item.Manager.Name == filterManager;
                return filteredManager;
            });
        } else if (filterManager && filterSearch) {
            return ko.utils.arrayFilter(self.employees(), function (item) {
                return item.Manager.Name == filterManager && item.Name.toLowerCase().indexOf(filterSearch) !== -1;
            });
        }
    });

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
    function getAllEmployees() {
        ajaxHelper(employeesUri, 'GET').done(function (data) {
            self.employees(data);
        });
    }
    self.getDetails = function (item) {
        self.getDaysOff(item);
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
            EmployeeId: self.updatedTask.Employee().Id,
            ManagerId: self.updatedTask.Manager().Id,
            StartDate: self.updatedTask.StartDate(),
            EndDate: self.updatedTask.EndDate(),
            Description: self.updatedTask.Description(),
            Points: self.updatedTask.Points(),
            Status: self.updatedTask.Status()
        };
        ajaxHelper(tasksUri + '/' + self.detail().Id, 'PUT', task).done(function (data) {
            self.detail(data);
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
        ajaxHelper(daysUri, 'POST', dayOff);
    };
    self.getDaysOff = function (item) {
        ajaxHelper(daysUri + '?EmployeeId=' + item.Id, 'GET').done(function (data) {
            self.daysOff(data);
            self.detail(item);
        });
    };
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
        var employee = {
            Id: self.detail().Id,
            Name: self.detail().Name,
            Points: sum,
            ManagerId: self.detail().Manager.Id
        };

        console.log('Pracownik:', typeof (self.detail().Name), self.detail().Name)
        console.log('Punkty po przypisaniu:', employee.Points)

        ajaxHelper(employeesUri + '/' + self.detail().Id, 'PUT', employee).done();
    };

   //zespół
    self.getTeam = function (item) {
        ajaxHelper(employeesUri + '?ManagerId=' + item.ManagerId, 'GET').done(function (data) {
            self.teamEmployees(data);
            self.detail(item);
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