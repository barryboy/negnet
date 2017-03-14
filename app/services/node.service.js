(function () {
    'use strict';

    angular
        .module('negnetApp')
        .factory('NodeService', NodeService);

    NodeService.$inject = ['$http'];
    function NodeService($http) {
        var service = {};
        var baseUrl = 'http://localhost:5000';

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get(baseUrl + '/api01/nodes/').then(handleSuccess, handleError('Error getting all nodes'));
        }

        function GetById(id) {
            return $http.get(baseUrl + '/api01/nodes/' + id).then(handleSuccess, handleError('Error getting node by id'));
        }

        function Create(node) {
            return $http.post(baseUrl + '/api01/nodes/', node).then(handleSuccess, handleError('Error creating node'));
        }

        function Update(node) {
            return $http.put(baseUrl + '/api01/nodes/' + node.id, node).then(handleSuccess, handleError('Error updating node'));
        }

        function Delete(id) {
            return $http.delete(baseUrl + '/api01/nodes/' + id).then(handleSuccess, handleError('Error deleting node'));
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
