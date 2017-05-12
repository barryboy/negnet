(function () {
    'use strict';

    angular
        .module('negnetApp')
        .filter('trusted', function($sce) {
            return function(ss) {
                return $sce.trustAsHtml(ss)
            };
        })
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

        function isEmpty(obj) {
            return Object.keys(obj).length === 0;
        }

        vm.p_id = $rootScope.currentProject;

        ProjectService.GetById(vm.p_id).then(function(resp){
            vm.project = resp;
        });

        UtteranceService.GetAllByProject(vm.p_id).then(function(resp){
            vm.utterances = resp;
        });

        var selection_start = {};
        var selection_end = {};

        vm.selection = function(ev) {
            if (isEmpty(selection_start)){
                var selection = window.getSelection();
                selection_start.id = selection.anchorNode.parentElement.id;
                selection_start.position = selection.anchorOffset.valueOf();
                selection_start.content = selection.anchorNode.parentNode.textContent;
                selection_start.step = selection.anchorNode.parentElement.parentElement.children[0].textContent.valueOf();
//                console.log(selection);
            } else {
                var selection = window.getSelection();
                selection_end.id = selection.anchorNode.parentElement.id;
                selection_end.position = selection.anchorOffset.valueOf();
                selection_end.content = selection.anchorNode.parentNode.textContent;
                selection_end.step = selection.anchorNode.parentElement.parentElement.children[0].textContent.valueOf();
                if (selection_end.step < selection_start.step) {
                    console.log('end step musi być po start step');
                } else if (selection_end.step == selection_start.step & selection_end.position <= selection_start.position) {
                    console.log('end position musi być po start position');
                } else {
                    highlightSelection(selection_start, selection_end);
                    vm.showSaveSelectionMenu(ev, 'id', 'whole_txt', 1, 5);
                }
                selection_start = {};
            }

        };

        function highlightSelection(start, end) {
            //console.log(start.step + ', '  + start.position + ' -> ' + end.step + ', '  + end.position);
            var step1 = start.step - 1;
            var step2 = end.step - 1;
            var str1 = vm.utterances[step1].content;
            var str2 = vm.utterances[step2].content;
            var pos1 = start.position;
            var pos2 = end.position;
            var ins1 = '<span class="selection">'
            var ins2 = '</span>'
            if (start.step == end.step) {
                vm.utterances[step1].content = [str1.slice(0,pos1), ins1, str1.slice(pos1,pos2), ins2, str1.slice(pos2)].join('');
            } else {
                vm.utterances[step1].content = [str1.slice(0,pos1), ins1, str1.slice(pos1), ins2].join('');
                vm.utterances[step2].content = [ins1, str2.slice(0,pos2), ins2, str2.slice(pos2)].join('');
                if (step1 + 1 < step2){
                    var i = step1 + 1;
                    while (i < step2 ) {
                        var str = vm.utterances[i].content;
                        vm.utterances[i].content = [ins1, str, ins2].join('');
                        i++;
                    }
                }
            }
        }



        vm._mdPanel = $mdPanel;
        vm.nodes = ['pierwszy node', 'drugi node', 'trzeci', 'czwarty', 'piąty' ];
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
