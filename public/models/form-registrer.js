coreModule.factory('formRegistrer', function ($http, $q, $timeout) {

    var factory = {
        var user = false;
        sendForm : function($form){
            var deferred = $q.defer();

            if(factory.products !== false){
                deferred.resolve(factory.products);
            }
            else{
                var req = {
                    method: 'POST',
                    url: '/api/forms/create',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: $form
                };
                $http(req)
                    .success(function(data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        if(data.result = 'Success'){
                            $timeout(function(){                                
                                deferred.resolve(factory.products);
                            }, 1000);
                        }

                        console.log('success');
                    })
                    .error(function(data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log('error');
                        deferred.reject('Impossible to registrer form on server');
                    });
            }
            return deferred.promise;
        },
    };
    return factory;
});