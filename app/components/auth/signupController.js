(function () {
    'use strict';

    angular
        .module('negnetApp')
        .controller('SignupController', SignupController);

    SignupController.$inject = ['UserService', '$location'];
    function SignupController(UserService, $location) {
        var vm = this;
        vm.register = register;

        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    console.log(response);
                    if (response.success == true) {
                        $location.path('/login');
                    } else {
                        vm.dataLoading = false;
                    }
                });
        }
    }
})();
