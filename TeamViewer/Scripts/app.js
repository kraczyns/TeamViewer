var ViewModel = function () {
    var self = this;
    self.employees = ko.observableArray();
    self.teamEmployees = ko.observableArray();
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

    // Fetch the initial data.
    getAllEmployees();
};

ko.applyBindings(new ViewModel());

