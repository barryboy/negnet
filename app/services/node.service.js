(function () {
    'use strict';

    angular
        .module('negnetApp')
        .factory('NodeService', NodeService);

    NodeService.$inject = ['$http', 'API', '$log'];
    function NodeService($http, API, $log) {
        var service = {};
        var baseUrl = API.URL + ':' + API.PORT;

        service.GetAllByProject = GetAllByProject;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAllByProject(p_id) {
            $log.info('Getting nodes from project ' + p_id);
            return $http.get(baseUrl + '/nodes/' + p_id + '/').then(handleSuccess, handleError('Error getting all nodes'));
        }

        function GetById(id) {
            return $http.get(baseUrl + '/node/' + id).then(handleSuccess, handleError('Error getting node by id'));
        }

        function Create(node) {
            return $http.post(baseUrl + '/node/', node).then(handleSuccess, handleError('Error creating node'));
        }

        function Update(node) {
            return $http.put(baseUrl + '/node/' + node.id, node).then(handleSuccess, handleError('Error updating node'));
        }

        function Delete(id) {
            return $http.delete(baseUrl + '/node/' + id).then(handleSuccess, handleError('Error deleting node'));
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
