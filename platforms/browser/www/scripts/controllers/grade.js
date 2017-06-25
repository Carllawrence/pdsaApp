'use strict';
/**
 * superController for superuser state
 */
angular.module('starsApp')
  .controller('GradeController', function ($scope, $http, $sce,$filter, $state, $stateParams, Course, User, $rootScope, $uibModal,Assignment, Grade) {

    //get scheduled courseid
    var id = $stateParams.assignmentId;
    var cId = $stateParams.courseId;
    

       $scope.getCourses = function () {
      Course.query(function (result) {
        $scope.courses = result;
        
      });
    }
$scope.getCourses();
     $scope.getCourse = function () {
      Course.get({courseId:cId},function (result) {
        $scope.currentCourse = result;
      });
    }

        $scope.getCourse();
    
    $scope.getAllGrades = function () {
      Grade.query(function (result) {
        $scope.allGrades = result;
      });
    }

$scope.getAllGrades();

     Grade.query({studentId:$rootScope.currentUser._id}, function (result) {
        $scope.mygrades = result;
      });


      
      Grade.query({assignmentId:id},function (result) {
        $scope.grades = result;
      });
  

          $scope.saveGrade = function(data) {
    Grade.update(data);
  };

     // remove grade
  $scope.removeGrade = function(index) {
    $scope.currentGrades.splice(index, 1);
  };



    
    $scope.getAssignments = function () {
      Assignment.query(function (result) {
        $scope.assignments = result;
      });  
    }



    $scope.updateGrade = function (grade) {
      console.log(grade);
      Grade.update(grade);
      $scope.gradeEdit = null;
    }

    $scope.getAssignments();



    if (id) {
      $http.get('/api/assignments/' + id).then(function (result) {
        console.log(result.data);
        $scope.currentAssignment = result.data;
        
      });
    }

          $scope.populate = function(currentAssignment) {
         //get students with (department, option, level)
   User.query(function (result) {
           console.log($scope.currentCourse.department, $scope.currentCourse.option);
        var  students = $filter('filter')(result, {department:$scope.currentCourse.department, option:$scope.currentCourse.option});
      $scope.students = students;
      console.log(students)

  
angular.forEach(students, function(value, key) {
  $http.post('/api/grades/', {assignmentName: currentAssignment.assignmentName, assignmentId:id, studentId: value._id, studentFirstname: value.firstname, studentLastname:value.lastname});
});
   
    });

     $state.reload(); 
    };

        $scope.populateold = function() {
         //get students with (department, option, level)
    User.query(function (result) {
      $scope.students = result;

      console.log($scope.students);

      var currentAssignmentStudents = {grades:[{studentId:null, studentFirstname: null, studentLastname:null},],};

  
angular.forEach(result, function(value, key) {
  console.log(key, value.firstname);
  currentAssignmentStudents.grades.push({studentId: value._id, studentFirstname: value.firstname, studentLastname:value.lastname})
});

    console.log(currentAssignmentStudents);
    $http.put('/api/grades/' + id, currentAssignmentStudents);
    });

     $state.reload(); 
    };

    var $ctrl = this;
    $scope.open = function (template, size, id, title, index) {
      $uibModal.open({
        animation: $ctrl.animationsEnabled,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        keyboard: false,
        backdrop: false,
        templateUrl: template,
        size: size,
        controller: function ($scope, $uibModalInstance, Grade, Assignment, $timeout, $http, $sce, $state) {

          Course.get({ courseId: id }, function (result) {
            $scope.currentCourse = result;
          });

         $scope.gradeTitle = title;
          $scope.close = function () {
            $uibModalInstance.close('close');
          };

           $scope.removeGrade = function () {
            $http.delete('/api/grades/' + id).then(function (Response) {
              console.log(Response);
              $scope.close();
              $state.reload();
            });

          };



          $scope.submit = function (assignment) {

            var newAssignment = new Assignment({
              assignmentName: assignment.title,
              courseId: $scope.currentCourse._id,
              semester: $rootScope.settings.currentSemester,
              schoolYear: $rootScope.settings.schoolYear,
              courseTitle: $scope.currentCourse.title,
              level:$scope.currentCourse.level,
              option: $scope.currentCourse.option,
              department: $scope.currentCourse.department,
              description: assignment.description,
              type: assignment.type,
              total: assignment.total
            });

            newAssignment.$save().then(function (Response) {
              $scope.assignment = '';
              $scope.close();
              $state.reload();

            });

          };
        }
      })
    }
  });

