﻿var ViewModel = function () {
    var self = this;
    self.employees = ko.observableArray();
    self.managers = ko.observableArray();
    self.teamEmployees = ko.observableArray();
    self.daysOff = ko.observableArray();
    self.tasks = ko.observableArray();
    self._tasks = ko.observableArray();
    self.finishedTasks = ko.observableArray();
    self._days = ko.observableArray();
    self.error = ko.observable();
    self.query = ko.observable("");
    self.name = ko.observable("");
    self.manager = ko.observable("");
    self.countDone = ko.observable("2");
    self.helper = ko.observableArray();
    self.tasksStatuses = ko.observableArray();
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
    var tasksUri = '/api/tasks';
    var managersUri = '/api/managers';

    self.detail = ko.observable();
    self.detailMan = ko.observable();

    self.employee = {
        Id: ko.observable(), 
        Name : ko.observable(), 
        Points: ko.observable(),
        Manager: ko.observable(),
        time : ko.observable(0),
        team : ko.observable(0),
        quality : ko.observable(0)
    };

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
            self.finishedTasks(data);
            console.log('finishedTasks.length: ', self.finishedTasks().length);
            self.countDone(self.finishedTasks().length);
        });
    };

    self.getDetails = function (item) {
        self.getTasks(item);
        self.getFinishedTasks(item);
    };

    self.getManagerDetails = function (item) {
        self.getManagerDaysOff(item);
        self.getManagerTeam(item);
        self.getManagerTasks(item);
    };

    self.getNewTasksNumber = function (item) {
       
        ajaxHelper(tasksUri + '?ManagerId=' + item.Id + '&Status=Nowe', 'GET').done(function (data) {
            self.helper(data);
            console.log('self.helper().length: ', self.helper().length);
            return self.helper().length;
        });
    };

    self.getToDoTasksNumber = function (item) {
        ajaxHelper(tasksUri + '?ManagerId=' + item.Id + '&Status=DoZrobienia', 'GET').done(function (data) {
            self.helper(data);
            return self.helper().length;
        });
    };

    self.getInProgressTasksNumber = function (item) {
        ajaxHelper(tasksUri + '?ManagerId=' + item.Id + '&Status=Wtrakcie', 'GET').done(function (data) {
            self.helper(data);
            return self.helper().length;
        });
    };

    self.getDoneTasksNumber = function (item) {
        ajaxHelper(tasksUri + '?ManagerId=' + item.Id + '&Status=Zrobione', 'GET').done(function (data) {
            self.helper(data);
            return self.helper().length;
        });
    };

    self.getClosedTasksNumber = function (item) {
        ajaxHelper(tasksUri + '?ManagerId=' + item.Id + '&Status=Zamkniete', 'GET').done(function (data) {
            self.helper(data);
            return self.helper().length;
        });
    };

    self.getStatuses = function (item) {
        self.getNewTasksNumber(item);
        self.getToDoTasksNumber(item);
        self.getInProgressTasksNumber(item);
        self.getDoneTasksNumber(item);
        self.getClosedTasksNumber(item);
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

    self.getTask = function (item) {
        ajaxHelper(tasksUri + '/' + item.Id, 'GET').done(function (data) {
            self.detail(data);
        })
    };
    self.newTask = {
        Employee: ko.observable(),
        Manager: ko.observable(),
        StartDate: ko.observable(),
        EndDate: ko.observable(),
        Description: ko.observable(),
        Points: ko.observable()
    };
    self.addTask = function () {
        console.log('Adding task');
        var task = {
            EmployeeId: self.newTask.Employee().Id,
            ManagerId: self.newTask.Manager().Id,
            StartDate: self.newTask.StartDate(),
            EndDate: self.newTask.EndDate(),
            Description: self.newTask.Description(),
            Points: self.newTask.Points()
        };
        ajaxHelper(tasksUri, 'POST', task).done(function () {
            console.log("Task added");
            getAllTasks();
        })
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
    self.updateTask = function () {		
        console.log('Updating task');
            var task = {
                Id: self.detail().Id,
                EmployeeId: (self.updatedTask.Employee() == undefined) ?
                 self.detail().Employee.Id : self.updatedTask.Employee().Id,
                ManagerId: (self.updatedTask.Manager() == undefined) ?
                 self.detail().Manager.Id : self.updatedTask.Manager().Id,
                StartDate: (self.updatedTask.StartDate() == undefined) ?
                 self.detail().StartDate : self.updatedTask.StartDate(),
                EndDate: (self.updatedTask.EndDate() == undefined) ?
                  self.detail().EndDate : self.updatedTask.EndDate(),
                Description: (self.updatedTask.Description() == undefined) ?
                  self.detail().Description : self.updatedTask.Description(),
                Points: (self.updatedTask.Points() == undefined) ?
                  self.detail().Points : self.updatedTask.Points(),
                Status: (self.updatedTask.Status() == undefined) ?
                  self.detail().Status : self.updatedTask.Status()
            };
            ajaxHelper(tasksUri + '/' + self.detail().Id, 'PUT', task).done(function (data) {
                self.getTask(self.detail());
                if (task.Status == 4) {
                    self.automaticPoints(task.Points, task.EmployeeId);
                    self.getTask(self.detail());
                }
                getAllTasks();

            });		
    };
    // Fetch the initial data.
    getAllEmployees();
    getAllTasks();
    getAllManagers();

};

ko.applyBindings(new ViewModel());

