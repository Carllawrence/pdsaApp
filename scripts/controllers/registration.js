'use strict';
/**
 * superController for superuser state
 */
angular.module('starsApp')
  .controller('RegistrationsController', function ($rootScope,$window, $filter, Upload, Payslip, $scope, $state, $http, AuthService, $timeout,  User, filterFilter, $location) {

   $scope.$watch(function () {
          return $window.scrollY;
        }, function (scrollY) {
          console.log(scrollY);
          if (scrollY > 600) {
            $scope.scrolled = true;
          } else {
            $scope.scrolled = false;
          }
        });

        var w = angular.element($window);
              $scope.$watch(
          function () {
            return $window.innerWidth;
          },
          function (value) {
            $scope.windowWidth = value;
            if (value < 768) {
              $scope.isCollapsedHorizontal = false;
              $scope.collapse = true;
        
            } else {
            
              $scope.collapse = false;
              
            }
          },
          true
        );
      

        w.bind('resize', function () {
          $scope.$apply();
        });

        w.bind("scroll", function () {
          $scope.$apply();
        })


 

      $scope.register = function(){
        
	$http.put('http://192.168.8.100/api/appusers/'+ $rootScope.currentUser._id, {status:2, schoolYear:$rootScope.settings[0].schoolYear}).then(function(response){
console.log(response); 
 }); 


  $state.reload();
  $state.go('dashboard.student');

  console.log('student registered')
      }


 $scope.checkRegBal = function() {

$http.get('http://192.168.8.100/api/payslips/'+ $rootScope.currentUser.regNumber).then(function(result){

  $scope.payments = result.data;
  var balance = 0;

  for (var i = 0; i < result.data.length; i++) {
    var credit = result.data[i].credit.replace(",",".");
 var balanceCredit = parseFloat(credit, 10);
      balance = balance + balanceCredit; 
  }

if(balance >= 5000 &&  $rootScope.currentUser.status == 2){
  
        
}

$scope.balance = balance;
})

 }

 $scope.checkRegBal();


   });