angular.module('starsApp').factory('Notify', function ($resource) {
    return $resource('http://192.168.8.100/api/notifications/:notifyId', {
      notifyId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

