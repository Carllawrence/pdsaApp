angular.module('starsApp').factory('Video', function ($resource) {
    return $resource('http://192.168.8.100/api/videos/:videoId', {
      mailId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

