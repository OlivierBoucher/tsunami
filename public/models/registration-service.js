coreModule.factory('registrationSrvc', function($http, $q, $timeout) {

    var factory = {
        profile: false,

        getProfile: function(formId) {
            var deferred = $q.defer();
            var req = {
                method: 'POST',
                url: 'api/profile/' + formId,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    id: formId
                }
            };
            $http(req)
                .success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    if (data.result = 'Success') {
                        factory.profile = data.profile;
                        deferred.resolve(factory.profile);
                    }
                })
                .error(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log('error');
                    deferred.reject('Impossible de récupérer le profile');
                });
            return deferred.promise;
        }
    }
    return factory;
});
