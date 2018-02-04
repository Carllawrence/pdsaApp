"use strict"; angular.module("yapp", ["ui.router", "snap","qrScanner", "ngAnimate"])
.config(["$stateProvider", "$urlRouterProvider", function (r, t) 
{ t.when("/dashboard", "/dashboard/overview"), t.otherwise("/login"), 
r.state("base", { "abstract": !0, url: "", templateUrl: "views/base.html" })
.state("login", { url: "/login", parent: "base", templateUrl: "views/login.html", controller: "LoginCtrl" }).state("dashboard", { url: "/dashboard", parent: "base", templateUrl: "views/dashboard.html", controller: "DashboardCtrl" })
.state("overview", { url: "/overview", parent: "dashboard", templateUrl: "views/dashboard/overview.html" }).state("reports", { url: "/reports", parent: "dashboard", templateUrl: "views/dashboard/reports.html" }) }]), 



angular.module("yapp")

.controller("LoginCtrl", ["$scope", "$location", "$http", "$rootScope", function (r, t, h, rs) 

{ 

    r.onSuccess = function(data) {
        console.log(data, 'this is the code');
    };
    r.onError = function(error) {
        console.log(error);
    };
    r.onVideoError = function(error) {
        console.log(error);
    };


    r.submit = function (username, password)
 
    { 
        h.post('http://40.69.190.100:8080/api/login',
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
.controller("DashboardCtrl", ["$scope", "$state", function (r, t) { r.$state = t 



}]);