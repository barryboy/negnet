(function () {
    'use strict';

    angular
        .module('negnetApp')
        .factory('LinkService', LinkService);

    LinkService.$inject = ['$http', 'API'];
    function LinkService($http, API) {
        var service = {};
        var baseUrl = API.URL + ':' + API.PORT;

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get(baseUrl + '/links/').then(handleSuccess, handleError('Error getting all links'));
        }

        function GetById(id) {
            return $http.get(baseUrl + '/links/' + id).then(handleSuccess, handleError('Error getting link by id'));
        }

        function Create(link) {
            return $http.post(baseUrl + '/links/', link).then(handleSuccess, handleError('Error creating link'));
        }

        function Update(link) {
            return $http.put(baseUrl + '/links/' + link.id, link).then(handleSuccess, handleError('Error updating link'));
        }

        function Delete(id) {
            return $http.delete(baseUrl + '/links/' + id).then(handleSuccess, handleError('Error deleting link'));
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
