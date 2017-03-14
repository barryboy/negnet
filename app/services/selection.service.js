(function () {
    'use strict';

    angular
        .module('negnetApp')
        .factory('SelectionService', SelectionService);

    SelectionService.$inject = ['$http'];
    function SelectionService($http) {
        var service = {};
        var baseUrl = 'http://localhost:5000';

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get(baseUrl + '/api01/selections/').then(handleSuccess, handleError('Error getting all selections'));
        }

        function GetById(id) {
            return $http.get(baseUrl + '/api01/selections/' + id).then(handleSuccess, handleError('Error getting selection by id'));
        }

        function GetByUserInProject(id) {
            return $http.getx(baseUrl + '/api01/selections/' + id).then(handleSuccess, handleError('Error getting selection by id'));
        }

        function Create(selection) {
            return $http.post(baseUrl + '/api01/selections/', selection).then(handleSuccess, handleError('Error creating selection'));
        }

        function Update(selection) {
            return $http.put(baseUrl + '/api01/selections/' + selection.id, selection).then(handleSuccess, handleError('Error updating selection'));
        }

        function Delete(id) {
            return $http.delete(baseUrl + '/api01/selections/' + id).then(handleSuccess, handleError('Error deleting selection'));
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
