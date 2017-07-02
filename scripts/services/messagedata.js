angular.module('starsApp').factory('Message', function ($resource) {
    return $resource('http://192.168.8.100/api/messages/:messageId', {
      messageId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

