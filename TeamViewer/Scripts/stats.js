var StatsViewModel = function () {
    var self = this;

    self.error = ko.observable();
    self.tasks = ko.observable();
    self.newTasks = ko.observable(1);
    self.todoTasks = ko.observable(2);
    self.inprogressTasks = ko.observable(3);
    self.doneTasks = ko.observable(4);
    self.closedTasks = ko.observable(5);
    self.data = {
        datasets: [{
            data: [self.newTasks, self.todoTasks, self.inprogressTasks, self.doneTasks, self.closedTasks],
            backgroundColor: [
								"#FF6384",
								"#36A2EB",
								"#FFCE56",
                                "#cc65fe",
								"#009933"
            ],
            hoverBackgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#cc65fe",
		"#009933"
            ]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Nowe',
            'Do Zrobienia',
            'W trakcie',
            'Zrobione',
            'Zamknięte'
        ]
    };
    self.manager = ko.observable();
    self.managers = ko.observableArray();
    self.employees = ko.observableArray();
    //managerowie
    var managersUri = '/api/managers';
    function getAllManagers() {
        console.log("Getting all managers");
        ajaxHelper(managersUri, 'GET').done(function (data) {
            self.managers(data);   
        });
    }

    //tasks
    var tasksUri = '/api/tasks';
    self.getNewTasks = function (item) {
        console.log('Pobieranie liczby zadań przypisanych do danego managera - o danym statusie');
        ajaxHelper(tasksUri + '?ManagerId=' + item.Id + '&Status=Nowe' + '&count=true', 'GET').done(function (data) {
            self.newTasks(data);
      });
    };
    self.getToDoTasks = function (item) {
        console.log('Pobieranie liczby zadań przypisanych do danego managera - o danym statusie');
        ajaxHelper(tasksUri + '?ManagerId=' + item.Id + '&Status=DoZrobienia' + '&count=true', 'GET').done(function (data) {
            self.todoTasks(data);
        });
    };
    self.getInProgressTasks = function (item) {
        console.log('Pobieranie liczby zadań przypisanych do danego managera - o danym statusie');
        ajaxHelper(tasksUri + '?ManagerId=' + item.Id + '&Status=Wtrakcie' + '&count=true', 'GET').done(function (data) {
            self.inprogressTasks(data);
        });
    };
    self.getDoneTasks = function (item) {
        console.log('Pobieranie liczby zadań przypisanych do danego managera - o danym statusie');
        ajaxHelper(tasksUri + '?ManagerId=' + item.Id + '&Status=Zrobione' + '&count=true', 'GET').done(function (data) {
            self.doneTasks(data);
        });
    };
    self.getClosedTasks = function (item) {
        console.log('Pobieranie liczby zadań przypisanych do danego managera - o danym statusie');
        ajaxHelper(tasksUri + '?ManagerId=' + item.Id + '&Status=Zamkniete' + '&count=true', 'GET').done(function (data) {
            self.closedTasks(data);
        });
    };

    self.getTasks = function (item) {
        self.manager(item);

        self.getNewTasks(item);
        self.getToDoTasks(item);
        self.getInProgressTasks(item);
        self.getDoneTasks(item);
        self.getClosedTasks(item);

        self.tasks("something is there");
    }

    var employeesUri = '/api/employees';
    function getAllEmployees() {
        ajaxHelper(employeesUri + '?sorted=true', 'GET').done(function (data) {
            self.employees(data);
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
    };

    getAllManagers();
    getAllEmployees();
};

ko.applyBindings(new StatsViewModel());