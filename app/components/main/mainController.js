(function () {
    'use strict';

    angular
        .module('negnetApp')
        .controller('MainController', MainController);

    MainController.$inject = ['SessionService', 'UserService', 'ProjectService', '$rootScope', '$mdSidenav', '$location', '$route'];
    function MainController(SessionService, UserService, ProjectService, $rootScope, $mdSidenav, $location, $route) {
        var vm = this;

        $location.path("/home");
        $rootScope.userLoggedIn = SessionService.isUserLoggedIn();
        vm.userLoggedIn = $rootScope.userLoggedIn;
        if (vm.userLoggedIn) {
            vm.userId = SessionService.getUserId();
            UserService.GetById(vm.userId).then(function(user){
                vm.name = user.first_name + ' ' + user.last_name;
                vm.username = user.username;
            });
            ProjectService.GetAllByUser(vm.userId).then(function(resp){
                var projects = [];
                for (var i = 0; i < resp.length; i++) {
                    projects.push(resp[i]);
                }
                $rootScope.my_projects = projects;
                if (projects.length > 0)
                    $rootScope.currentProject = projects[0].p_id;
                else {
                    $rootScope.currentProject = false;
                }
                vm.hasOpenProjects = ($rootScope.currentProject != false);
            });
        };


        vm.toggleLeft = function(p_id) {
            console.log(p_id);
            if (p_id) {
                $rootScope.currentProject = p_id;
                $route.reload();
            }
            $mdSidenav("left").toggle();
            vm.projects = $rootScope.my_projects;
        };
    }
})();
