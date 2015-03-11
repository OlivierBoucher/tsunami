var coreModule = angular.module('coreModule', ['ngRoute', 'ngAnimate', 'timer', 'ui.bootstrap', 'ui.bootstrap.showErrors', 'angularFileUpload'])
.directive('datepickerPopup', function (){
    return {
        restrict: 'EAC',
        require: 'ngModel',
        link: function(scope, element, attr, controller) {
      //remove the default formatter from the input directive to prevent conflict
      controller.$formatters.shift();
  }
}
})
.directive('disableNgAnimate', ['$animate', function($animate) {
  return {
    restrict: 'A',
    link: function(scope, element) {
      $animate.enabled(false, element);
    }
  };
}]);
coreModule.config(function($routeProvider){
    $routeProvider
        .when('/', {templateUrl: '/views/index.html', controller: 'indexCtrl'})
        .when('/profile/:formId', {templateUrl: '/views/registration.html', controller: 'registrationCtrl'})
        .otherwise({redirectTo : '/views/404.html'});
});