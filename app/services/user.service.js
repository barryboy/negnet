(function () {
    'use strict';

    angular
        .module('negnetApp')
        .factory('UserService', UserService);

    UserService.$inject = ['$http'];
    function UserService($http) {
        var service = {};
        var baseUrl = 'http://127.0.0.1:5000';

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function Create(user) {
            return $http.post(baseUrl + '/api01/user/', user).then(handleSuccess, handleError('Error creating user'));
        }

        function GetAll() {
            console.log('Userservice.GetAll()');
            return $http.get(baseUrl + '/api01/users/').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get(baseUrl + '/api01/user/' + id + '/').then(function(response){ return response.data.user },
                handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get(baseUrl + '/api01/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Update(user) {
            return $http.put(baseUrl + '/api01/user/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete(baseUrl + '/api01/users/' + id).then(handleSuccess, handleError('Error deleting user'));
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
