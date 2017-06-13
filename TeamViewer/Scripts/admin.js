var AdminViewModel = function () {
    var self = this;
    self.employees = ko.observableArray();
    self.managers = ko.observableArray();
    self.daysOff = ko.observableArray();
    self.tasks = ko.observableArray();
    self.error = ko.observable();
    self.query = ko.observable("");
    self.name = ko.observable("");
    self.manager = ko.observable("");

    //filtrowanie managerów - searchBox
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

    //filtrowanie pracowników - searchBox
    self.filteredEmployees = ko.computed(function () {
        var filterSearch = self.query().toLowerCase();
        var filterManager = self.manager().toLowerCase();
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
                filteredManager = item.Manager.Name.toLowerCase().indexOf(filterManager) !== -1;
                return filteredManager;
            });
        } else if (filterManager && filterSearch) {
            return ko.utils.arrayFilter(self.employees(), function (item) {
                return item.Manager.Name.toLowerCase().indexOf(filterManager) !== -1 && item.Name.toLowerCase().indexOf(filterSearch) !== -1;
            });
        }
    });

    //employees
    var employeesUri = '/api/employees';
    self.detail = ko.observable();
    self.employee = {
        Id: ko.observable(),
        Name: ko.observable(),
        Points: ko.observable(),
        Manager: ko.observable(),
    };
    self.updatedEmployee = {
        Id: ko.observable(),
        Name: ko.observable(),
        Points: ko.observable(),
        Manager: ko.observable()
    };
    self.newEmployee = {
        Id: ko.observable(),
        Manager: ko.observable(),
        Name: ko.observable()
    };
    self.addEmployee = function () {
        console.log('Adding employee');
        var employee = {
            ManagerId: self.newEmployee.Manager().Id,
            Name: self.newEmployee.Name()
        };
        ajaxHelper(employeesUri, 'POST', employee).done(function (data) {
            getAllEmployees();
        });
    };
    self.deleteEmployee = function () {
        console.log('Usuwanie pracownika');
        ajaxHelper(employeesUri + '/' + self.detail().Id, 'DELETE').done(function (data) {
            getAllEmployees();
        })
    }
    self.updateEmployee = function () {
        console.log('Updating employee');
        var employee = {
            Id: self.detail().Id,
            Name: (self.updatedEmployee.Name() == undefined) ?
             self.detail().Name : self.updatedEmployee.Name(),
            Points: self.detail().Points,
            ManagerId: (self.updatedEmployee.Manager() == undefined) ?
             self.detail().Manager.Id : self.updatedEmployee.Manager().Id
        };

        ajaxHelper(employeesUri + '/' + self.detail().Id, 'PUT', employee).done(function (data) {
            getAllEmployees();
            self.getEmployee(self.detail());
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
        })
    }
    //managers
    var managersUri = '/api/managers';
    self.detailMan = ko.observable();
    self.updatedManager = {
        Id: ko.observable(),
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
            Name: (self.updatedManager.Name() == undefined) ? self.detailMan().Name : self.updatedManager.Name()
        }
        ajaxHelper(managersUri + '/' + self.detailMan().Id, 'PUT', manager).done(function (data) {
            getAllManagers();
            self.getManager(self.detailMan());
        })
    }
    self.addManager = function () {
        console.log('Adding manager');
        var manager = {
            Name: self.newManager.Name()
        };
        ajaxHelper(managersUri, 'POST', manager).done(function () {
            getAllManagers();
        })
    };

    self.deleteManager = function () {
        console.log('Usuwanie managera');
        ajaxHelper(managersUri + '/' + self.detailMan().Id, 'DELETE').done(function (data) {
            getAllManagers();
            getAllEmployees();
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
    getAllManagers();

};

ko.applyBindings(new AdminViewModel());

