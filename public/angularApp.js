var coreModule = angular.module('coreModule', ['ngRoute', 'ngAnimate','ui.bootstrap', 'ui.bootstrap.showErrors'])
.directive('datepickerPopup', function (){
    return {
        restrict: 'EAC',
        require: 'ngModel',
        link: function(scope, element, attr, controller) {
      //remove the default formatter from the input directive to prevent conflict
      controller.$formatters.shift();
  }
}
});
coreModule.config(function($routeProvider){
    $routeProvider
        .when('/', {templateUrl: '/views/index.html', controller: 'indexCtrl'})
        .otherwise({redirectTo : '/views/404.html'});
});