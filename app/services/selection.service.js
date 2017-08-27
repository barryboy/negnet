(function () {
    'use strict';

    angular
        .module('negnetApp')
        .factory('SelectionService', SelectionService);

    SelectionService.$inject = ['$http', 'API', '$log'];
    function SelectionService($http, API, $log) {
        var service = {};
        var baseUrl = API.URL + ':' + API.PORT;

        service.GetById = GetById;
        service.GetByProject = GetByProject;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetById(s_id) {
            $log.info('Getting selections from project ' + p_id);
            return $http.get(baseUrl + '/selections/' + s_id).then(handleSuccess, handleError('Error getting selection by id'));
        }

        function GetByProject(p_id) {
            return $http.get(baseUrl + '/selections/' + p_id + '/').then(handleSuccess, handleError('Error getting selection by  project id'));
        }

        function Create(selection) {
            console.log('SelectionService.Create()');
            return $http.post(baseUrl + '/selection/', selection).then(handleSuccess, handleError('Error creating selection'));
        }

        function Update(selection) {
            return $http.put(baseUrl + '/selection/' + selection.id, selection).then(handleSuccess, handleError('Error updating selection'));
        }

        function Delete(id) {
            return $http.delete(baseUrl + '/selection/' + id).then(handleSuccess, handleError('Error deleting selection'));
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
