(function () {
    'use strict';

    angular
        .module('negnetApp')
        .controller('NegNetController', NegNetController);

    NegNetController.$inject = ['SessionService',
                                'ProjectService',
                                'UtteranceService',
                                'SelectionService',
                                'UserService',
                                '$mdPanel',
                                '$route',
                                '$timeout',
                                '$q',
                                '$log',
                                '$rootScope',
                                '$compile'];


    function NegNetController(SessionService, ProjectService, UtteranceService,
        SelectionService, UserService, $mdPanel, $route, $timeout, $q, $log,
        $rootScope, $compile) {
        var vm = this;
        $log.info('Zaladowalem ' + vm.constructor.name);

        var $ = function (selector) {
            return angular.element(document.getElementById(selector));
        };

        vm.p_id = $rootScope.currentProject;

        ProjectService.GetById(vm.p_id).then(function(resp){
            vm.project = resp;
        });

        UtteranceService.GetAllByProject(vm.p_id).then(function(resp){
            vm.utterances = resp;
            vm.utterances_map = {};
            for (var i = 0; i < vm.utterances.length; i++) {
                var u = vm.utterances[i];
                var cell = $(u.utt_id+"_content");
                //var cell = $("workspace-main");
                var p = document.createElement('p');
                p.innerHTML = "dupa";
                $compile(p)
                cell.append(angular.element(p));
                $log.info(cell);
            }
        });

        vm.simulateQuery = false;
        vm.isDisabled    = false;

        // list of `state` value/display objects
        vm.nodes        = loadAll();
        $log.info('Zaladowalem nazwy wezlow')
        vm.querySearch   = querySearch;

        vm.touchChar = touchChar;
        function touchChar(ev) {
            $log.info(ev);
        }

        vm.addNode = addNode;
        function addNode(node) {
        alert("Create new node: " + node);
        }
        vm.addLink = addLink;
        function addLink(node1, node2) {
        alert("Create new from " + node1 + " to " + node2 + ".");
        }

        // ******************************
        // Internal methods
        // ******************************

        /**
        * Search for states... use $timeout to simulate
        * remote dataservice call.
        */
        function querySearch (query) {
        var results = query ? vm.nodes.filter( createFilterFor(query) ) : vm.nodes,
            deferred;
        if (vm.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
        }

        /**
        * Build `states` list of key/value pairs
        */
        function loadAll() {
        var allNodes = 'Node1, Node2, Node3, adsa, asdasd, werwer, ertryty, tyuytutyu ,werwerwkw, werwer, wrwerwer,vnvnbvb,sfsdf';

        return allNodes.split(/, +/g).map( function (node) {
            return {
            value: node.toLowerCase(),
            display: node
            };
        });
        }

        /**
        * Create filter function for a query string
        */
        function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(node) {
            return (node.value.indexOf(lowercaseQuery) === 0);
        };

    }
    }
})();
