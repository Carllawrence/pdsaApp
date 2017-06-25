angular.module('starsApp').factory('Schedule', function ($resource) {
    return $resource('http://192.168.8.100/api/schedules/:scheduleId', {
      scheduleId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

