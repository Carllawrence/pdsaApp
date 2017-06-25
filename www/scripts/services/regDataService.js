angular.module('starsApp').factory('Registration', function ($resource) {
    return $resource('http://192.168.8.100/api/Registrations/:registrationId', {
      registrationId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

