(function(){
    'use strict';

    angular
        .module('negnetApp')
        .config(config);

        config.$inject = ['$routeProvider', '$locationProvider'];
        function config($routeProvider, $locationProvider) {
            $routeProvider
                .when('/home', {
                    templateUrl     : '/app/components/home/homeView.html',
                    controller      : 'HomeController',
                    controllerAs    : 'vm'
                })
                .when('/dashboard', {
                    templateUrl     : '/app/components/dashboard/dashboardView.html',
                    controller      : 'DashboardController',
                    controllerAs    : 'vm'
                })
                .when('/about', {
                    templateUrl     : '/app/components/about/aboutView.html',
                    controller      : 'AboutController',
                    controllerAs    : 'vm'
                })
                .when('/negnet', {
                    templateUrl     : '/app/components/negnet/negnetView.html',
                    controller      : 'NegNetController',
                    controllerAs    : 'vm'
                })
                .when('/login', {
                    templateUrl     : '/app/components/auth/login.html',
                    controller      : 'LoginController',
                    controllerAs    : 'vm'
                })
                .when('/logout', {
                    templateUrl     : '/app/components/auth/logout.html',
                    controller      : 'LogoutController',
                    controllerAs    : 'vm'
                })
                .when('/signup', {
                    templateUrl     : '/app/components/auth/signup.html',
                    controller      : 'SignupController',
                    controllerAs    : 'vm'
                })
                .when('/chooser', {
                    templateUrl     : '/app/components/auth/chooser.html',
                })
                .otherwise({
                    templateUrl     : '/app/components/home/homeView.html',
                    controller      : 'HomeController',
                    controllerAs    : 'vm'
                })
            };
})();
