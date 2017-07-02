'use strict';
/*
 * Main module(must be loaded first)
 */
//load angular dependencies
angular
  .module('starsApp', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'ngFileUpload',
    'ngMessages',
    'xeditable',
    'ngResource',
  ])

  //starts application
  .run(function ($rootScope, $window, Setting, $state, AuthService, $http, editableOptions, editableThemes) {
    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';
    editableOptions.iconset = 'font-awesome'


            $rootScope.deptOptions = [{DEPARTMENT: 'MECHANICAL ENGINEERING', OPTION: 'Automobile   Technology'},
{DEPARTMENT: 'MECHANICAL ENGINEERING', OPTION: 'Production Technology'},
{DEPARTMENT: 'INFORMATION TECHNOLOGY', OPTION: 'IT'},
{DEPARTMENT: 'CIVIL ENGINEERING', OPTION: 'Construction Technology'},
{DEPARTMENT: 'CIVIL ENGINEERING', OPTION: 'Engineering Surveying'},                                    
];  

        var settings=[];

      Setting.query(function (result) {

    
      for (var i = 0; i < result.length; i++) {
        var start = new Date(result[i].startDate);
        var end = new Date(result[i].endDate);
        var today = new Date();

        var test1 = today < end;
        var test2 = today > start;

        console.log(test1, test2);

        if (test1 ==true && test2 ==true) {   
           settings.push(result[i]); 
        }
      }

    });



$rootScope.settings = settings;
    console.log($rootScope.settings);

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      $state.go('parent', { reload: true })
    });

    //when route changes do the following
    $rootScope.$on('$stateChangeStart',
      function (e, toState, toParams, fromState, fromParams) {
        AuthService.getUserStatus().then(function () {
          if (toState.access.restricted == true && AuthService.isLoggedIn() == false) {
            $state.go('login', { reload: true });
          } else if (toState.access.restricted == true && AuthService.isLoggedIn() == true && $rootScope.userStatus < toState.access.status) {

            $state.go('notauth', { reload: true })
          }else{
             $state.go('parent', { reload: true })
          }
        });
      });
  })
  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
    })

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('parent', {
        controller: 'RouteController',
        template: '<div class="loader"><div>',
        url: '/',
        access: { restricted: false, status: 0 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/route.js'
                ]
              })
          }
        }

      })

      .state('apply', {
        url: '/apply',
controller: 'loginController',
        templateUrl: 'views/application/apply.html',
        access: { restricted: false, status: 0 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: [
                  'scripts/directives/applicationheader/applicationheader.js',
                  'scripts/directives/applicationheader/application-header-notification/application-header-notification.js'
                ]
              }),

              $ocLazyLoad.load(
                {
                  name: 'mgo-angular-wizard',
                  files: ['bower_components/angular-wizard/dist/angular-wizard.js',
                    'bower_components/angular-wizard/dist/angular-wizard.css']
                })
          }
        }
      })

      .state('login', {
        controller: 'loginController',
        templateUrl: 'views/pages/login.html',
        url: '/login',
        access: { restricted: false, status: 0 },
        resolve: {
          user: ['AuthService', '$q', function (AuthService, $q) {
            var d = $q.defer();
            if (AuthService.isLoggedIn() == false) {

              d.resolve();
            } else {

              d.reject('already logged in');
            }
            return d.promise;
          }]
        }

      })

      .state('registration', {
        url: '/registration',
        controller: 'RegistrationsController',
        templateUrl: 'views/registration/register.html',
        access: { restricted: true, status: 0 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/services/regDataService.js',
                  'scripts/services/userCRUD.js',
                  'scripts/services/payslipDataService.js',
                  'scripts/controllers/registration.js'

                ]
              }),

              $ocLazyLoad.load(
                {
                  name: 'mgo-angular-wizard',
                  files: ['bower_components/angular-wizard/dist/angular-wizard.js',
                    'bower_components/angular-wizard/dist/angular-wizard.css']
                })
          }
        }
      })


      .state('application', {
        url: '/application',
        controller: 'ApplicationsController',
        templateUrl: 'views/application/homeone.html',
        access: { restricted: true, status: 0 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/services/appDataService.js',
                  'scripts/services/userCRUD.js',
                  'scripts/services/payslipDataService.js',
                  'scripts/controllers/application.js',
                  'scripts/directives/applicationheader/applicationheader.js',
                  'scripts/directives/applicationheader/application-header-notification/application-header-notification.js'
                ]
              }),

              $ocLazyLoad.load(
                {
                  name: 'angular-sortable-view',
                  files: ['bower_components/angular-sortable-view/src/angular-sortable-view.js']
                }),
              $ocLazyLoad.load(
                {
                  name: 'mgo-angular-wizard',
                  files: ['bower_components/angular-wizard/dist/angular-wizard.js',
                    'bower_components/angular-wizard/dist/angular-wizard.css']
                })
          }
        }
      })


      .state('application.start', {
        url: '/start',
        controller: 'ApplicationsController',
        templateUrl: 'views/application/start.html',
        access: { restricted: true, status: 0 },
      })

      .state('application.applicationForm', {
        url: '/applicationForm',
        controller: 'ApplicationsController',
        templateUrl: 'views/application/applicationForm.html',
        access: { restricted: true, status: 0 },
      })

      .state('application.appwizard', {
        url: '/appwizard',
        controller: 'ApplicationsController',
        templateUrl: 'views/application/appwizard.html',
        access: { restricted: true, status: 0 },
      })


      .state('application.uploadDocs', {
        url: '/uploadDocs',
        controller: 'ApplicationsController',
        templateUrl: 'views/application/uploadDocs.html',
        access: { restricted: true, status: 0 },
      })

      .state('application.paySubmit', {
        url: '/paySubmit',
        controller: 'ApplicationsController',
        templateUrl: 'views/application/paySubmit.html',
        access: { restricted: true, status: 0 },
      })


      .state('application.submitted', {
        url: '/submitted',
        controller: 'ApplicationsController',
        templateUrl: 'views/application/submitted.html',
        access: { restricted: true, status: 1 },
      })

      .state('dashboard.userProfile', {
        templateUrl: 'views/pages/userProfile.html',
        controller: 'loginController',
        url: '/userProfile',
        access: { restricted: true, status: 0 },
      })


      .state('dashboard.notices', {
        templateUrl: 'views/pages/notices.html',
        controller: 'MainCtrl',
        url: '/notices',
        access: { restricted: true, status: 0 },
      })

      .state('dashboard.courses', {
        templateUrl: 'views/dashboard/student/courses.html',
        controller: 'CourseController',
        url: '/courses',
        access: { restricted: true, status: 0 },
        resolve: {
          loadControllers: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/courses.js'
                ]
              })
          }
        }
      })

          .state('dashboard.adminCourses', {
        templateUrl: 'views/dashboard/admin/courses.html',
        controller: 'CourseController',
        url: '/adminCourses',
        access: { restricted: true, status: 0 },
        resolve: {
          loadControllers: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/courses.js'
                ]
              })
          }
        }
      })

      .state('dashboard.departmentCourses', {
        templateUrl: 'views/dashboard/staff/courses.html',
        controller: 'CourseController',
        url: '/departmentCourses',
        access: { restricted: true, status: 0 },
        resolve: {
          loadControllers: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/courses.js'
                ]
              })
          }
        }
      })


      .state('dashboard.schedule', {
        templateUrl: 'views/dashboard/admin/schedule.html',
        controller: 'ScheduleController',
        url: '/schedule',
        access: { restricted: true, status: 0 },
        resolve: {
          loadControllers: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/schedule.js'
                ]
              })
          }
        }
      })

      .state('dashboard.myCourses', {
        templateUrl: 'views/dashboard/staff/schedule.html',
        controller: 'ScheduleController',
        url: '/myCourses',
        access: { restricted: true, status: 0 },
        resolve: {
          loadControllers: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/schedule.js'
                ]
              })
          }
        }
      })

      .state('dashboard.adminTimetable', {
        templateUrl: 'views/dashboard/admin/adminTimetable.html',
        controller: 'ScheduleController',
        url: '/adminTimetable',
        access: { restricted: true, status: 0 },
        resolve: {
          loadControllers: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/schedule.js'
                ]
              })
          }
        }
      })

      .state('dashboard.courseDetail', {
        templateUrl: 'views/dashboard/student/courseDetail.html',
        controller: 'CourseController',
        url: '/courseDetail/:courseId',
        access: { restricted: true, status: 0 },
        resolve: {
          loadControllers: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/courses.js'
                ]
              })
          }
        }
      })

      .state('dashboard.learn', {
        templateUrl: 'views/dashboard/student/learn.html',
        controller: 'LearnController',
        url: '/learn',
        access: { restricted: true, status: 0 },
        resolve: {
          loadControllers: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/learn.js'
                ]
              })
          }
        }
      })

      .state('dashboard.learnDetail', {
        templateUrl: 'views/dashboard/student/learnDetail.html',
        controller: 'LearnController',
        url: '/learnDetail/:videoId',
        access: { restricted: true, status: 0 },
        resolve: {
          loadControllers: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/learn.js'
                ]
              })
          }
        }
      })

      .state('dashboard.grades', {
        templateUrl: 'views/dashboard/staff/grading.html',
        controller: 'GradeController',
        url: '/grades',
        access: { restricted: true, status: 0 },
        resolve: {
          loadControllers: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/grade.js'
                ]
              })
          }
        }
      })

      .state('dashboard.myGrades', {
        templateUrl: 'views/dashboard/student/mygrades.html',
        controller: 'GradeController',
        url: '/myGrades',
        access: { restricted: true, status: 0 },
        resolve: {
          loadControllers: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/grade.js'
                ]
              })
          }
        }
      })

      .state('dashboard.gradeDetail', {
        templateUrl: 'views/dashboard/staff/gradeDetail.html',
        controller: 'GradeController',
        url: '/gradeDetail/:assignmentId/:courseId',
        access: { restricted: true, status: 0 },
        resolve: {
          loadControllers: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/grade.js'
                ]
              })
          }
        }
      })

      .state('logout', {
        url: '/logout',
        controller: 'logoutController',
        access: { restricted: true, status: 0 }
      })

      .state('notauth', {
        controller: 'loginController',
        templateUrl: 'views/pages/notauth.html',
        url: '/notauth',
        access: { restricted: false, status: 0 }
      })

      .state('forgot', {
        url: '/forgot',
        templateUrl: 'views/pages/forgot.html',
        controller: 'loginController',
        access: { restricted: false, status: 0 },
      })

      .state('resetform', {
        url: '/resetform/:uuid',
        templateUrl: 'views/pages/resetform.html',
        controller: 'loginController',
        access: { restricted: false, status: 0 },
      })

      .state('reset', {
        url: '/reset',
        templateUrl: 'views/pages/resetform.html',
        controller: 'loginController',
        access: { restricted: false, status: 0 },
      })

      .state('dashboard', {
        url: '/dashboard',
        controller: 'MainCtrl',
        templateUrl: 'views/dashboard/main.html',
        access: { restricted: true, status: 0 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: [
                  'scripts/controllers/main.js',
                  'scripts/directives/header/header.js',
                  'scripts/directives/header/header-notification/header-notification.js',
                  'scripts/services/userCRUD.js',
                  'scripts/services/notifyDataService.js',
                  'scripts/services/eventDataService.js',
                  'scripts/services/mailDataService.js',
                  'scripts/services/courseDataService.js',
                  'scripts/services/scheduleDataService.js',
                  'scripts/services/gradeDataService.js',
                  'scripts/services/assignmentDataService.js',
                  //'scripts/services/settingDataService.js',
                  'scripts/services/videoDataService.js'

                ]
              }),
              $ocLazyLoad.load(
                {
                  name: 'toggle-switch',
                  files: ["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                    "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                  ]
                }),

              $ocLazyLoad.load(
                {
                  name: 'ngAnimate',
                  files: ['bower_components/angular-animate/angular-animate.js']
                }),

              $ocLazyLoad.load(
                {
                  name: 'ngCookies',
                  files: ['bower_components/angular-cookies/angular-cookies.js']
                }),



              $ocLazyLoad.load(
                {
                  name: 'chart.js',
                  files: [
                    'bower_components/angular-chart.js/dist/angular-chart.min.js'
                  ]
                }),
              $ocLazyLoad.load(
                {
                  name: 'ngTouch',
                  files: ['bower_components/angular-touch/angular-touch.js']
                })

          }
        }
      })

      .state('dashboard.applications', {
        url: '/applications',
        controller: 'ManageApplicationsController',
        templateUrl: 'views/dashboard/admin/applications.html',
        access: { restricted: true, status: 3 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/services/appDataService.js',
                  'scripts/controllers/manageApplications.js'
                ]
              })
          }
        }
      })

      .state('dashboard.timetable', {
        url: '/timetable',
        controller: 'ScheduleController',
        templateUrl: 'views/dashboard/student/timetable.html',
        access: { restricted: true, status: 2 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: [
                  'scripts/controllers/schedule.js'
                ]
              })

          }
        }
      })

      .state('dashboard.settings', {
        url: '/settings',
        controller: 'SettingsController',
        templateUrl: 'views/dashboard/sysAdmin/settings.html',
        access: { restricted: true, status: 2 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: [
                  'scripts/controllers/settings.js'
                ]
              })

          }
        }
      })

      .state('dashboard.settingDetail', {
        templateUrl: 'views/dashboard/sysAdmin/settingDetail.html',
        controller: 'SettingsController',
        url: '/settingDetail/:settingId',
        access: { restricted: true, status: 2 },
        resolve: {
          loadControllers: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/settings.js'
                ]
              })
          }
        }
      })

      .state('dashboard.notifications', {
        url: '/notifications',
        controller: 'superController',
        templateUrl: 'views/dashboard/sysAdmin/notifications.html',
        access: { restricted: true, status: 5 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: [

                  'scripts/controllers/super.js'
                ]
              })
          }
        }
      })

      .state('dashboard.messages', {
        url: '/messages',
        controller: 'MessagesController',
        templateUrl: 'views/dashboard/messages.html',
        access: { restricted: true, status: 0 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/services/messagedata.js',
                  'scripts/controllers/messages.js'
                ]
              })
          }
        }
      })

      .state('dashboard.sysMessages', {
        url: '/sysMessages',
        controller: 'superController',
        templateUrl: 'views/dashboard/sysAdmin/sysMessages.html',
        access: { restricted: true, status: 5 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/super.js'
                ]
              })
          }
        }
      })

      .state('dashboard.applicationDetail', {
        url: '/applications/:appIndex',
        controller: 'ManageApplicationsController',
        templateUrl: 'views/dashboard/admin/applicationDetail.html',
        access: { restricted: true, status: 3 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/services/appDataService.js',
                  'scripts/controllers/manageApplications.js'
                ]
              })

          }
        }
      })

      .state('dashboard.student', {
        url: '/student',
        controller: 'MainCtrl',
        templateUrl: 'views/dashboard/student/home.html',
        access: { restricted: true, status: 2 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: [
                  'scripts/controllers/main.js'
                ]
              })
          }
        }
      })

      .state('dashboard.events', {
        url: '/events',
        controller: 'EventsController',
        templateUrl: 'views/dashboard/student/calendar.html',
        access: { restricted: true, status: 2 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/services/eventDataService.js',
                  'scripts/controllers/events.js'
                ]
              })
          }
        }

      })

      .state('dashboard.mail', {
        url: '/mail',
        controller: 'MainCtrl',
        templateUrl: 'views/pages/mail.html',
        access: { restricted: true, status: 0 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/main.js'
                ]
              })
          }
        }
      })

      .state('dashboard.staff', {
        url: '/staff',
        controller: 'MainCtrl',
        templateUrl: 'views/dashboard/staff/staff.html',
        access: { restricted: true, status: 3 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/main.js',
                  'scripts/services/eventDataService.js']
              })
          }
        }
      })

      .state('dashboard.manageStudents', {
        url: '/manageStudents',
        controller: 'AdminController',
        templateUrl: 'views/dashboard/admin/manageStudents.html',
        access: { restricted: true, status: 3 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: [
                  'scripts/controllers/admin.js'
                ]
              })
          }
        }
      })

      .state('dashboard.transactions', {
        url: '/transactions',
        controller: 'ManageApplicationsController',
        templateUrl: 'views/dashboard/admin/trans.html',
        access: { restricted: true, status: 3 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/services/appDataService.js',
                  'scripts/controllers/manageApplications.js'
                ]
              })
          }
        }
      })

       .state('dashboard.account', {
        url: '/account',
        controller: 'MainCtrl',
        templateUrl: 'views/dashboard/student/account.html',
        access: { restricted: true, status: 2 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/services/appDataService.js',
                  'scripts/controllers/manageApplications.js'
                ]
              })
          }
        }
      })

      .state('dashboard.admin', {
        url: '/admin',
        controller: 'ManageApplicationsController',
        templateUrl: 'views/dashboard/admin/home.html',
        access: { restricted: true, status: 3 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/manageApplications.js',
                  'scripts/services/appDataService.js'
                ]
              })
          }
        }
      })

      .state('dashboard.createEvent', {
        url: '/createEvent',
        controller: 'EventsController',
        templateUrl: 'views/dashboard/admin/createEvent.html',
        access: { restricted: true, status: 0 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/services/eventDataService.js',
                  'scripts/controllers/events.js'
                ]
              })
          }
        }
      })

      .state('dashboard.sysAdmin', {
        url: '/sysAdmin',
        controller: 'superController',
        templateUrl: 'views/dashboard/sysAdmin/sysAdminDash.html',
        access: { restricted: true, status: 4 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/super.js',

                  'scripts/services/eventDataService.js']
              })
          }
        }
      })

      .state('dashboard.createuser', {
        controller: 'superController',
        templateUrl: 'views/dashboard/sysAdmin/createUser.html',
        url: '/createuser',
        access: { restricted: true, status: 4 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/super.js'

                ]
              })
          }
        }
      })

      .state('dashboard.edituser', {
        controller: 'superController',
        templateUrl: 'views/dashboard/sysAdmin/editUser.html',
        url: '/edituser/:id',
        access: { restricted: true, status: 4 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/super.js',

                ]
              })
          }
        }
      })

      .state('dashboard.changepass', {
        url: '/changepassword',
        templateUrl: 'views/dashboard/changepass.html',
        controller: 'loginController',
        access: { restricted: true, status: 0 },
      })

  }]);