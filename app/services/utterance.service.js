(function () {
    'use strict';

    angular
        .module('negnetApp')
        .factory('UtteranceService', UtteranceService);

    UtteranceService.$inject = ['$http'];
    function UtteranceService($http) {
        var service = {};
        var baseUrl = 'http://localhost:5000';

        service.GetAllByProject = GetAllByProject;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAllByProject(p_id) {
            return $http.get(baseUrl + '/api01/utterances/' + p_id + '/').then(handleSuccess, handleError('Error getting all utterances'));
        }

        function GetById(id) {
            return $http.get(baseUrl + '/api01/utterances/' + id).then(handleSuccess, handleError('Error getting utterance by id'));
        }

        function Create(utterance) {
            return $http.post(baseUrl + '/api01/utterances/', utterance).then(handleSuccess, handleError('Error creating utterance'));
        }

        function Update(utterance) {
            return $http.put(baseUrl + '/api01/utterances/' + utterance.id, utterance).then(handleSuccess, handleError('Error updating utterance'));
        }

        function Delete(id) {
            return $http.delete(baseUrl + '/api01/utterances/' + id).then(handleSuccess, handleError('Error deleting utterance'));
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
