'use strict';
/**
 * superController for superuser state
 */
angular.module('starsApp')
  .controller('ManageApplicationsController', function ($rootScope,$uibModal, $stateParams, $filter, Upload, $scope, $state, $http, AuthService, $timeout, Application, filterFilter, $location) {

 $scope.appIndex = $stateParams.appIndex;
$scope.submenu = "submenu";

 $http.get('api/payslips').then( function(result){
 	$scope.payslips = result.data;
 })

  Application.query(function(result){

$scope.allApplications = result; 

var approvedApps = $filter('filter')(result, {status:6});
var submittedApps = $filter('filter')(result, {status:4});


 $scope.labels = ["All", "Submitted", "Approved"];
  $scope.data = [result.length, submittedApps.length, approvedApps.length,0]; 

  });

Application.query($scope.appIndex, function(response){
 
      $scope.application = response[$scope.appIndex];
     
});
 

  var $ctrl = this;
    $scope.open = function (template, size, userId, appid, name) {
      $uibModal.open({
        animation: $ctrl.animationsEnabled,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        keyboard: false,
        backdrop: false,
        templateUrl: template,
        size: size,
        controller: function ($scope, $uibModalInstance, Course, $timeout, $http, $sce, $state) {

      $scope.applicantName = name;



          $scope.close = function () {
            $uibModalInstance.close('close');
          };

$scope.decision = function(decision){

	console.log(userId, appid, decision.code, decision.comments);

	if(decision.code == 1) {

	$http.put('/api/appusers/'+ userId, {decision: decision.code}); 

	$http.put('/api/applications/'+ userId, {userid: userId, status:6, decision: decision.code, comments: decision.comments, approver: $rootScope.currentUser.username}); 
	
	} else if(decision.code == 3) {

		$http.put('/api/applications/'+ userId, {userid: userId, status:5, decision: decision.code, comments: decision.comments, approver: $rootScope.currentUser.username}); 
	}

	
   $timeout(function() {
	   $scope.close();

$state.go('dashboard.applications');
}, 1000);
}

		}

	  });

	} 

  });