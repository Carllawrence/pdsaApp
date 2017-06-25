'use strict';
/**
 * superController for superuser state
 */
angular.module('starsApp')
  .controller('EventsController', function ($rootScope, $uibModal, Upload, $scope, $state, $http, AuthService, $timeout, Event, filterFilter, $location) {


    $scope.events = [];
    $scope.newEvent = '';
    $scope.editedEvent = null;
    // set the filter status to the initial search query if it exists
    $scope.status = $location.search().q || '';

    // watch the events array for changes and update the counts
    $scope.$watch('events', function () {
      $scope.remainingCount = filterFilter($scope.events, { completed: false }).length;
      $scope.completedCount = $scope.events.length - $scope.remainingCount;
      $scope.allChecked = !$scope.remainingCount;
    }, true);

    // monitor the current location for changes and adjust the filter accordingly
    $scope.$on('$locationChangeSuccess', function () {
      var status = $scope.status = $location.search().q || '';
      $scope.statusFilter = (status === 'active') ?
        { completed: false } : (status === 'completed') ?
          { completed: true } : null;
    });

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
        controller: function ($scope, $uibModalInstance, Event, $timeout, $http, $sce, $state) {
   
   Event.query(function (response) {
      $scope.events = response;
    });
          $scope.close = function () {
            $uibModalInstance.close('close');
          };
          // create a new event locally save it remotely
          $scope.addEvent = function (event, file) {
            file.upload = Upload.upload({
              url: '/upload/',
              data: { file: file },
            });

            file.upload.then(function (response) {
              $timeout(function () {
                $scope.profileFilename = file.name;
                file.result = response.data;
                var newEvent = new Event({
                  title: event.title,
                  description: event.description,
                  date: event.date,
                  email: event.email,
                  type: event.type,
                  telephone: event.telephone,
                  venue: event.venue,
                  picUrl: $scope.profileFilename,
                  url: event.url
                });
                newEvent.$save();

                $scope.newEvent = '';
                $scope.event = '';


              });
            }, function (response) {
              if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
              // Math.min is to fix IE which reports 200% sometimes
              file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.close();
               $state.reload();
          };

          // remove event locally and remotely
          $scope.delEvent = function () {
            $http.delete('/api/events/' + id).then(function (Response) {
              console.log(Response);
              $scope.close();
              $state.reload();
            });
          };

        }

      });
    }

    // begin editing a event, save the original in case of cancel
    $scope.editEvent = function (id) {
      $scope.editedEvent = $scope.events[id];
      $scope.originalEvent = angular.extend({}, $scope.editedEvent);
    };

    // update when done editing, or if title is erased remove the event
    $scope.doneEditing = function (id) {
      $scope.editedEvent = null;
      var title = $scope.events[id].title.trim();
      if (title) {
        $scope.events[id].$update();
      } else {
        $scope.removeEvent(id);
      }
    };

    // revert the edited event back to what it was
    $scope.revertEditing = function (id) {
      $scope.events[id] = $scope.originalEvent;
      $scope.doneEditing(id);
    };

    // toggle event completed, and update remotely
    $scope.toggleCompleted = function (id) {
      var event = $scope.events[id];
      event.completed = !event.completed;
      event.$update();
    };

    // remove completed events locally and from server
    $scope.clearCompletedEvents = function () {
      var remainingEvents = [];
      angular.forEach($scope.events, function (event) {
        if (event.completed) {
          event.$remove();
        } else {
          remainingEvents.push(event);
        }
      });
      $scope.events = remainingEvents;
    };

    // mark all as completed or not, then update remotely
    $scope.markAll = function (allCompleted) {
      angular.forEach($scope.events, function (event) {
        event.completed = !allCompleted;
        event.$update();
      });
    };


    Event.query(function (response) {
      $scope.events = response;
    });

  });