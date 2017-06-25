'use strict';
/**
 * superController for superuser state
 */
angular.module('starsApp')
  .controller('LearnController', function ($scope,$http, $sce, $stateParams, $rootScope, $uibModal, Video) {

var id = $stateParams.videoId;

    $scope.getVideos = function () {
      Video.query(function (result) {

        $scope.videos = result;
      });
    }

    $scope.getVideos();

     if (id) {
            $http.get('/api/videos/' + id).then(function (result) {
            
              console.log(result.data);
              $scope.currentVideo = result.data;
              $scope.trustedVideoUrl = $sce.trustAsHtml("api/stream/" + $scope.currentVideo.filename);
            });
 var v = document.getElementById("currentVideo");
    document.getElementById("currentVideo").controls = false;

   $scope.playVideo = function (){
        v.play();
    }
   $scope.pauseVideo = function(){
        v.pause();
    }
   $scope.stopVideo = function(){
        v.pause();
        v.currentTime = 0;
    }
             var vid = document.getElementById("currentVideo");
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      /* save current video time */
      console.log(vid.currentTime);
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
        controller: function ($scope, $uibModalInstance, Video, Upload, $timeout, $http, $sce, $state) {

          $scope.videoTitle = title;


          $scope.close = function () {
            $uibModalInstance.close('close');
          };

          $scope.removeVideo = function () {
            $http.delete('/api/videos/' + id).then(function (Response) {
              console.log(Response);

              $scope.close();
 $state.reload();
            });

          };

          $scope.progressPercentage = 0;

          $scope.$watch('progressPercentage', function () {
            console.log('uploading...');
          });
          $scope.submit = function (video, file) {
            if ($scope.form.file.$valid && $scope.file) {
              $scope.upload(video, file);
            }
          };

          // upload on file select or drop
          $scope.upload = function (video, file) {
            console.log(file);
            Upload.upload({
              url: '/upload/',
              data: { file: file }
            }).then(function (resp) {
              console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
              var newVideo = new Video({
                title: video.title,
                description: video.description,
                author: $rootScope.currentUser.firstname,
                authorPic: $rootScope.currentUser.picUrl,
                filename: resp.config.data.file.name
              });
              newVideo.$save();

            }, function (resp) {
              console.log('Error status: ' + resp.status);
            }, function (evt) {
              $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

              console.log('progress: ' + $scope.progressPercentage + '% ' + evt.config.data.file.name);

              if ($scope.progressPercentage == 100) {
                $scope.video = '';

                $timeout(function () {
                  $scope.close();
                 $state.reload();
                }, 1000);


              }
            });
          };

        }

      })

    }

  });

