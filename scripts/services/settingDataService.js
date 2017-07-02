angular.module('starsApp').factory('Setting', function ($resource) {
    return $resource('http://192.168.8.100/api/settings/:settingId', {
      settingId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

 