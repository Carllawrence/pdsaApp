'use strict';
/**
 * superController for superuser state
 */
angular.module('starsApp')
  .controller('CourseController', function ($scope, $http, $sce, $stateParams, $rootScope, $uibModal, Course) {

    var id = $stateParams.courseId;



    $scope.getCourses = function () {
      Course.query(function (result) {

        $scope.courses = result;
      });
    }

     $scope.updateCourse = function(course) {
       console.log(course);
            Course.update(course);
            $scope.courseEdit = null;
          }

    $scope.getCourses();

    if (id) {
      $http.get('/api/courses/' + id).then(function (result) {

        console.log(result.data);
        $scope.currentCourse = result.data;
        $scope.trustedCourseUrl = $sce.trustAsHtml("api/stream/" + $scope.currentCourse.filename);
      });

    }



    var $ctrl = this;
    $scope.open = function (template, size, id, title) {
      $uibModal.open({
        animation: $ctrl.animationsEnabled,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        keyboard: false,
        backdrop: false,
        templateUrl: template,
        size: size,
        controller: function ($scope, $uibModalInstance, Course, $timeout, $http, $sce, $state) {

          $scope.courseTitle = title;



          $scope.close = function () {
            $uibModalInstance.close('close');
          };

          $scope.removeCourse = function () {
            $http.delete('/api/courses/' + id).then(function (Response) {
              console.log(Response);

              $scope.close();
              $state.go('dashboard.courses')
            });

          };

        $scope.departments = [{DEPARTMENT: 'MECHANICAL ENGINEERING', OPTION: 'Automobile   Technology'},
{DEPARTMENT: 'MECHANICAL ENGINEERING', OPTION: 'Production Technology'},
{DEPARTMENT: 'INFORMATION TECHNOLOGY', OPTION: 'IT'},
{DEPARTMENT: 'CIVIL ENGINEERING', OPTION: 'Construction Technology'},
{DEPARTMENT: 'CIVIL ENGINEERING', OPTION: 'Engineering Surveying'},                                    
];                                   
   

          $scope.submit = function (course) {
                                                                        
console.log(course.department.DEPARTMENT);
console.log(course.department.OPTION);

            var newCourse = new Course({
              title: course.title,
              description: course.description,
              department: course.department.DEPARTMENT,
              option: course.department.OPTION,
              length: course.length,
              level: course.level,
              courseicon: course.department.DEPARTMENT
            });
            newCourse.$save().then(function (Response) {
              $scope.course = '';
              $scope.close();
              $state.reload();

            });

          };

         
        }

      })

    }

  });

