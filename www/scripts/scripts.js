"use strict"; angular.module("yapp", ["ui.router", "snap", "ngAnimate", 'chart.js', 'firebase'])
.config(["$stateProvider", "$urlRouterProvider", function (r, t) 
{  

  t.when("/dashboard", "/dashboard/overview"), t.otherwise("/login"), 
  r.state("base", { "abstract": !0, url: "", templateUrl: "views/base.html" })
r.state("login", { url: "/login", parent: "base", templateUrl: "views/login.html", controller: "LoginCtrl" }).state("dashboard", { url: "/dashboard", parent: "base", templateUrl: "views/dashboard.html", controller: "DashboardCtrl" })
.state("overview", { url: "/overview", parent: "dashboard", templateUrl: "views/dashboard/overview.html", controller:"DashboardCtrl" }).state("reports", { url: "/reports", parent: "dashboard", templateUrl: "views/dashboard/reports.html", controller:"ReportCtrl" })
.state("input", { url: "/input", parent: "dashboard", templateUrl: "views/dashboard/input.html", controller:"DashboardCtrl" }) 

}]), 



angular.module("yapp")

.controller("LoginCtrl", ["$scope", "$location", "$http", "$rootScope",  function (r, t, h, rs) 

{ 


    document.getElementById('loginBtn').addEventListener('click', r.submit, false);


    r.submit = function (username, password)
 
    { 
        h.post('https://access.strivetogether.org/api/login',
        { username: username, password: password, member: 'non'})
        // handle success
        .then(function (response) {
        
          if(response.data.status === 500){
            rs.loginError = response.data.data.exception.message;
          }
       
          if (response.data.status === 200 && response.data.data) {
                  
              rs.currentUser = response.data.data;
              var user = true;
              return t.path("/dashboard"), !1 }

        }, function errorCallback(err) {
          console.log(err);
          rs.loginError = err.data.err.message;

        })
         }

        

}]), 

angular.module("yapp")
.controller("ReportCtrl", ["$scope", "$state","$http", function (r, t, h) { 



  r.labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  r.series = ['Student', 'National'];
  r.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  r.onClick = function (points, evt) {
    console.log(points, evt);
  };
  r.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  r.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: false,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: false,
          position: 'right'
        }
      ]
    }
  };
}]),

angular.module("yapp")
.controller("DashboardCtrl", ["$scope", "$state","$http","$rootScope","$firebaseObject","$timeout", function (r, t, h, rs, fireobj,timeout) { 
  var ref = firebase.database().ref('/students/-LBeS4DFzS5-w9Ty9p3_/data/1/status/');

     var obj = fireobj(ref); 
  
  angular.element(document).ready(function () {
   

  var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('scan').addEventListener('click', this.scan, false);

    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
      //  receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

  

    scan: function() {
        console.log('scanning');
        
        var scanner = cordova.plugins.barcodeScanner;

        scanner.scan( function (result) { 


          obj.status = "STARTED";
          obj.$save().then(function(ref) {
            ref.key === obj.$id; // true
          }, function(error) {
            console.log("Error:", error);
          });

          timeout(function () {

            obj.status = "DONE";
            obj.$save().then(function(ref) {
              ref.key === obj.$id; // true
            }, function(error) {
              console.log("Error:", error);
            });        }, 50000);

       //   $firebase(new Firebase(ref)).$child('foo').$child('title').$set("active")


           console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");
            console.log(result);
            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) { 
            console.log("Scanning failed: ", error); 
        } );
    },



};

app.initialize();



});

r.report = function(focus, summary)
 
{ 
    h.post('https://access.strivetogether.org/api/tutors',
    { focus: focus, summary: summary, hashId:r.tutordata.hashId, tutorId:rs.currentUser._id })
  
    t.go('overview');
    r.tutordata = null;
     }

}]);