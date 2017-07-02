angular.module('starsApp').factory('Payslip', function ($resource) {
    return $resource('http://192.168.8.100/api/admin/payslips/:payslipId', {
      payslipId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

