coreModule.controller('registrationCtrl', function($scope, $http, $timeout, $routeParams, registrationSrvc, FileUploader){
	$scope.alerts = [];
	$scope.formId = $routeParams.formId;
	$scope.loading = true;
	$scope.uploader = new FileUploader();
	$scope.profile = registrationSrvc.getProfile($scope.formId).then(
		// Success
		function(profile){
			console.log(profile);
			$scope.loading = false;
			$scope.profile = profile;
			$scope.showAttachments = profile.attachments.length > 0;
			$scope.uploader.url = '/api/profile/'+ profile._id + '/upload';
			$scope.uploader.filters.push({
				name: 'imageFilter',
				fn: function(item /*{File|FileLikeObject}*/, options) {
					var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
					return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
				}
			});
		},
		// Error
		function(msg){

		}
		);
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
	$scope.saveProfile = function(){
		if($scope.uploader.queue.length > 0){
			$scope.uploader.uploadAll();
			//$scope.uploader.clearQueue();
		}
		var data = {
			portfolioLink: $scope.profile.portfolioLink,
			customMessage: $scope.profile.customMessage
		}
		var req = {
			method: 'POST',
			url: '/api/profile/'+$scope.profile._id+'/update',
			headers: {
				'Content-Type': 'application/json'
			},
			data: data
		};
		$http(req)
		.success(function(data, status, headers, config) {
			if(data.result = 'Success'){
				$scope.addAlert('success', data.message);
			}
			else{
				$scope.addAlert('danger', data.message);
			}
		})
		.error(function(data, status, headers, config) {
			$scope.addAlert('danger', 'Impossible d\'acheminer la requête');
		});
	}
});