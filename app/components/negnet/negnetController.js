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
                                'NodeService',
                                '$mdPanel',
                                '$route',
                                '$timeout',
                                '$q',
                                '$log',
                                '$rootScope',
                                '$compile'];


    function NegNetController(SessionService, ProjectService, UtteranceService,
        SelectionService, UserService, NodeService, $mdPanel, $route, $timeout, $q, $log,
        $rootScope, $compile) {
        var vm = this;
        $log.info('Zaladowalem ' + vm.constructor.name);

        //var $ = function (selector) {
        //    return angular.element(document.getElementById(selector));
        //};

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
                        selected: false,
                        node: false,
                        link: false
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
            vm.utterances_blank = utts;
            $log.info("Załadowałem wypowiedzi");
            vm.id_map = id_map;
            $log.info("Załadowałem tablicę indeksów");
        }).then(function() {
            updateSelections();
        });

        function updateSelections() {
            vm.selections = [];
            vm.utterances = vm.utterances_blank;
            SelectionService.GetByProject(vm.p_id).then(function(sel){
                for (var i=0; i<sel.length; i++){
                    var s = sel[i];
                    var selection = {
                        start: s.abs_start_pos,
                        end: s.abs_end_pos,
                        type: s.type
                    }
                    $log.info(selection);

                    for (var j=selection.start; j<selection.end+1; j++) {
                        var id = vm.id_map[j];
                        var ch = vm.utterances[id.uid].content[id.cid]
                        if (selection.type == "node") {
                            ch.node = true;
                        } else if (selection.type == "link") {
                            ch.link = true;
                        }
                    }
                    vm.selections.push(selection);
                }
            $log.info(vm.selections);
            })
        };


        vm.simulateQuery = false;
        vm.isDisabled    = false;


        vm.querySearch   = querySearch;

        vm.stylize = function stylize(ch) {
            var selected = (ch.selected ? 4 : 0);
            var node = (ch.node ? 1 : 0);
            var link = (ch.link ? 2 : 0);
            var style = selected + node + link;
            switch (style) {
                case 0: return {'font-weight': 'normal', 'color': 'black', 'background-color': 'transparent'};
                case 1: return {'font-weight': 'normal', 'color': 'black', 'background-color': '#ffff00'};
                case 2: return {'font-weight': 'normal', 'color': 'black', 'background-color': '#00ff00'};
                case 3: return {'font-weight': 'normal', 'color': 'black', 'background-color': '#99cc33'};
                case 4: return {'font-weight': 'normal', 'color': 'red', 'background-color': 'transparent'};
                case 5: return {'font-weight': 'normal', 'color': 'red', 'background-color': '#ffff00'};
                case 6: return {'font-weight': 'normal', 'color': 'red', 'background-color': '#00ff00'};
                case 7: return {'font-weight': 'normal', 'color': 'red', 'background-color': '#99cc33'};
                default: return {'font-weight': 'normal', 'color': 'black', 'background-color': 'transparent'};
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
            if (selecting) {
                selecting = false;
                vm.text_selected = true;
                loadNodeNames();
            }
        }

        vm.getSelectedText = function() {
            if (from != to) {
                var selected_chars = [];
                for (var i = from; i < to; i++){
                    var ch = vm.id_map[i];
                    selected_chars.push(vm.utterances[ch.uid].content[ch.cid].character);
                }
                return selected_chars.join("");
            } else {
                return false;
            }
        }

        vm.getSelectionBounds = function() {
            if (from != to) {
                var start_char = vm.id_map[from];
                var end_char = vm.id_map[to];
                var bounds = {start_utt_id: vm.utterances[start_char.uid].utt_id,
                    end_utt_id: vm.utterances[end_char.uid].utt_id,
                    start_pos: start_char.cid,
                    end_pos: end_char.cid,
                    abs_start_pos: from,
                    abs_end_pos: to};
                return bounds;
            } else {
                return null;
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
            var selection = vm.getSelectionBounds();
            selection.p_id = vm.p_id;
            selection.type = "node";
            selection.name = node;
            selection.comment = "";
            selection.u_id = SessionService.getUserId();
            vm.searchNodeName = "";
            vm.reset_all_highlight();
            SelectionService.Create(selection)
                .then(function(response) {
                    updateSelections();
                    $log.info(response);
                })
        }

        vm.addLink = function addLink(node1, node2) {
            //alert("Create new from " + node1 + " to " + node2 + ".");
            var selection = vm.getSelectionBounds();
            selection.p_id = vm.p_id;
            selection.type = "link";
            selection.name = "";
            selection.comment = "";
            selection.node_from = node1;
            selection.node_to = node2;
            selection.u_id = SessionService.getUserId();
            vm.searchStartNode = "";
            vm.searchEndNode = "";
            vm.reset_all_highlight();
            SelectionService.Create(selection)
                .then(function(response) {
                    updateSelections();
                    $log.info(response);
                })
        }

        // ******************************
        // Internal methods
        // ******************************

        function loadNodeNames(){
            vm.nodes        = loadAll();
            $log.info('Zaladowalem nazwy wezlow:')
            $log.info(vm.nodes);
        }

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
            var nodesList = [];
            var unique = {};
            NodeService.GetAllByProject(vm.p_id).then(function(resp){
                for (var i in resp){
                    name = resp[i].name;
                    if (!unique[name]) {
                        var node = {
                            value: name,
                            display: name
                        }
                    nodesList.push(node);
                    unique[name] = true;
                    }
                }
                $log.info("Wczytałem listę nazw węzłów:");
                $log.info(nodesList);
            });
            return nodesList;
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
