'use strict';
/**
 * superController for superuser state
 */
angular.module('starsApp')
  .controller('ScheduleController', function ($scope, $http, $sce, $stateParams, $rootScope, $uibModal, Course, Schedule) {
    
    $scope.radioModel = 'Monday';
    var id = $stateParams.scheduleId;


    $scope.getCourses = function () {
      Course.query(function (result) {

        $scope.courses = result;
      });
    }

    $scope.getCourses();

    $scope.getSchedules = function () {
      Schedule.query(function (result) {

        $scope.schedules = result;
      });
    }

    $scope.updateSchedule = function (schedule) {
      console.log(schedule);
      Schedule.update(schedule);
      $scope.scheduleEdit = null;
    }

    $scope.getSchedules();


$scope.getCurrentSchedules = function () {
    if (id) {
      $http.get('/api/schedules/' + id).then(function (result) {

        console.log(result.data);
        $scope.currentSchedule = result.data;
        $scope.trustedScheduleUrl = $sce.trustAsHtml("api/stream/" + $scope.currentSchedule.filename);
      });

    }
}

    var $ctrl = this;
    $scope.open = function (template, size, id, title, currentCourseId) {
      $uibModal.open({
        animation: $ctrl.animationsEnabled,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        keyboard: false,
        backdrop: false,
        templateUrl: template,
        size: size,
        controller: function ($scope, $uibModalInstance,$filter, Schedule, Course, $timeout, $http, $sce, User, $state) {

          $scope.timeSlots = [{ slot: 1, time: '08.00AM - 08.50AM' },
          { slot: 2, time: '08:50AM - 09:40AM' },
          { slot: 3, time: '09:40AM - 10:30AM' },
          { slot: 4, time: '10:50AM - 11:40AM' },
          { slot: 5, time: '11:40PM - 12:30PM' },
          { slot: 6, time: '02:00PM - 02:50PM' },
          { slot: 7, time: '02:50PM - 03:40PM' },
          { slot: 8, time: '03:40PM - 04:30PM' }
          ];


          $scope.scheduleCourseTitle = title;
          $scope.instructors = undefined;

          if(currentCourseId){

     Course.get({courseId:currentCourseId},function (result) {

        $scope.currentCourse = result;

        console.log($scope.currentCourse);
        
      });
          }
                 
 
if(id) {

  Schedule.get({ scheduleId: id }, function (result) {
            $scope.scheduled = result;
          });
}
        

    
  

          User.query(function (result) {
              var  instructors = $filter('filter')(result, {status:4});
            $scope.instructors = instructors;

          });

          $scope.close = function () {
            $uibModalInstance.close('close');
          };

          $scope.removeSchedule = function () {
            $http.delete('/api/schedules/' + id).then(function (Response) {
              console.log(Response);

              $scope.close();
              $state.reload();
            });

          };

          $scope.updateSchedule = function (schedule) {

            Schedule.query(function (result) {
              $scope.free = 'yes';

              $scope.schedules = result;

              if (schedule.instructor) {
                console.log('new instructor');
                for (var i = 0; i < $scope.schedules.length; i++) {

                  if ($scope.schedules[i].instructorId == schedule.instructor._id && $scope.schedules[i].day == schedule.day && $scope.schedules[i].timeSlot.slot == schedule.timeSlot.slot) {
                    var free = 1;
                    console.log(schedule[i].time, schedule.time.slot)
                    $scope.free = (free == 1) ? "no" : "yes";
                    $scope.message = 'This Instructor is busy at this time';
                    break;

                  }
                }


                if ($scope.free == 'yes') {
                  console.log('updating new');
                  Schedule.update({ scheduleId: schedule._id }, {
                    instructorId: schedule.instructor._id,
                    firstname: schedule.instructor.firstname,
                    lastname: schedule.instructor.lastname,
                    day: schedule.day,
                      timeSlot: schedule.timeSlot
                  },

                    function (Response) {
                      $scope.schedule = '';
                         $http.put('api/courses/'+ currentCourseId, {currentInstructorId:schedule.instructor._id});
                      $scope.close();
                      $state.reload();
                   
                    });

                }

              } else {

                for (var i = 0; i < $scope.schedules.length; i++) {

                  if ($scope.schedules[i].instructorId == schedule.instructorId && $scope.schedules[i].day == schedule.day && $scope.schedules[i].timeSlot.slot == schedule.timeSlot.slot) {
                    var free = 1;
                    $scope.free = (free == 1) ? "no" : "yes";
                    $scope.message = 'This Instructor is busy at this time';
                    break;

                  }
                }


                if ($scope.free == 'yes') {
                  console.log('updating');
                  Schedule.update(schedule, function (Response) {
                    $scope.schedule = '';
                    $scope.close();
                    $state.reload();
               

                  });
                }
              }
            });
          };


          $scope.submit = function (schedule) {

console.log(schedule.timeSlot);

            Schedule.query(function (result) {
              $scope.free = 'yes';

              $scope.schedules = result;

              for (var i = 0; i < $scope.schedules.length; i++) {

                if ($scope.schedules[i].instructorId == schedule.instructor._id && $scope.schedules[i].day == schedule.day && $scope.schedules[i].timeSlot.slot == schedule.timeSlot.slot) {
                  var free = 1;
                  $scope.free = (free == 1) ? "no" : "yes";
                  $scope.message = 'This Instructor is already scheduled for this time slot';
                    console.log($scope.message);
                  break;

                } } 

              if ($scope.free == 'yes') {
console.log($scope.currentCourse);
                var newSchedule = new Schedule({
                  title: title,
                  schoolYear: $rootScope.settings[0].schoolYear,
                  startDate: $rootScope.settings[0].SemesterStart,
                  endDate: $rootScope.settings[0].SemesterEnd,
                  id: currentCourseId,
                  firstname: schedule.instructor.firstname,
                  lastname: schedule.instructor.lastname,
                  instructorId: schedule.instructor._id,
                  semester: schedule.semester,
                  department: $scope.currentCourse.department,
                  option:$scope.currentCourse.option,
                  day: schedule.day,
                  timeSlot: schedule.timeSlot
                });

                newSchedule.$save().then(function (Response) {
                  console.log(Response);
                  $scope.schedule = '';
                     $http.put('api/courses/'+id, {currentInstructorId:schedule.instructor._id});
                  $scope.close();
                  $state.reload();

                });
              }

            })
          };
        }
      })
    }
  });

