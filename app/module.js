(function (){
    'use strict';

    angular
        .module('negnetApp', [
            'ngRoute',
            'ngAnimate',
            'ngMaterial',
            'ngMessages',
            'material.svgAssetsCache',
            'base64',
            'lfNgMdFileInput',
            'md.data.table',
            'anguFixedHeaderTable',
            'ngSanitize'
        ])
        .config(['$qProvider', function ($qProvider) {
            $qProvider.errorOnUnhandledRejections(false);
        }])
        .config(['$mdThemingProvider', function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('blue');
        }])
        .run(routeChangeWatch);


    function routeChangeWatch($rootScope, $window, $location) {
        $rootScope.$on( "$routeChangeStart", function( event, next, current ) {
            if (routeAllowed($location.path())){
                if ($window.sessionStorage.loggedInUser == null) {
                        $location.path("/chooser");
                }
            }
        });
    }

    function routeAllowed(route) {
        var allowed = ['/home', '/about', '/login', '/signup', '/chooser', '' ];
        return allowed.indexOf(route) < 0
    }


})();
