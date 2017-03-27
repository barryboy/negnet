(function () {
    'use strict';

    angular
        .module('negnetApp')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', 'API'];
    function UserService($http, API) {
        var service = {};
        var baseUrl = API.URL + ':' + API.PORT;

        service.GetAll = GetAll;
        service.GetCurrent = GetCurrent;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function Create(user) {
            return $http.post(baseUrl + '/newuser/', user).then(handleSuccess, handleError('Error creating user'));
        }

        function GetAll() {
            console.log('Userservice.GetAll()');
            return $http.get(baseUrl + '/users/').then(handleSuccess, handleError('Error getting all users'));
        }


        function GetCurrent() {
            console.log('Userservice.GetCurrent()');
            return $http.get(baseUrl + '/user/').then(function(response) {
                return response.data 
            },
                handleError('Error getting current user'));
        }

        function GetByUsername(username) {
            return $http.get(baseUrl + '/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Update(user) {
            return $http.put(baseUrl + '/user/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete(baseUrl + '/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return { success: true, message: "Success", data: res.data };
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }
})();
