'use strict';

/**
*header notification 
 */
angular.module('starsApp')
	.directive('headerNotification',function(){
		return {
        templateUrl:'scripts/directives/header/header-notification/header-notification.html',
        restrict: 'E',
        replace: true,
        
      controller:function($scope, Notice, $filter, Mail, $rootScope){

                    
        switch ($rootScope.currentUser.status) {
                case 0:
                    $scope.headermenus = [{"name":"My Profile", "url":"dashboard.userProfile", "icon":"user"},
                
                  {"name":"Change Password","url":"dashboard.changepass", "icon":"lock"},
                  {"name":"Logout","url":"logout", "icon":"unlock"}];
                  break;
                  case 1:
                    $scope.headermenus = [{"name":"My Profile", "url":"dashboard.userProfile", "icon":"user"},
                  {"name":"Personal Settings","url":"dashboard.Settings", "icon":"gear"},
                  {"name":"Change Password","url":"dashboard.changepass", "icon":"lock"},
                  {"name":"Logout","url":"logout", "icon":"sign-out"}];
                  break;
                   case 2:
                    $scope.headermenus = [{"name":"My Profile", "url":"dashboard.userProfile", "icon":"user"},
                  {"name":"Personal Settings","url":"dashboard.Settings", "icon":"gear"},
                  {"name":"Change Password","url":"dashboard.changepass", "icon":"lock"},
                  {"name":"Logout","url":"logout", "icon":"sign-out"}];
                  break;
                case 3:
                  $scope.headermenus = [{"name":"My Profile", "url":"dashboard.userProfile", "icon":"user"},
                  {"name":"Personal Settings","url":"dashboard.Settings", "icon":"gear"},
                  {"name":"Change Password","url":"dashboard.changepass", "icon":"lock"},
                  {"name":"Logout","url":"logout", "icon":"unlock"}];
                  break;
                   case 4:
                    $scope.headermenus = [{"name":"My Profile", "url":"dashboard.userProfile", "icon":"user"},
                  {"name":"Personal Settings","url":"dashboard.Settings", "icon":"gear"},
                  {"name":"Change Password","url":"dashboard.changepass", "icon":"lock"},
                  {"name":"Logout","url":"logout", "icon":"sign-out"}];
                  break;
                case 5:
                  $scope.headermenus = [{"name":"Change Password","url":"dashboard.changepass", "icon":"lock"},
                  {"name":"Logout","url":"logout", "icon":"sign-out"}];
              }
          }
	}
	});



        