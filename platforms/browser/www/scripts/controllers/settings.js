'use strict';
/**
 * superController for superuser state
 */
angular.module('starsApp')
  .controller('SettingsController', function ($rootScope, $stateParams, $uibModal, $scope, $state, $http, $timeout, Setting) {

    var id = $stateParams.settingId;

$scope.opened = {};



  $scope.dateOptions = {
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

	$scope.open = function($event, elementOpened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened[elementOpened] = !$scope.opened[elementOpened];
	};

Setting.query( function (result) {
        $scope.settings = result;
      });  

      if(id){

        Setting.get({settingId:id}, function(result){

          $scope.currentSettings = result;
        })
      }

       $scope.updateSettings = function(settings) {
         console.log(settings);
  Setting.update(settings);
};


    var $ctrl = this;
    $scope.openSetting = function (template, size, id, title) {
      $uibModal.open({
        animation: $ctrl.animationsEnabled,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        keyboard: false,
        backdrop: false,
        templateUrl: template,
        size: size,
        controller: function ($scope, $uibModalInstance, Setting, $timeout, $http, $sce, $state) {

          $scope.settingTitle = title;

            $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

   $scope.popup3 = {
    opened: false
  };

  $scope.popup4 = {
    opened: false
  };

  $scope.open3 = function() {
    $scope.popup3.opened = true;
  };

  $scope.open4 = function() {
    $scope.popup4.opened = true;
  };

   $scope.popup5 = {
    opened: false
  };

  $scope.popup6 = {
    opened: false
  };

  $scope.open5 = function() {
    $scope.popup5.opened = true;
  };

  $scope.open6 = function() {
    $scope.popup6.opened = true;
  };

          $scope.close = function () {
            $uibModalInstance.close('close');
          };

          $scope.removeSetting = function () {
            $http.delete('/api/settings/' + id).then(function (Response) {
              console.log(Response);

              $scope.close();
              $state.go('dashboard.settings')
            });

          };
                        
          $scope.submit = function (setting) {
                                                                        
            var newSetting = new Setting({
              schoolYear:setting.schoolYear,  
  startDate:setting.startDate, 
  endDate:setting.endDate, 
  regStart: setting.regStart, 
  regEnd:setting.regEnd,
  regFee: setting.regFee,
semesterStart: setting.semesterStart,
semesterEnd: setting.semesterEnd
            });
            newSetting.$save().then(function (Response) {
              $scope.setting = '';
              $scope.close();
              $state.reload();

            });

          };

         
        }

      })

    }

  });