var app = angular.module('StudentApp', ['ngMessages','ngMaterial','leaflet-directive', 'ngMdIcons','ngRoute', 'firebase', 'chart.js', 'md.data.table']);
// for ngRoute
app.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/login");
    }
  });
}]);

app.factory("students", ["$firebaseArray",
  function($firebaseArray) {
    // create a reference to the database location where we will store our data
    var ref = firebase.database().ref();

    // this uses AngularFire to create the synchronized array
    return $firebaseArray(ref);
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
    .accentPalette('red');
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});

app.config(["$routeProvider", function($routeProvider) {
  $routeProvider.when("/", {
    // the rest is the same for ui-router and ngRoute...
    controller: "HomeCtrl",
    templateUrl: "views/main.html",
    resolve: {
      // controller will not be loaded until $waitForSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      "currentAuth": ["Auth", function(Auth) {
        // $waitForSignIn returns a promise so the resolve waits for it to complete
        return Auth.$waitForSignIn();
      }]
    }
  }).when("/account", {
    // the rest is the same for ui-router and ngRoute...
    controller: "AccountCtrl",
    templateUrl: "views/login.html",
    resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
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
  
  });
}]);


app.controller("AccountCtrl", ["currentAuth", "$scope", "$firebaseAuth", "$mdToast", function(currentAuth, $scope, $firebaseAuth, $mdToast) {
  // currentAuth (provided by resolve) will contain the
  // authenticated user or throw a $routeChangeError (see above) if not signed in
}]);

app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

app.controller("LoginCtrl", [ "$scope", "$firebaseAuth", "$mdToast","$location", function( $scope, $firebaseAuth, $mdToast, $location) {
  // currentAuth (provided by resolve) will contain the
  // authenticated user or throw a $routeChangeError (see above) if not signed in
  var auth = $firebaseAuth();

  $scope.notifyToast = function(msg) {

    $mdToast.show(
      $mdToast.simple()
        .textContent(msg)
        .position('top right')
        .hideDelay(3000)
    );
  };

  $scope.login = function(email, password){
    auth.$signInWithEmailAndPassword(email, password).then(function(firebaseUser) {
      console.log("Signed in as:", firebaseUser.uid);
      $scope.notifyToast('You have successfully signed in');
      $location.path("/home");

    }).catch(function(error) {
      console.error("Authentication failed:", error.message);
      $scope.notifyToast(error.message)

    });
  }
 
}]);

app.controller('HomeCtrl', ['currentAuth','$scope','$timeout', '$mdSidenav', '$log', '$mdBottomSheet', '$mdDialog', '$mdToast','$http', '$q', '$mdEditDialog','$firebaseArray', '$firebaseObject','students', function(currentAuth,$scope, $timeout, $mdSidenav,$log, $mdBottomSheet, $mdDialog,$mdToast, $http, $q, $mdEditDialog, $firebaseArray, $firebaseObject, students){
 
  $scope.dataToast = function(msg) {

    $mdToast.show(
      $mdToast.simple()
        .textContent(msg)
        .position('top right')
        .hideDelay(3000)
    );
  };


  var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

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


          $scope.dataToast('Scanned');

           

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

students.$loaded()
  .then(function() {
    $scope.students = students[0];
  }).catch(function(err) {
    console.error(err);
  });


  students.$watch(function() {
    console.log("data changed!");
    $scope.dataToast('Data has changed');
    
  });
  $timeout(function () {

  $scope.students = students[0];
    $scope.labels = [];
    $scope.series = [];
    $scope.data = [];
    angular.forEach($scope.students.data, function(value, key) {
     $scope.labels.push(value.name);
     $scope.series.push(value.type);
     $scope.data.push(value.math.value);
   }); }, 1000);

    

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





