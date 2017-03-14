(function () {
    'use strict';

    angular
        .module('negnetApp')
        .controller('AboutController', AboutController);

    function AboutController() {
        var vm = this;
        vm.message = 'Jestem na stronie about';
    }
})();
