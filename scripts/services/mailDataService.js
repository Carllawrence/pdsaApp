angular.module('starsApp').factory('Mail', function ($resource) {
    return $resource('http://192.168.8.100/api/mails/:mailId', {
      mailId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

