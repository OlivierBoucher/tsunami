coreModule.controller('indexCtrl', function($scope, $http, $timeout, $document, $window, $location, $anchorScroll){
  $scope.alerts = [];
  $scope.subbed = false;
  $scope.isCollapsed = true;
  $scope.boundingValue =0;
  $scope.scrollValue = 0;
  $scope.showText = false;
  $scope.conceptCollapsed = true;
  $scope.today = function() {
   $scope.dt = new Date();
 };
 $scope.today();

 $scope.clear = function () {
   $scope.dt = null;
 };

 $scope.toggleMin = function() {
   $scope.minDate = $scope.minDate ? null : new Date(1900,1,1);
 };
 $scope.toggleMin();

 $scope.open = function($event) {
   $event.preventDefault();
   $event.stopPropagation();

   $scope.opened = true;
 };

 $scope.dateOptions = {
   formatYear: 'yyyy',
   startingDay: 1,
   showWeeks: false,
   showButtonBar : false
 };

 $scope.formats = ['dd MMMM yyyy', 'dd.MM.yyyy'];
 $scope.format = $scope.formats[0];

 $scope.addAlert = function(type, message) {
  var alert = {type : type, message: message};
  console.log(alert.type);
  console.log(alert.message);
  console.log('Adding alert: ' + alert);
  $scope.alerts.push(alert);
  
  $timeout(function() {
    console.log('Removing alert: ' + alert);
    $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
  }, 5000);
};

$scope.save = function() {
 $scope.$broadcast('show-errors-check-validity');
 console.log("hitted save");
 if(!$scope.subbed){
   if ($scope.form.$valid) {
     var req = {
      method: 'POST',
      url: '/api/forms/create',
      headers: {
        'Content-Type': 'application/json'
      },
      data: $scope.form
    };
    $http(req)
    .success(function(data, status, headers, config) {
     if(data.result = 'Success'){
      $scope.subbed = true;
      $scope.addAlert('success', 'Merci, plus d\' informations vous ont été acheminées par courriel.');
    }
  })
    .error(function(data, status, headers, config) {
      console.log('danger');
      $scope.addAlert('danger', 'Un erreur est survenu lors du traitement de la demande, veuillez réessayer');
    });
  }
}
else{
  $scope.addAlert('danger', 'Vous avez déjà envoyé un formulaire d\' inscription');
}
}
  // Carousel
  $scope.myInterval = 5000;
  var slides = $scope.slides = [];
  $scope.addSlide = function() {
    var newWidth = 900 + slides.length + 1;
    slides.push({
      image: 'http://placekitten.com/' + newWidth + '/300',
      text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
      ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
    });
  };
  for (var i=0; i<4; i++) {
    $scope.addSlide();
  }
  $document.on('scroll', function(){
    var scrollStart = angular.element(document.getElementById('scrollStart'));
    $scope.showText = scrollStart[0].getBoundingClientRect().top - $window.innerHeight < 0;
    $scope.$apply();
  });
  $scope.scrollTo = function(id){
    console.log(id);
    $location.hash(id);
    $anchorScroll();
  }
});