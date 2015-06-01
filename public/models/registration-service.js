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
                    if (data.result = 'Success') {
                        factory.profile = data.profile;
                        deferred.resolve(factory.profile);
                    }
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                    deferred.reject('Impossible de récupérer le profile');
                });
            return deferred.promise;
        }
    }
    return factory;
});