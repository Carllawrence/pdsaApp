angular.module('starsApp').factory('User', function ($resource) {
    return $resource('http://192.168.8.100/api/appusers/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });