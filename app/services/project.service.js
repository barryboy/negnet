(function () {
    'use strict';

    angular
        .module('negnetApp')
        .factory('ProjectService', ProjectService);

    ProjectService.$inject = ['$http'];
    function ProjectService($http) {
        var service = {};
        var baseUrl = 'http://127.0.0.1:5000';

        service.GetAll = GetAll;
        service.GetAllByUser = GetAllByUser;
        service.GetById = GetById;
        service.GetMyJudges = GetMyJudges;
        service.Create = Create;
        service.Update = Update;
        service.InsertData = InsertData;
        service.Delete = DeleteProject;

        return service;

        function Create(project) {
            console.log('ProjectService.Create()');
            return $http.post(baseUrl + '/api01/project/', project).then(handleSuccess, handleError('Error creating project'));
        }

        function DeleteProject(p_id) {
            console.log('ProjectService.DeleteProject()');
            return $http.delete(baseUrl + '/api01/project/' + p_id + '/').then(handleSuccess, handleError('Error deleting project'));
        }

        function InsertData(p_id, file) {
            console.log('ProjectService.InsertData()');
            var fd = new FormData();
            fd.append('data', file);
            return $http.put(baseUrl + '/api01/project/' + p_id + '/', fd,
                {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .then(handleSuccess, handleError('Error updating project'));
        }

        function Update(p_id, new_data) {
            console.log('ProjectService.Update()');
            return $http.put(baseUrl + '/api01/project/' + p_id + '/', new_data).then(handleSuccess, handleError('Error updating project'));
        }


        function GetAll() {
            console.log('ProjectService.GetAll()');
            return $http.get(baseUrl + '/api01/projects/').then(handleSuccess, handleError('Error getting all projects'));
        }

        function GetMyJudges(p_id) {
            console.log('ProjectService.GetMyJudges()');
            return $http.get(baseUrl + '/api01/users/' + p_id + '/').then(handleSuccess, handleError('Error getting my judges'));
        }

        function GetAllByUser(u_id) {
            console.log('ProjectService.GetAllByUser()');
            return $http.get(baseUrl + '/api01/projects/' + u_id + '/').then(handleSuccess, handleError('Error getting all users projects'));
        }

        function GetById(p_id) {
            console.log('ProjectService.GetById()');
            return $http.get(baseUrl + '/api01/project/' + p_id + '/').then(handleSuccess, handleError('Error getting project by id'));
        }

        function AddUser(u_id) {
            console.log('ProjectService.AddUser()');
            return $http.put(baseUrl + '/api01/projects/' + project.id, action).then(handleSuccess, handleError('Error updating project'));
        }

        function RemoveUser(u_id) {
            console.log('ProjectService.RemoveUser()');
            return $http.put(baseUrl + '/api01/projects/' + project.id, action).then(handleSuccess, handleError('Error updating project'));
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
