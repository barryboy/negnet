(function () {
    'use strict';

    angular
        .module('negnetApp')
        .filter('spanWrap', function($sce) {
            return function(content, parentID) {
                var chars = content.split("")
                for(var i = 1; i < chars.length; i++) {
                    chars[i] = "<span id = " + parentID  + "___" + i  +  ">" + chars[i] + "</span>"
                }
                return $sce.trustAsHtml(chars.join(""))
            };
        })
})();
