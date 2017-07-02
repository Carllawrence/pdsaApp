angular.module('starsApp').factory('Application', function ($resource) {
    return $resource('http://192.168.8.100/api/applications/:userid', {
      userid: '@userid'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  });

  angular.module('starsApp').factory('newApp', function ($resource) {
    return $resource('http://192.168.8.100/api/applications/:applicationId', {
      applicationId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  });
