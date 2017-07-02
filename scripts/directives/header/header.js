'use strict';
/**
 *Header
 */
angular.module('starsApp')
  .directive('header', function () {
    return {
      templateUrl: 'scripts/directives/header/header.html',
      restrict: 'E',
      replace: true,
      controller: function ($scope, $window, $rootScope) {


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
              document.getElementById("mySidenav").style.width = "0";
              document.getElementById("main").style.marginLeft = "0";
              $scope.sideNavOpen = false;
            } else {
              document.getElementById("mySidenav").style.width = "220px";
              document.getElementById("main").style.marginLeft = "220px";
              $scope.collapse = false;
              $scope.sideNavOpen = true;
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


        $scope.check = function () {
          if ($scope.collapse) {
            $scope.closeNav();
          }
        }

        $scope.closeNav = function () {
          document.getElementById("mySidenav").style.width = "0";
          document.getElementById("main").style.marginLeft = "0";
          $scope.sideNavOpen = false;
        }

        $scope.openNav = function () {
          $scope.sideNavOpen = true;
          if ($scope.windowWidth < 768) {
            document.getElementById("mySidenav").style.width = "220px";
          } else {
            document.getElementById("mySidenav").style.width = "220px";
            document.getElementById("main").style.marginLeft = "220px";
          }
        };

        switch ($rootScope.currentUser.status) {
          case 0:
            $scope.topmenu = { "name": "Student Module", "url": "dashboard.student", "icon": "user" };
            $scope.menus = [{ "name": "Courses", "url": "dashboard.student.courses", "icon": "book" },
            { "name": "Registration", "url": "dashboard.registration", "icon": "users" },
            { "name": "Timetable", "url": "dashboard.timetable", "icon": "calendar" },
            { "name": "Grades", "url": "dashboard.grades", "icon": "check" }];
            break;
          case 1:
            $scope.topmenu = { "name": "Student Module", "url": "dashboard.student", "icon": "user" };

            break;
          case 2:
            $scope.topmenu = { "name": "Student Module", "url": "dashboard.student", "icon": "user" };
            $scope.menus = [{ "name": "Dashboard", "url": "dashboard.student", "icon": "bar-chart" },
            { "name": "My Courses", "url": "dashboard.courses", "icon": "book" },
            { "name": "Grades", "url": "dashboard.myGrades", "icon": "check" },
            { "name": "eKnowledge", "url": "dashboard.learn", "icon": "users" },
            { "name": "Timetable", "url": "dashboard.timetable", "icon": "calendar-o" },
             { "name": "Account", "url": "dashboard.account", "icon": "money" }];
            break;
          case 3:
            $scope.topmenu = { "name": "Admin Module", "url": "dashboard.admin", "icon": "user" };
             $scope.subMenu = { "name": "Administration Menus", "url": "dashboard.admin", "icon": "user" };
            $scope.menus = [{ "name": "Dashboard", "url": "dashboard.admin", "icon": "bar-chart" },
            { "name": "Applicants", "url": "dashboard.applications", "icon": "book" },
            { "name": "Events", "url": "dashboard.createEvent", "icon": "calendar" },
            { "name": "Students", "url": "dashboard.manageStudents", "icon": "users" },
               { "name": "Courses", "url": "dashboard.adminCourses", "icon": "book" },
                  { "name": "Timetable", "url": "dashboard.schedule", "icon": "calendar" },
            { "name": "Payments", "url": "dashboard.transactions", "icon": "money" }];
            break;
          case 4:
            $scope.topmenu = { "name": "Staff Module", "url": "dashboard.staff", "icon": "user" };
            $scope.menus = [{ "name": "Dashboard", "url": "dashboard.staff", "icon": "bar-chart" },
            { "name": "Courses", "url": "dashboard.departmentCourses", "icon": "book" },
            { "name": "Grading", "url": "dashboard.grades", "icon": "check" },
             { "name": "My Schedule", "url": "dashboard.myCourses", "icon": "calendar" },
            { "name": "eKnowledge", "url": "dashboard.learn", "icon": "book" }];
            break;
          case 5:
            $scope.topmenu = { "name": "System Module", "url": "dashboard.sysAdmin", "icon": "user" };
             $scope.subMenu = { "name": "Administration Menus", "url": "dashboard.admin", "icon": "user" };
            $scope.menus = [{ "name": "Users", "url": "dashboard.sysAdmin", "icon": "users" },
            { "name": "Notices", "url": "dashboard.notifications", "icon": "bell" },
            { "name": "Messages", "url": "dashboard.sysMessages", "icon": "envelope" },
            { "name": "Settings", "url": "dashboard.settings", "icon": "cog" }];
        }
      }
    }
  });


