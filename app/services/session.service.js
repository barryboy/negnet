(function () {
    'use strict';

    angular
        .module('negnetApp')
        .factory('SessionService', SessionService);

    SessionService.$inject = ['$window', '$rootScope', 'ProjectService'];
    function SessionService($window, $rootScope, ProjectService) {
        var service = {};

        service.isUserLoggedIn = isUserLoggedIn;
        service.logUserIn = logUserIn;
        service.logUserOut = logUserOut;
        service.getTokenDuration = getTokenDuration;
        service.getUserId = getUserId;

        return service;

        function isUserLoggedIn() {
            return $window.sessionStorage.loggedInUser != null
        }

        function logUserIn(u_id, token, duration) {
            $window.sessionStorage.u_id = u_id;
            $window.sessionStorage.token = token;
            $window.sessionStorage.duration = duration
            $window.sessionStorage.loggedInUser = true;
            $window.location.reload();
        }

        function logUserOut() {
            delete $window.sessionStorage.u_id;
            delete $window.sessionStorage.duration;
            delete $window.sessionStorage.token;
            delete $window.sessionStorage.loggedInUser;
            $window.location.reload();
        }

        function getTokenDuration() {
            return $window.sessionStorage.duration;
        }


        function getUserId() {
            return $window.sessionStorage.u_id;
        }

    }
})();
