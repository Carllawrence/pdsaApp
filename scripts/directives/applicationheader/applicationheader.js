'use strict';
/**
 *Header
 */
angular.module('starsApp')
	.directive('applicationheader',function(){
		return {
        templateUrl:'scripts/directives/applicationheader/applicationheader.html',
        restrict: 'E',
        replace: true,
		
		controller: function ($scope, $window, $rootScope) {
  var win = angular.element($window);

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

      
        $scope.$watch(
          function () {
            return $window.innerWidth;
          },
          function (value) {
            $scope.windowWidth = value;
            if (value < 768) {
             
              $scope.collapseApp = true;
              document.getElementById("mySidenavApp").style.width = "0";
             
            
            } else {
              document.getElementById("mySidenavApp").style.width = "250px";
            
              $scope.collapseApp = false;
              
            }
          },
          true
        );

        win.bind('resize', function () {
          $scope.$apply();
        });

        win.bind("scroll", function () {
          $scope.$apply();
        })


        $scope.check = function () {
          if ($scope.collapseApp) {
            $scope.closeNavApp();
          }
        }

        $scope.closeNavApp = function () {
          document.getElementById("mySidenavApp").style.width = "0";
      
          $scope.sideNavOpen = false;
        }

        $scope.openNavApp = function () {
          $scope.sideNavOpenApp = true;
            document.getElementById("mySidenavApp").style.width = "250px";
        };
    	}		      
		}
	});


