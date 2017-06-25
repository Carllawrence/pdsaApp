angular.module('starsApp').factory('Course', function ($resource) {
    return $resource('http://192.168.8.100/api/courses/:courseId', {
      courseId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

