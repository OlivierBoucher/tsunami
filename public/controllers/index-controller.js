coreModule.controller('indexCtrl', function($scope){
    $scope.title = "testTitle";

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

  	$scope.save = function() {
	  $scope.$broadcast('show-errors-check-validity');
	  console.log("hitted save");

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
	            	console.log("Success");
            })
            .error(function(data, status, headers, config) {
                console.log('error');
        });
	  }
	}
});