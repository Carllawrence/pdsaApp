var app = angular.module('StudentApp', ['ngMessages','oc.lazyLoad', 'ngMaterial','leaflet-directive', 'ngMdIcons','ngRoute', 'firebase', 'chart.js', 'md.data.table']);
// for ngRoute
app.run(["$rootScope", "$location", "$window", function($rootScope, $location, $window) {

  $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function () {
      $rootScope.$apply(function () {
        $rootScope.online = false;
      });
    }, false);

    $window.addEventListener("online", function () {
      $rootScope.$apply(function () {
        $rootScope.online = true;
      });
    }, false);

  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/login");
    }
  });
}]);

app.factory("Students", ["$firebaseObject",
  function($firebaseObject) {
    // create a reference to the database location where we will store our data
    var ref = firebase.database().ref('/students/-LBnJq348asrpMV0kAKi/');

    // this uses AngularFire to create the synchronized array
    return $firebaseObject(ref);
  }
]);

app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

app.config(['ChartJsProvider', function (ChartJsProvider) {

  Chart.defaults.global.colors = [
    {
      backgroundColor: '#00BFFF',
      pointBackgroundColor: '#00BFFF',
      pointHoverBackgroundColor: '#00BFFF',
      borderColor: '#00BFFF',
      pointBorderColor: '#00BFFF',
      pointHoverBorderColor: '#00BFFF'
    }, {
      backgroundColor: '#191970',
      pointBackgroundColor: '#191970',
      pointHoverBackgroundColor: '#191970',
      borderColor: '#191970',
      pointBorderColor: '#191970',
      pointHoverBorderColor: '#191970'
    }, {
      backgroundColor: '#91679b',
      pointBackgroundColor: '#91679b',
      pointHoverBackgroundColor: '#91679b',
      borderColor: '#91679b',
      pointBorderColor: '#91679b',
      pointHoverBorderColor: '#91679b'
    }, {
      backgroundColor: '#dd5757',
      pointBackgroundColor: '#dd5757',
      pointHoverBackgroundColor: '#dd5757',
      borderColor: '#dd5757',
      pointBorderColor: '#dd5757',
      pointHoverBorderColor: '#dd5757'
    }, {
      backgroundColor: '#44b29d',
      pointBackgroundColor: '#44b29d',
      pointHoverBackgroundColor: '#44b29d',
      borderColor: '#44b29d',
      pointBorderColor: '#44b29d',
      pointHoverBorderColor: '#44b29d'
    }, {
      backgroundColor: '#efc94c',
      pointBackgroundColor: '#efc94c',
      pointHoverBackgroundColor: '#efc94c',
      borderColor: '#efc94c',
      pointBorderColor: '#efc94c',
      pointHoverBorderColor: '#efc94c'
    }, {
      backgroundColor: '#2aa3b7',
      pointBackgroundColor: '#2aa3b7',
      pointHoverBackgroundColor: '#2aa3b7',
      borderColor: '#2aa3b7',
      pointBorderColor: '#2aa3b7',
      pointHoverBorderColor: '#2aa3b7'
    }
  ]

  ChartJsProvider.setOptions({
    colors: ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
    elements: { line: { fill: false } },

    scales: {
      yAxes: [{
        display: false,
        ticks: {
          beginAtZero: true
        }
      }]
    }
  });
}]);

app.config(function($mdThemingProvider) {
  var customBlueMap = 		$mdThemingProvider.extendPalette('blue-grey', {
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50'],
    '50': '#00BFFF'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('blue');
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});

app.config(["$routeProvider", function($routeProvider) {
  $routeProvider.when("/", {
    controller: "HomeCtrl",
    templateUrl: "views/main.html",
    resolve: {
      "currentAuth": ["Auth", function(Auth) {
        // $waitForSignIn returns a promise so the resolve waits for it to complete
        return Auth.$requireSignIn();
      }]
    }
  }).when("/account", {
    // the rest is the same for ui-router and ngRoute...
    controller: "AccountCtrl",
    templateUrl: "views/login.html",
    access: { restricted: false, status: 0 },
    resolve: {
 
      "currentAuth": ["Auth", function(Auth) {
        // $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $routeChangeError (see above)
        return Auth.$requireSignIn();
      }]
    }
  }).when("/login", {
    // the rest is the same for ui-router and ngRoute...
    controller: "LoginCtrl",
    templateUrl: "views/login.html",
  }).when("/register", {
    // the rest is the same for ui-router and ngRoute...
    controller: "AccountCtrl",
    templateUrl: "views/register.html",
    resolve: {
      loadMyDirectives: function ($ocLazyLoad) {
        return $ocLazyLoad.load(
          {
              name: 'google.places',
              files: ['bower_components/angular-google-places-autocomplete/dist/autocomplete.min.js',
                'bower_components/angular-google-places-autocomplete/dist/autocomplete.min.css']
            })
    }
     }
  });
}]);


app.controller("AccountCtrl", ["Auth", "$scope", "$firebaseAuth", "$mdToast","$firebaseObject", "$firebaseArray","$location", function(Auth, $scope, $firebaseAuth, $mdToast, $firebaseObject, $firebaseArray, $location) {
 
  $scope.notifyToast = function(msg) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(msg)
        .position('top right')
        .hideDelay(3000)
    );
  };

$scope.createUser = function(user){
  Auth.$createUserWithEmailAndPassword(user.email, '1234567')
  .then(function(firebaseUser) {

    console.log("User " + firebaseUser.uid + " created successfully!");
    console.log($scope.user);
var user = $scope.user;
    var newUser = {
      userId: firebaseUser.uid,
      userEmail: user.email,
      userFirstname: user.firstname,
      userLastname: user.lastname,
      userAddress: user.address.formatted_address,
      userStatus: 1,
      userBio: user.bio,
      userLocation: null
    }
    var userRef = firebase.database().ref('/users/'+ firebaseUser.uid);
   var User = $firebaseArray(userRef);
  User.$add(newUser).then( function(){
    $scope.notifyToast('User successfully added');

    $scope.user = '';
    $location.path('/login');
  })     
    
  }).catch(function(error) {
    console.error("Error: ", error);
  });
}
 
}]);


app.controller("LoginCtrl", ["$firebaseObject","Auth","$rootScope", "$scope", "$firebaseAuth", "$mdToast","$location", function($firebaseObject, Auth, $rootScope, $scope, $firebaseAuth, $mdToast, $location) {
  
  if(Auth.$getAuth()){
    $location.path('/')
  };
    
 $scope.notifyToast = function(msg) {
  $mdToast.show(
    $mdToast.simple()
      .textContent(msg)
      .position('top right')
      .hideDelay(3000)
  );
};

$scope.login = function(email, password){
  Auth.$signInWithEmailAndPassword(email, password).then(function(firebaseUser) {
    $rootScope.currentUser = firebaseUser;
    console.log("Signed in as:", firebaseUser.uid);
    $scope.notifyToast('You have successfully signed in');
    var userRef = firebase.database().ref('/users/'+ firebaseUser.uid);
    var User = $firebaseObject(userRef);
    if(User.status == 1){
      $location.path("/");

    }
    $location.path("/");

  }).catch(function(error) {
    console.error("Authentication failed:", error.message);
    $scope.notifyToast(error.message)

  });
}
    
}]);

app.controller('HomeCtrl', ['Auth','currentAuth','$firebaseAuth', '$scope','$timeout', '$mdSidenav', '$log', '$mdBottomSheet', '$mdDialog', '$mdToast','$http', '$q', '$mdEditDialog','$firebaseArray', '$firebaseObject','Students', '$location', function(Auth, currentAuth, $firebaseAuth,$scope, $timeout, $mdSidenav,$log, $mdBottomSheet, $mdDialog,$mdToast, $http, $q, $mdEditDialog, $firebaseArray, $firebaseObject, Students, $location){
 
  Auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      console.log("Signed in as:", firebaseUser.uid);
    } else {
      console.log("Signed out");
      $location.path('/login');
    }
  });

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
       //   var listeningElement = parentElement.querySelector('.listening');
       //   var receivedElement = parentElement.querySelector('.received');
  
       //   listeningElement.setAttribute('style', 'display:none;');
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

  $scope.cancelSearch = function(){
    $scope.search = '';
    $scope.showSearch = !$scope.showSearch;

  }

  $scope.dataToast = function(msg) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(msg)
        .position('top right')
        .hideDelay(3000)
    );
  };

  Students.$loaded().then(function(data) {
    console.log(data === Students); 
   
  }).catch(function(err) {
    console.error(err);
    $scope.dataToast('Sorry:', err);
  });

  $scope.students = Students;

  Students.$bindTo($scope, "students").then(function() {
    console.log($scope.students);
    $scope.dataToast('Student Data Updated');
  
  });
  var ArrayRef = firebase.database().ref('/students/-LBnJq348asrpMV0kAKi/data');

  var chartData = $firebaseArray(ArrayRef);
  chartData.$loaded()
    .then(function(x) {
      $scope.dataToast('Chart Data Loaded', x);
  })
    .catch(function(error) {
      console.log("Error:", error);
    });

    chartData.$watch(function(event) {
      $scope.labels = [];
      $scope.series = [];
      $scope.dataOne = [];
      angular.forEach(chartData, function(value, key) {
       $scope.labels.push(value.name);
       $scope.series.push(value.type);
       $scope.dataOne.push(value.math.value);
    });
    });

 $scope.signout = function(){
   Auth.$signOut();
 };
 
 $scope.showListBottomSheet = function() {
  $scope.alert = '';
  $mdBottomSheet.show({
    templateUrl: 'templates/tutorstudentlist.html',
  }).then(function(clickedItem) {
    $scope.alert = clickedItem['name'] + ' clicked!';
  }).catch(function(error) {
  });
};


 $scope.onClick = function (points, evt) {
   console.log(points, evt);
 };
 $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
 $scope.options = {
  elements: { line: { fill: false } },
  legend: {
    display: true,
    labels: {
      fontColor: "#000080",
    }
  },
  scales: {

    yAxes: [
      {
        id: 'y-axis-1',
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          beginAtZero: true
        }
      },
      {
        id: 'y-axis-2',
        type: 'linear',
        display: false,
        position: 'right'
      },
      

    ]
  }

}


 $scope.deleteRowCallback = function(rows){
  $mdToast.show(
      $mdToast.simple()
          .content('Deleted row id(s): '+rows)
          .hideDelay(3000)
  );
};

$scope.selected = [];
$scope.limitOptions = [5, 10, 15];

$scope.options = {
  rowSelection: true,
  multiSelect: true,
  autoSelect: true,
  decapitate: false,
  largeEditDialog: false,
  boundaryLinks: false,
  limitSelect: true,
  pageSelect: true
};

$scope.query = {
  order: 'name',
  limit: 5,
  page: 1
};


  angular.extend($scope, {
     usa: {
       lat: 39.1031,
       lng: -84.5120,
       zoom: 10
     },
     defaults: {
       scrollWheelZoom: false
     },
     events: {
       map: {
         enable: ['click'],
         logic: 'emit'
       }
     }
   });

   $scope.getSchoolDist = function () {
     $scope.loader = true;
     $http.get("img/ohio.json").then(function (data, status) {
       console.log(data.data);
       angular.extend($scope, {
         geojson: {
           data: data.data,
           style: {
             fillColor: "green",
             weight: 2,
             opacity: 1,
             color: 'white',
             dashArray: '3',
             fillOpacity: 0.7
           }
         }
       });
       $scope.loader = false;
     });


   }


   $scope.$on('leafletDirectiveMap.click', function (event) {
     $scope.eventDetected = "Click";
     alert('clicked');
   });

$scope.editComment = function (event, dessert) {
  event.stopPropagation(); // in case autoselect is enabled
  
  var editDialog = {
    modelValue: dessert.comment,
    placeholder: 'Add a comment',
    save: function (input) {
      if(input.$modelValue === 'Donald Trump') {
        input.$invalid = true;
        return $q.reject();
      }
      if(input.$modelValue === 'Bernie Sanders') {
        return dessert.comment = 'FEEL THE BERN!'
      }
      dessert.comment = input.$modelValue;
    },
    targetEvent: event,
    title: 'Add a comment',
    validators: {
      'md-maxlength': 30
    }
  };
  
  var promise;
  
  if($scope.options.largeEditDialog) {
    promise = $mdEditDialog.large(editDialog);
  } else {
    promise = $mdEditDialog.small(editDialog);
  }
  
  promise.then(function (ctrl) {
    var input = ctrl.getInput();
    
    input.$viewChangeListeners.push(function () {
      input.$setValidity('test', input.$modelValue !== 'test');
    });
  });
};

$scope.toggleLimitOptions = function () {
  $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
};

$scope.getTypes = function () {
  return ['tutoring', 'testing', 'volunteering', 'teaching'];
};

$scope.loadStuff = function () {
  $scope.promise = $timeout(function () {
    // loading
  }, 2000);
};

$scope.logItem = function (item) {
  console.log(item.name, 'was selected');
  $scope.whatSelected = item.name;
};

$scope.logOrder = function (order) {
  console.log('order: ', order);
};

$scope.logPagination = function (page, limit) {
  console.log('page: ', page);
  console.log('limit: ', limit);
}
 
 $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      };
    }
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };

  $scope.alert = '';
  
  $scope.showFilter = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      template: '<md-dialog flex-xs layout-align="center center" layout="column"><form ng-cloak><h3>Filter by:</h3><md-radio-group ng-model="data.group"><md-radio-button value="">All </md-radio-button><md-radio-button value="tutoring" class="md-primary"> Tutoring </md-radio-button><md-radio-button value="testing"> Testing </md-radio-button><md-radio-button value="teaching">Teaching</md-radio-button></md-radio-group><md-button  class="md-raised md-primary" ng-click="answer(data.group)" >Filter</md-button></md-dialog>',
       fullscreen: false,
      targetEvent: ev,
    })
    .then(function(answer) {
      console.log(answer);
      $scope.stype = answer;
    });
    };
  
  $scope.showAdd = function(ev, id) {
     $scope.eventid =id;
    $mdDialog.show({
      locals:{id: $scope.eventid}, 
      controller: DetailController,
      templateUrl: 'detail.html',  
      fullscreen: true,  
      targetEvent: ev,
    })
    .then(function(id) {
      console.log(id);
  
    });
    };

  }]);


function DetailController($scope,$http, $mdDialog, id) {

  console.log(id);
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
}

 function DialogController($scope, $mdDialog) {

  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
 }





