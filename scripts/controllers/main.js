'use strict';
/**
 * MainCtrl
 */
angular.module('starsApp')
  .controller('MainCtrl', function ($rootScope, Notice, Setting, $window, $uibModal, $filter, Event, User, Mail, $scope, $state, $http, AuthService) {


 $http.get('api/payslips').then( function(result){
    var  payments = $filter('filter')(result.data, {pie:$rootScope.currentUser.regNumber});
  var balance = 0;

  for (var i = 0; i < payments.length; i++) {
    var credit = payments[i].credit.replace(",",".");
 var balanceCredit = parseFloat(credit, 10);
      balance = balance + balanceCredit; 
  }

$scope.balance = balance;
 	$scope.payslips = payments;
 });

$scope.changeto = 'inbox';
    $scope.labels = ["Courses", "GPA", "Year"];
    $scope.data = [3, 5, 2];

    Notice.query(function (result) {

      $scope.notices = result;
      $rootScope.howManyNotices = result.length;
    });

    $scope.update = function () {

      Mail.query(function (response) {

        var inbox = $filter('filter')(response, { toid: $rootScope.currentUser._id });
        var sent = $filter('filter')(response, { fromid: $rootScope.currentUser._id });
        console.log(inbox, sent);
        $scope.inboxMails = inbox;
        $scope.sendMails = sent;
        $rootScope.howManyMsg = inbox.length;
        $rootScope.howManySentMsg = sent.length;
      });
    }


    $scope.update();

    $scope.deleteInboxMsg = function (index) {
      $scope.inboxMails[index].$delete();
      $scope.inboxMails.splice(index, 1);
      $scope.update();
    }




    User.query(function (response) {
      $scope.users = response;

    });

    Event.query(function (response) {

      $scope.events = response;
       $rootScope.howManyEvents = response.length;

    });

    var $ctrl = this;
    $scope.open = function (template, size, id) {
      $uibModal.open({
        animation: $ctrl.animationsEnabled,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        templateUrl: template,
        size: size,
        controller: function ($scope,$state, $rootScope, $uibModalInstance, Mail, User) {
          $scope.close = function () {
            $uibModalInstance.close('close');
          };
          User.query(function (response) {
            $scope.users = response;

          });


          $scope.change = function(change){
            $scope.changeto = change;
          }

          $scope.sendMessage = function (data) {
            console.log(data.to._id);

            var newMessage = new Mail({
              fromid: $rootScope.currentUser._id, toid: data.to._id, fromname: $rootScope.currentUser.firstname,
              toname: data.to.firstname, subject: data.subject, message: data.message
            })
            newMessage.$save(function (response) {
              $scope.mail = '';
              $scope.close();
              $state.reload();
            });
          }


        }

      })

    }

  });
