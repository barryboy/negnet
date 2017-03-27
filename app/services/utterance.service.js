(function () {
    'use strict';

    angular
        .module('negnetApp')
        .factory('UtteranceService', UtteranceService);

    UtteranceService.$inject = ['$http', 'API'];
    function UtteranceService($http, API) {
        var service = {};
        var baseUrl = API.URL + ':' + API.PORT;

        service.GetAllByProject = GetAllByProject;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAllByProject(p_id) {
            return $http.get(baseUrl + '/utterances/' + p_id + '/').then(handleSuccess, handleError('Error getting all utterances'));
        }

        function GetById(id) {
            return $http.get(baseUrl + '/utterances/' + id).then(handleSuccess, handleError('Error getting utterance by id'));
        }

        function Create(utterance) {
            return $http.post(baseUrl + '/utterances/', utterance).then(handleSuccess, handleError('Error creating utterance'));
        }

        function Update(utterance) {
            return $http.put(baseUrl + '/utterances/' + utterance.id, utterance).then(handleSuccess, handleError('Error updating utterance'));
        }

        function Delete(id) {
            return $http.delete(baseUrl + '/utterances/' + id).then(handleSuccess, handleError('Error deleting utterance'));
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
