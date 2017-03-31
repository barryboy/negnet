(function () {
    'use strict';

    angular
        .module('negnetApp')
        .controller('NegNetController', NegNetController)
        .controller('PanelMenuCtrl', PanelMenuCtrl);

    NegNetController.$inject = ['SessionService',
                                'ProjectService',
                                'UtteranceService',
                                'SelectionService',
                                'UserService',
                                '$mdPanel',
                                '$route',
                                '$rootScope'];


    function NegNetController(SessionService, ProjectService, UtteranceService,
        SelectionService, UserService, $mdPanel, $route, $rootScope) {
        var vm = this;
        console.log('Zaladowalem ' + vm.constructor.name);

        vm.p_id = $rootScope.currentProject;

        ProjectService.GetById(vm.p_id).then(function(resp){
            vm.project = resp;
        });

        UtteranceService.GetAllByProject(vm.p_id).then(function(resp){
            vm.utterances = resp;
        });

        vm.startSelection = function(ev) {
            var target = angular.element(ev.target);
            vm.selection_start = target;
        };

        vm.getSelection = function(ev) {
            var target = angular.element(ev.target);
            var className = target.attr('class');
            if (className == 'selection') {
                console.log("Wybrano selekcję");
            } else {
                if (angular.equals(target, vm.selection_start)) {
                    var id = target.attr('id');
                    var selection = window.getSelection();
                    var start = selection.anchorOffset;
                    var end = selection.focusOffset;
                    var whole_txt = angular.element(target).text();
                    var selected_txt = selection.toString();
                    console.log(id + '\n' + whole_txt  + '\n'  + selected_txt + ' (' + start + ', ' + end + ')');
                } else {
                    console.log('selekcja musi odbywać się w obrębie jednej wypowiedzi');
                }
                if (selected_txt != ''){
                    vm.showSaveSelectionMenu(ev, id, whole_txt, start, end);
                }
            }
        };

        vm._mdPanel = $mdPanel;
        vm.nodes = ['node1', 'node2', 'node3', 'node4', 'node5', 'node6', 'node7', 'node8', 'node9', 'node10', 'node11', 'node12', 'node13', 'node14', 'node15', 'node16', 'node17', 'node18', 'node19', 'node20' ];
    }


    NegNetController.prototype.showSaveSelectionMenu = function(ev, id, whole_txt, start, end) {
        var position = this._mdPanel.newPanelPosition()
            .absolute()
            .center();

        var config = {
            attachTo: angular.element(document.body),
            controller: PanelMenuCtrl,
            controllerAs: 'ctrl',
            disableParentScroll: false,
            templateUrl: 'app/components/negnet/selection_dialog.html',
            hasBackdrop: true,
            panelClass: 'selection-dialog',
            position: position,
            locals: {
                content: whole_txt,
                start: start,
                end: end,
                id: id,
                type: 'Node',
                nodes: this.nodes,
                nodeName: '',
                startNode: '',
                endNode: '',
            },
            trapFocus: true,
            openFrom: ev,
            clickOutsideToClose: false,
            escapeToClose: true,
            focusOnOpen: true,
            zIndex: 150
        };

        this._mdPanel.open(config);
    };

    function PanelMenuCtrl(mdPanelRef) {
        this._mdPanelRef = mdPanelRef;
    };

    PanelMenuCtrl.prototype.closeDialog = function() {
        var panelRef = this._mdPanelRef;

        panelRef && panelRef.close().then(function() {
            panelRef.destroy();
        });
    };

    PanelMenuCtrl.prototype.saveSelection = function() {
        var panelRef = this._mdPanelRef;

        console.log(this.id + '\n'+ this.type + '\n'+ this.nodeName + '\n' + this.startNode + '\n' + this.endNode  + '(' + this.start + ', ' + this.end + ')');

        panelRef && panelRef.close().then(function() {
            panelRef.destroy();
        });
    };

    PanelMenuCtrl.prototype.checkInputFields = function() {
        if (this.type == 'Node'){
            if (this.nodeName == '') {
                return true;
            } else {
                return false;
            }
        } else if (this.type == 'Link'){
            if (this.startNode == '' && this.endNode == '') {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };


})();
