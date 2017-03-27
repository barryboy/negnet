(function () {
    'use strict';

    angular
        .module('negnetApp')
        .factory('SelectionService', SelectionService);

    SelectionService.$inject = ['$http', 'API'];
    function SelectionService($http, API) {
        var service = {};
        var baseUrl = API.URL + ':' + API.PORT;

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get(baseUrl + '/selections/').then(handleSuccess, handleError('Error getting all selections'));
        }

        function GetById(id) {
            return $http.get(baseUrl + '/selections/' + id).then(handleSuccess, handleError('Error getting selection by id'));
        }

        function GetByUserInProject(id) {
            return $http.getx(baseUrl + '/selections/' + id).then(handleSuccess, handleError('Error getting selection by id'));
        }

        function Create(selection) {
            return $http.post(baseUrl + '/selections/', selection).then(handleSuccess, handleError('Error creating selection'));
        }

        function Update(selection) {
            return $http.put(baseUrl + '/selections/' + selection.id, selection).then(handleSuccess, handleError('Error updating selection'));
        }

        function Delete(id) {
            return $http.delete(baseUrl + '/selections/' + id).then(handleSuccess, handleError('Error deleting selection'));
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
