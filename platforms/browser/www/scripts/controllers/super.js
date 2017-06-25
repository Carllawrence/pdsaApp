'use strict';
/**
 * superController for superuser state
 */
angular.module('starsApp')
  .controller('superController', function ($scope, $uibModal, $state, Notice, $http, $stateParams, AuthService, $timeout, User) {
    $scope.users = [];

    $scope.getUsers = function () {
      User.query(function (response) {
        $scope.users = response;

      });
    };

    $scope.getUsers();

     $scope.update = function () {
      Notice.query(function (result) {

        $scope.notices = result;
      });
    }

    $scope.update();

    var $ctrl = this;
    $scope.open = function (template, size, id, username) {
      $uibModal.open({
        animation: $ctrl.animationsEnabled,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        templateUrl: template,
        size: size,
        controller: function ($scope, $uibModalInstance, $timeout, Upload, User, $state) {

              $scope.notify = function (notify) {

      var newNotice = new Notice(notify);
      newNotice.$save();
      $scope.notify = '';
         $scope.close();
       $state.reload();
    }

    // remove notice
    $scope.removeNotice = function () {
            $http.delete('/api/notices/' + id).then(function () {
               $scope.close();
              $state.reload();
            });
          };

          $scope.username = username;
          $scope.close = function () {
            $uibModalInstance.close('close');
          };
   $scope.progressPercentage = 0;
                $scope.addUser = function (newu, file) {
            if ($scope.form.file.$valid && $scope.file) {
              $scope.upload(newu, file);
            }
          };

          // upload on file select or drop
          $scope.upload = function (newu, file) {
            console.log(file);
            Upload.upload({
              url: '/upload/',
              data: { file: file }
            }).then(function (resp) {
              console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);

               var newUser = new User({
              firstname: newu.firstname,
              lastname: newu.lastname,
              username: newu.email,
              email: newu.email,
              password: newu.password,
              telephone: newu.telephone,
              department: newu.department.DEPARTMENT,
              picUrl: resp.config.data.file.name,
              status: newu.status
            });
            newUser.$save();
          
            

            }, function (resp) {
              console.log('Error status: ' + resp.status);
            }, function (evt) {
              $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

              console.log('progress: ' + $scope.progressPercentage + '% ' + evt.config.data.file.name);

              if ($scope.progressPercentage == 100) {
                   $scope.newUser = '';

                $timeout(function () {
             
            $scope.close();
             $state.reload();
                }, 1000);


              }
            });
          };

          $scope.removeUser = function () {
            $http.delete('/api/appusers/' + id).then(function () {
              $state.reload();
            });
          };
        }

      })

    }


    $http.get('/api/sysmessages/').then(function (result) {
      $scope.sysMessages = result.data;
    });

   



    $scope.saveNotice = function (data, id) {
      angular.extend(data, { id: id });
      $http.put('/api/notices/' + id, data);
    };



    // remove user locally and remotely


    $scope.saveUser = function (data, id) {
      angular.extend(data, { id: id });
      $http.put('/api/appusers/' + id, data);
    };


  });

  