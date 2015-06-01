coreModule.controller('indexCtrl', function($scope, $http, $timeout, $document, $window, $anchorScroll) {
    $scope.alerts = [];
    $scope.subbed = false;
    $scope.menuCollapsed = true;
    $scope.boundingValue = 0;
    $scope.scrollValue = 0;
    $scope.showText = false;
    $scope.conceptCollapsed = true;

    $scope.addAlert = function(type, message) {
        var alert = {
            type: type,
            message: message
        };
        $scope.alerts.push(alert);

        $timeout(function() {
            $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
        }, 5000);
    };

    $scope.save = function() {
        $scope.$broadcast('show-errors-check-validity');
        if (!$scope.subbed) {
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
                        if (data.result = 'Success') {
                            $scope.subbed = true;
                            $scope.addAlert('success', 'Merci, plus d\' informations vous ont été acheminées par courriel.');
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $scope.addAlert('danger', 'Un erreur est survenu lors du traitement de la demande, veuillez réessayer');
                    });
            }
        } else {
            $scope.addAlert('danger', 'Vous avez déjà envoyé un formulaire d\' inscription');
        }
    }
    $document.on('scroll', function() {
        var scrollStart = angular.element(document.getElementById('scrollStart'));
        $scope.showText = scrollStart[0].getBoundingClientRect().top - $window.innerHeight < 0;
        $scope.$apply();
    });
});