'use strict';
/**
 * superController for superuser state
 */
angular.module('starsApp')
  .controller('TimetableController', function ($scope, $compile,uiCalendarConfig, $state, AuthService, $timeout) {

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
var y = date.getFullYear();

   

       $scope.events =

[
{
"events": [
{
"id": "562e65c5fb0cc1110a6ea143",
"title": "Test event 2",
"start": "2017-02-13T15:00:00.000Z",
"end": "2017-02-13T12:00:00.000Z",
"description": "Second event for testing the system",
"allDay": false
},
{
"id": "562e65c5fb0cc1110a6ea144",
"title": "Test event 3",
"start": "2017-02-10T09:00:00.000Z",
"end": "2017-02-10T12:00:00.000Z",
"description": "Third event for testing the system",
"allDay": false
},
{
"id": "562e65c5fb0cc1110a6ea142",
"title": "Test event 1",
"start": "2016-01-01T09:00:00.000Z",
"end": "2016-01-01T12:00:00.000Z",
"description": "First event for testing the system",
"allDay": false
}
]
}
];

$scope.alertOnEventClick = function( events, jsEvent, view){
  console.log(events.title);
       
    };

    $scope.calEventsExt = {
       color: 'gray',
       textColor: 'blue',
       events: [
          {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false}

        ]
};

     $scope.uiConfig = {
      

      calendar:{
          firstDay:1,
        height: "100%",
        editable: true,
        header:{
          left: 'agendaDay agendaWeek',
          center: 'title',
          right: 'today prev,next',

          
           selectConstraint: 'businessHours',
        eventConstraint: 'businessHours'
        },
        views: {
            agendaWeek:{
                type:'agendaWeek',
                duration: { days: 5 },
                 maxTime: '20:00',
                minTime: '08:00',
                
                titleFormat: 'MMMM YYYY', //YYYY
                buttonText: 'School Week View',
                columnFormat: 'dddd DD',
                hiddenDays: [0, 6] // Hide Sunday and Saturday?
            },
            agendaDay:{
                type:'agendaDay',
                 titleFormat: 'MMMM DD',

                buttonText: 'School Day View',
                maxTime: '20:00',
                minTime: '08:00'
            }
        },
defaultView: 'agendaDay',
        businessHours: {
   
    dow: [ 1, 2, 3, 4, 5], 

    start: '08:00', // a start time (10am in this example)
    end: '19:00', // an end time (6pm in this example)
},
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };


  });