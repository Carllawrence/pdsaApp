'use strict';
/**
 * superController for superuser state
 */
angular.module('starsApp')
  .controller('AdminController', function ($scope, $state, $filter, $http,$stateParams, AuthService, $timeout,User) {
$scope.users =[];

  // create a new user locally save it remotely
    $scope.addStudent = function (newu) {
      var newStudent = new User({
        firstname: newu.firstname,
        lastname: newu.lastname,
        username: newu.email,
        email: newu.email,
        password: newu.password,
        telephone: newu.telephone,
        department: newu.department,
        picUrl:'userprofile.png',
        status: newu.status
      });
      newStudent.$save();
      $scope.users.unshift(newUser);
      $scope.newUser = '';
    };
    // remove user locally and remotely
    $scope.removeUser = function (id) {
      $scope.users[id].$remove();
      $scope.users.splice(id, 1);
     };
   
    $scope.saveUser = function (data,id) {
      angular.extend(data, {id: id});
   $http.put('/user/appusers/'+id, data);
    };

 
 User.query(function(response) {

        var  studentuser = $filter('filter')(response, {status: (1 && 2)});
            $scope.users = studentuser;
      });
   
  });