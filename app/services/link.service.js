(function () {
    'use strict';

    angular
        .module('negnetApp')
        .factory('LinkService', LinkService);

    LinkService.$inject = ['$http'];
    function LinkService($http) {
        var service = {};
        var baseUrl = 'http://localhost:5000';

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get(baseUrl + '/api01/links/').then(handleSuccess, handleError('Error getting all links'));
        }

        function GetById(id) {
            return $http.get(baseUrl + '/api01/links/' + id).then(handleSuccess, handleError('Error getting link by id'));
        }

        function Create(link) {
            return $http.post(baseUrl + '/api01/links/', link).then(handleSuccess, handleError('Error creating link'));
        }

        function Update(link) {
            return $http.put(baseUrl + '/api01/links/' + link.id, link).then(handleSuccess, handleError('Error updating link'));
        }

        function Delete(id) {
            return $http.delete(baseUrl + '/api01/links/' + id).then(handleSuccess, handleError('Error deleting link'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }
})();
