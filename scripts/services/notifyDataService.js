angular.module('starsApp').factory('Notice', function ($resource) {
    return $resource('http://192.168.8.100/api/notices/:noticeId', {
      noticeId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

