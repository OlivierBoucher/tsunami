var coreModule = angular.module('coreModule', ['ngRoute', 'ui.bootstrap']);
coreModule.config(function($routeProvider){
    $routeProvider
        .when('/', {templateUrl: '/views/index.html', controller: 'indexCtrl'})
        .otherwise({redirectTo : '/views/404.html'});
});