var ViewModel = function () {
    var self = this;
    self.employees = ko.observableArray();
    self.teamEmployees = ko.observableArray();
    self.daysOff = ko.observableArray();
    self.tasks = ko.observableArray();
    self._tasks = ko.observableArray();
    self._days = ko.observableArray();
    self.error = ko.observable();
    self.query = ko.observable("");

    self.filteredEmployees = ko.computed(function () {
        var filter = self.query().toLowerCase();

        if (!filter) {
            return self.employees();
        } else {
            return ko.utils.arrayFilter(self.employees(), function (item) {
                return item.Name.toLowerCase().indexOf(filter) !== -1;
            });
        }
    });

    var employeesUri = '/api/employees';
    var daysUri = '/api/dayoffs';
    var tasksUri = '/api/tasks';

    self.detail = ko.observable();

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
};

ko.applyBindings(new ViewModel());

