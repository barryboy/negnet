(function () {
    'use strict';

    angular
        .module('negnetApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', '$http', '$base64', 'SessionService', 'API'];
    function LoginController($location, $http, $base64, SessionService, API) {
        var vm = this;
        vm.login = login;

        function login() {
            vm.user = {'username': vm.username, 'password': vm.password};
            vm.auth = $base64.encode(vm.user.username + ':' + vm.user.password),
            vm.headers = {"Authorization": "Basic " + vm.auth};
            vm.url = API.URL + ':' + API.PORT + '/token/';
            $http.get(vm.url, {headers: vm.headers})
                .then(function successCallback(response) {
                    vm.data = response.data;
                    SessionService.logUserIn(vm.data.u_id, vm.data.token,vm.data.duration);
                    $location.path("/home");
                }, function errorCallback(response) {
                    SessionService.logUserOut();
                });
        }
    }
})();
