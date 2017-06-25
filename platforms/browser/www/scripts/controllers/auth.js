// resetController for reseting password from email
angular.module('starsApp').controller('resetController',
  ['$scope', '$http', '$stateParams', '$location', '$state', 'AuthService',
    function ($scope, $http, $stateParams, $location, $state, AuthService) {
      //initialize for formData variable
      $scope.formData = {};
      //this will reset user password and sent them to login
      $http.get('api/reset/' + $stateParams.uuid).then(function (response) {
        $scope.formData.uuid = $stateParams.uuid;
        if (!response.data.success) {
          $state.go('login');
        }
      });
    }])

//login Controller 
angular.module('starsApp').controller('loginController',
  ['$scope', '$http', '$uibModal', '$rootScope', '$timeout', '$stateParams', '$location', '$state', 'AuthService',
    function ($scope, $http, $uibModal, $rootScope, $timeout, $stateParams, $location, $state, AuthService, Upload) {

      var $ctrl = this;
      $scope.open = function (template) {
        $uibModal.open({
          animation: $ctrl.animationsEnabled,
          ariaLabelledBy: 'modal-title-bottom',
          ariaDescribedBy: 'modal-body-bottom',
          templateUrl: template,
          size: 'lg',
          controller: function ($scope, $uibModalInstance) {

            $scope.close = function () {
              $uibModalInstance.close('close');
            };
          }
        });
      }


      $rootScope.loginError = '';

      if ($rootScope.currentUser) {

        $http.get('/assets/rwandaData.json').then(function (result) {
          $scope.rwandaAddress = result.data;
        });

        $scope.personalInfo = {
          address: {
            Province: $rootScope.currentUser.Province, District: $rootScope.currentUser.District, Sector: $rootScope.currentUser.Sector, Cellule: $rootScope.currentUser.Cellule,
            Village: $rootScope.currentUser.Village, telephone: $rootScope.currentUser.telephone
          }
        };

        $scope.saveUser = function (data) {

          console.log(data);

          $http.put('http://192.168.8.100/api/appusers/' + $rootScope.currentUser._id, data.address);
        };

      }
      //user login function
      $scope.login = function (username, password, rememberMe) {
        // call login api from authservice.js 
        AuthService.login(username, password, rememberMe)
          // handle success
          .then(function () {
            $rootScope.loginError = '';
            $scope.message = "Login successfull redirecting...";
            $timeout(function () {
              $scope.loginForm = {};

              $state.go('parent');

            }, 1000);


          })

      };


      //forgotten password function
      $scope.forgot = function () {
        //send associated user email address to api
        $http.post('http://192.168.8.100/api/forgot', $scope.formData).then(function (response) {
          if (response.data.success) {
            $scope.msg = 'Reset email sent';
            $timeout(function () {
              $state.go('login');
            }, 1000);
          } else {
            $scope.msg = 'User does not exist';
          }


        });
      };

      //reset password function
      $scope.reset = function (formData) {
        $scope.resetMsg = '';
        $http.post('http://192.168.8.100/api/reset/', {password:formData.password2, uuid:$stateParams.uuid}).then(function (response) {
          console.log(response);
          if (response.data.success) {
            $scope.formData = "";
            $scope.resetMsgSuccess = 'Password successfully reset!';
            $timeout(function () {
              $state.go('parent');
            }, 1000);
          } else {
            $scope.resetMsgFailed = "ERROR: cannot reset your password!";
          }
        });
      };

      //change password while logged in
      $scope.changepass = function (data) {

        $http.post('http://192.168.8.100/api/changepassword/', { password: data.password, username: $rootScope.currentUser.username })
          .then(function (response) {


            if (response.data.success == true) {
              $scope.changePass = null;
              $scope.changePassMsgSuccess = 'Password Changed';
              $timeout(function () { $state.go('parent'); }, 1000);

            } else {
              $scope.changePassMsgFail = "Password has not changed!";
              $scope.changePass = null;
            }
          });
      };

      //set default user picture is not file uploaded
      $scope.profileFilename = 'userprofile.png';

      //upload picture function
      $scope.uploadPic = function (file) {
        file.upload = Upload.upload({
          url: 'http://192.168.8.100/upload/',
          data: { file: file },
        });

        file.upload.then(function (response) {
          $timeout(function () {
            $scope.profileFilename = file.name;
            file.result = response.data;
          });
        }, function (response) {
          if (response.status > 0)
            $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
          // Math.min is to fix IE which reports 200% sometimes
          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
      }

      //register function
      $scope.register = function (username, firstname, lastname, password) {
        // initial values
        $scope.error = false;
        $scope.disabled = true;
        // call register from service 
        AuthService.register(username, password, firstname, lastname, $scope.profileFilename)
          // handle success
          .then(function () {

            $timeout(function () {

              $scope.registerForm = {};

              $state.go('parent');
            }, 1000);
          })

      };

    }]);

//logout Controller
angular.module('starsApp').controller('logoutController',
  ['$scope', '$location', '$state', 'AuthService',
    function ($scope, $location, $state, AuthService) {
      //access logout from AuthService
      AuthService.logout()
        .then(function () {
          $state.go('login');
        });
    }]);


