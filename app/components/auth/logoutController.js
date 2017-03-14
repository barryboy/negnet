(function () {
    'use strict';

    angular
        .module('negnetApp')
        .controller('LogoutController', LogoutController);

    LogoutController.$inject = ['$location', 'SessionService'];
    function LogoutController($location, SessionService) {
        var vm = this;
        SessionService.logUserOut();
        $location.path("/home");
    }
})();
