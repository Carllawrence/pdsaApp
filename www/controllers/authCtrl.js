app.controller('RegistrationController',
  ['$scope', 'Authentication', '$http', '$timeout',
  function ($scope, Authentication, $http, $timeout) {

       $scope.login = function () {
          Authentication.login($scope.user);

      }; //login

      $scope.logout = function () {
          Authentication.logout();
      }; //logout

      $scope.register = function () {
          Authentication.register($scope.user, $scope.selected);
      }; // register

      $scope.resetPassword = function () {
          Authentication.resetPassword($scope.user);
      }; // reset password

      $scope.changePassword = function () {
          Authentication.changePassword($scope.user);
      }; // reset password

  } ]);   // Controller