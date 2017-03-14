(function () {
    'use strict';

    angular
        .module('negnetApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['SessionService',
                                   'ProjectService',
                                   'UserService',
                                   '$mdDialog',
                                   '$route',
                                   '$rootScope'];
    function DashboardController(SessionService, ProjectService, UserService, $mdDialog, $route, $rootScope) {
        var vm = this;
        console.log('Zaladowalem ' + vm.constructor.name);
        vm.u_id = SessionService.getUserId();
        console.log('Pobieram u_id ' + vm.u_id);
        ProjectService.GetAllByUser(vm.u_id).then(function(resp){
            var projects = [];
            for (var i = 0; i < resp.length; i++) {
                projects.push(resp[i]);
            }
            $rootScope.my_projects = projects;
            vm.my_projects = projects;
            console.log('zaktualizowałem listę projektów: ' + vm.my_projects);
        });
        vm.project = {u_id: vm.u_id
                      ,name: ''
                      ,description: ''
        };

//CREATE PROJECT DIALOG

        vm.showCreateProjectDlg = function(e) {
            $mdDialog.show({
                controller: CreateProjectDialogController,
                controllerAs: 'createProjDlg',
                templateUrl: 'app/components/dashboard/project_create_dialog.html',
                parent: angular.element(document.body),
                targetEvent: e,
                clickOutsideToClose:true,
                locals: {
                    project: vm.project
                },
                bindToController: true
            })
            .then(function(projectData){
                ProjectService.Create(projectData)
                    .then(function(response){
                        ProjectService.InsertData(response.project.p_id
                            ,projectData.file);
                        $route.reload();
                    });
            })
        };

//MANAGE USERS DIALOG
        vm.showManageUsersDlg = function(e, p_id) {
            console.log('vm.showManageUserDlg()');
            $mdDialog.show({
                controller: ManageUsersDialogController,
                controllerAs: 'manageUsersDlg',
                templateUrl: 'app/components/dashboard/manage_users_dialog.html',
                parent: angular.element(document.body),
                targetEvent: e,
                clickOutsideToClose:true,
                locals: {
                    p_id: p_id
                },
                bindToController: true
            })
            .then(function(judgesData){
                console.log('manage judges');
                });
        };

//EDIT PROJECT DIALOG
        vm.showEditProjectDlg = function(e, p_id) {
            $mdDialog.show({
                controller: EditProjectDialogController,
                controllerAs: 'editProjDlg',
                templateUrl: 'app/components/dashboard/project_edit_dialog.html',
                parent: angular.element(document.body),
                targetEvent: e,
                clickOutsideToClose:true,
                locals: {
                    p_id: p_id
                },
                bindToController: true
            })
            .then(function(projectData){
                ProjectService.Update(p_id, projectData)
                    .then(function(response){
                        $route.reload();
                    });
            });
        };

//DELETE PROJECT BUTTON
        vm.deleteProject = function(e, p_id){
            ProjectService.Delete(p_id).then(function(resp){
                $route.reload();
            });
        }
    };

    function CreateProjectDialogController($mdDialog, $scope) {
        var vm = this;
        console.log('Zaladowalem ' + vm.constructor.name);
        vm.projectData = vm.project;

        vm.cancel = function() {
            $mdDialog.cancel();
        };

        vm.accept= function() {
            $scope.$watch('$scope.files.length',function(newVal,oldVal){
                vm.projectData.file = $scope.files[0].lfFile;
            });
            $mdDialog.hide(vm.projectData);
        };
    };


    function EditProjectDialogController($mdDialog, p_id, ProjectService) {
        var vm = this;
        console.log('Zaladowalem ' + vm.constructor.name);
        ProjectService.GetById(p_id).then(function(resp){
            vm.projectData = resp.project;
        });

        vm.cancel = function() {
            $mdDialog.cancel();
        };

        vm.accept= function() {
            vm.projectData.action = 'edit';
            $mdDialog.hide(vm.projectData);
        };
    };

    function ManageUsersDialogController($mdDialog, p_id, ProjectService, UserService) {
        var vm = this;
        console.log('Zaladowalem ' + vm.constructor.name);
        ProjectService.GetMyJudges(p_id).then(function(resp){
            vm.myJudges = resp;
        });
        UserService.GetAll().then(function(resp){
            vm.availableJudges = resp.data;
            vm.judgesData = {};
        });


        vm.cancel = function() {
            $mdDialog.cancel();
        };

        vm.accept= function() {
            $mdDialog.hide(vm.judgesData);
        };
    };
})();
