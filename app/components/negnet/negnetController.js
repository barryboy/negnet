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
            var utts = [];
            var id_map = [];
            var n = 0;
            for (var i = 0;i<resp.length; i++) {
                var chars = resp[i].content.split("");
                var chars_table = [];
                for (var j = 0; j<chars.length; j++) {
                    var ch = {
                        abs_id: n,
                        index: j + 1,
                        character: chars[j],
                        selected: false
                    }
                    n++;
                    chars_table.push(ch);
                    id_map.push({
                        uid: i,
                        cid: j
                    })
                }
                var u = {
                    index: i + 1,
                    utt_id: resp[i].utt_id,
                    step: resp[i].step,
                    party: resp[i].party,
                    content: chars_table
                }
                utts.push(u);
            }
            vm.utterances = utts;
            vm.id_map = id_map;
            $log.info(vm.id_map);
        });

        vm.simulateQuery = false;
        vm.isDisabled    = false;

        // list of `state` value/display objects
        vm.nodes        = loadAll();
        $log.info('Zaladowalem nazwy wezlow')
        vm.querySearch   = querySearch;

        vm.highlight = function highlight(selected) {
            if (selected) {
                return {'font-weight': 'bolder', 'color': 'red'};
            } else {
                return {'font-weight': 'normal', 'color': 'black'};
            }
        }

        var selecting = false;
        var processing  = false;
        vm.text_selected = false;
        var start_index = -1;

        vm.start_selecting = function($event) {
            selecting = true;
            start_index = $event.currentTarget.id;
        }

        vm.toggle_selecting = function($event) {
            if (!selecting) {
                selecting = true;
                start_index = Number($event.currentTarget.id);
            } else {
                selecting = false;
            }
        }

        vm.finish_selecting = function() {
            selecting = false;
            $log.info(vm.getSelectedText())
        }

        vm.getSelectedText = function() {
            if (from != to) {
                var selected_chars = [];
                for (var i = from; i < to; i++){
                    var ch = vm.id_map[i];
                    selected_chars.push(vm.utterances[ch.uid].content[ch.cid].character);
                }
                vm.text_selected = true;
                return selected_chars.join("");
            } else {
                return false;
            }
        }

        vm.reset_all_highlight = function() {
            vm.reset_highlight(0, vm.id_map.length)
            vm.text_selected = false;
        }

        vm.reset_highlight = function(from, to){
            for (var i = from; i < to; i++){
                var ch = vm.id_map[i];
                vm.utterances[ch.uid].content[ch.cid].selected = false;
            }
        }

        var from;
        var to;
        var past_from = 0;
        var past_to = 0;

        vm.touchChar = function($event) {
            if(selecting && !processing) {
                processing = true;
                vm.reset_highlight(past_from, past_to);
                var ct = $event.currentTarget;
                var id = Number(ct.id);
                if (id > start_index) {
                    from = start_index;
                    to = id;
                } else {
                    from = id;
                    to = start_index;
                }
                past_from = from;
                past_to = to;
                for (var i = from; i < to; i++){
                    var ch = vm.id_map[i];
                    vm.utterances[ch.uid].content[ch.cid].selected = true;
                }
                //$log.info("start: " + start_index + ", id: " + id  +", from: " + from + ", to: " + to);
                processing = false;
            }
        }

        vm.addNode = function addNode(node) {
            alert("Create new node: " + node);
        }
        vm.addLink = function addLink(node1, node2) {
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
