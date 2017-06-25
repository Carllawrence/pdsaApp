angular.module('starsApp').factory('Event', function ($resource) {
    return $resource('http://192.168.8.100/api/events/:eventId', {
      eventId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });