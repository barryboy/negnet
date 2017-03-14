(function () {
    'use strict';

    angular
        .module('negnetApp')
        .factory('AuthInterceptor', AuthInterceptor)
        .config(['$httpProvider', function($httpProvider) {
            $httpProvider.interceptors.push('AuthInterceptor');
        }])

    AuthInterceptor.$inject = ['$rootScope','$q', '$window', '$base64'];
    function AuthInterceptor($rootScope, $q, $window, $base64) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    var headers = $base64.encode($window.sessionStorage.token + ':none')
                    config.headers.Authorization = 'Basic ' + headers;
                }
                return config;
            },
            response: function(response){
                if (response.status === 401) {
                    $location.path('/login');
                }
                return response || $q.when(response);
            }
        };
    }


})();
