(function () {
    'use strict';

    angular
        .module('negnetApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['SessionService'];
    function HomeController(SessionService) {
        var vm = this;
        if (SessionService.isUserLoggedIn()) {
        };
    }
})();
