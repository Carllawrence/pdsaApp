angular.module('starsApp').factory('Grade', function ($resource) {
    return $resource('http://192.168.8.100/api/grades/:gradeId', {
      gradeId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

