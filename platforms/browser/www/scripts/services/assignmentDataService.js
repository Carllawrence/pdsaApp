angular.module('starsApp').factory('Assignment', function ($resource) {
    return $resource('http://192.168.8.100/api/assignments/:assignmentId', {
      assignmentId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

