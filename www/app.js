var app = angular.module('StudentApp', ['ngMessages', 'oc.lazyLoad', 'ngMaterial', 'leaflet-directive', 'ngMdIcons', 'ngRoute', 'firebase', 'chart.js', 'md.data.table', 'ngDraggable','angularMoment']);
// for ngRoute
app.run(["$rootScope", "$location", "$window", "Auth", "$firebaseAuth", function ($rootScope, $location, $window, Auth, $firebaseAuth) {



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

  $rootScope.$on("$routeChangeError", function (event, next, previous, error) {
    if (error === "AUTH_REQUIRED") {
      $location.path("/login");
    }
  });


}]);

app.factory("Students", ["$firebaseObject",
  function ($firebaseObject) {
    // create a reference to the database location where we will store our data
    var ref = firebase.database().ref('/students/-LBnJq348asrpMV0kAKi/');

    // this uses AngularFire to create the synchronized array
    return $firebaseObject(ref);
  }
]);

app.factory("Auth", ["$firebaseAuth",
  function ($firebaseAuth) {
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

app.config(function ($mdThemingProvider) {
  var customBlueMap = $mdThemingProvider.extendPalette('indigo', {
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50'],
    '50': '#00BFFF'
  });
  $mdThemingProvider.definePalette('blue', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('blue', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('red');
  $mdThemingProvider.theme('input', 'default')
    .primaryPalette('blue')
});

app.config(["$routeProvider", function ($routeProvider) {
  $routeProvider.when("/", {
    // the rest is the same for ui-router and ngRoute...
    controller: "pdsaCtrl",
    templateUrl: "views/pdsa.html",
    resolve: {
      "currentAuth": ["Auth", function (Auth) {
        return Auth.$requireSignIn();
      }]
    }
  }).when("/Partner", {
    // the rest is the same for ui-router and ngRoute...
    controller: "PartnerCtrl",
    templateUrl: "views/main.html",
    resolve: {
      "currentAuth": ["Auth", function (Auth) {
        return Auth.$requireSignIn();
      }]
    }
  }).when("/account", {
    // the rest is the same for ui-router and ngRoute...
    controller: "AccountCtrl",
    templateUrl: "views/login.html",
    access: { restricted: false, status: 0 },
    resolve: {

      "currentAuth": ["Auth", function (Auth) {
        // $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $routeChangeError (see above)
        return Auth.$requireSignIn();
      }]
    }
  }).when("/login", {
    // the rest is the same for ui-router and ngRoute...
    controller: "LoginCtrl",
    templateUrl: "views/login.html",
  }).when("/login/:appId", {
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


app.controller("AccountCtrl", ["Auth", "AuthService", "$scope", "$firebaseAuth", "$mdToast", "$firebaseObject", "$firebaseArray", "$location", function (Auth, AuthService, $scope, $firebaseAuth, $mdToast, $firebaseObject, $firebaseArray, $location) {

  $scope.notifyToast = function (msg) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(msg)
        .position('top right')
        .hideDelay(3000)
    );
  };

  $scope.createUser = function (user) {
    AuthService.register(user)
    $location.path('/');
  }

}]);


app.controller("LoginCtrl", ["$firebaseObject", "Auth", "$rootScope", "$scope", "$firebaseAuth", "$mdToast", "$location", "$routeParams", function ($firebaseObject, Auth, $rootScope, $scope, $firebaseAuth, $mdToast, $location, $routeParams) {


  var ref = new firebase.database().ref();


  if (Auth.$getAuth()) {

    if ($routeParams.appId) {
      $location.path('/' + $routeParams.appId);
    } else {
      $location.path('/');

    }
  };

  $scope.notifyToast = function (msg) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(msg)
        .position('top right')
        .hideDelay(3000)
    );
  };

  $scope.login = function (email, password) {
    Auth.$signInWithEmailAndPassword(email, password).then(function (firebaseUser) {
      $scope.notifyToast('You have successfully signed in');
      if (firebaseUser) {
        var userRef = ref.child('users/' + firebaseUser.uid);
        var userObj = $firebaseObject(userRef);
        $rootScope.currentUser = userObj;
        console.log("test:", $rootScope.currentUser);

      } else {
        $rootScope.currentUser = '';
      }
      if ($routeParams.appId) {
        $location.path("/" + $routeParams.appId);

      } else {
        $location.path("/");

      }

    }).catch(function (error) {
      console.error("Authentication failed:", error.message);
      $scope.notifyToast(error.message)

    });
  }

}]);

app.controller('pdsaCtrl', ['moment','$rootScope', '$filter', 'Auth', 'currentAuth', '$firebaseAuth', '$route', '$scope', '$timeout', '$mdSidenav', '$log', '$mdBottomSheet', '$mdDialog', '$mdToast', '$http', '$q', '$mdEditDialog', '$firebaseArray', '$firebaseObject', '$location', function (moment, $rootScope, $filter, Auth, currentAuth, $firebaseAuth, $route, $scope, $timeout, $mdSidenav, $log, $mdBottomSheet, $mdDialog, $mdToast, $http, $q, $mdEditDialog, $firebaseArray, $firebaseObject, $location) {

  $scope.myOptions = {
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [
        {
          ticks: { beginAtZero: true, max: 100 }
        }
      ]
    }
  }

  var firebaseUser = Auth.$getAuth();

  if (firebaseUser) {
    console.log("Signed in as:", firebaseUser.uid);
    var userRef = firebase.database().ref('users/' + firebaseUser.uid);
    var userObj = $firebaseObject(userRef);
    $rootScope.currentUser = userObj;
  }


  $scope.cancelSearch = function () {
    $scope.search = '';
    $scope.showSearch = !$scope.showSearch;

  }

  $scope.dataToast = function (msg) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(msg)
        .position('top right')
        .hideDelay(3000)
    );
  };

  var PdsaRef = firebase.database().ref('/pdsa');
  var Pdsa = $firebaseArray(PdsaRef);

  Pdsa.$loaded().then(function (data) {
    console.log(data === Pdsa);

  }).catch(function (err) {
    console.error(err);
    $scope.dataToast('Sorry:', err);
  });

  var InterRef = firebase.database().ref('/intervention');
  var Interventions = $firebaseArray(InterRef);

  Interventions.$loaded().then(function (data) {
    console.log(data === Interventions);

  }).catch(function (err) {
    console.error(err);
    $scope.dataToast('Sorry:', err);
  });

  $scope.interventions = Interventions;

  function getSum(total, num) {
    return total + num;
  }

  function groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
      var key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }

 

  var sortByProperty = function (property) {
    return function (x, y) {
      return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
    };
  };

 
  Interventions.$loaded()
    .then(function (x) {
      $scope.dataToast('Chart Data Loaded', x); 
    })
    .catch(function (error) {
      console.log("Error:", error);
    });

  Interventions.$watch(function (event) {
    $scope.labels = [];
    $scope.series = [];
    $scope.nameLabel = [];
    $scope.dataOne = [];
    $scope.dataTwo = [];
    $scope.multiChart = [];
    $scope.dateData = [];
    var sdata = [];
    var pdata = [];
    var mdata = [];
    var dlabels = [];
    var clabels = [];
    var fdata = [];
    
    $scope.pdsas = [];
   
      angular.forEach($scope.interventions, function (value, key) {
       
       if(value.pdsa) {
          $scope.labels.push(value.title);
          $scope.series.push(value.title);
  
          angular.forEach(value.pdsa, function (value, key) {
            $scope.pdsas.push(key, value);
            nlabel = value.title;
                      sdata.push(value.positive);
                      pdata.push(value.pop);
                      $scope.dateData.push(value.date);
                      clabels = (value.firstname);
                      var cal = value.positive / value.pop * 100;
                      mdata.push(Math.round(cal));
                      fdata = sdata.reduce(getSum) / pdata.reduce(getSum) * 100
                    });
                  
                    $scope.dataOne.push(sdata.length);
                    $scope.multiChart.push(mdata);
$scope.nameLabel.push(clabels);
                      $scope.dataTwo.push(Math.round(fdata));
                    }
                    sdata = [];
                    pdata = [];
                    mdata = [];
                    dlabels = [];
                    fdata = [];
            
      

              });

      
  });


  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.multiOptions = {
 
    legend: {
      display: true
   },
    scales: {
      xAxes: [{
        display: false,
        type: 'time',
        distribution: 'series'
      }],
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
          ticks: { beginAtZero: true, max: 100 }

        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: false,
          position: 'right',
          ticks: { beginAtZero: true, max: 100 }

        }
      ]
    }
  };


  $scope.signout = function () {
    Auth.$signOut().then(function () {
      $rootScope.currentUser = '';
      $route.reload();
      $location.path('/');
    });

  };

  $scope.showRunChart = function (id) {
    $scope.alert = '';
    var starttime = null;
    $mdBottomSheet.show({
      locals: { id: id, st: starttime },
      controller: pdsaModalCtrl,
      templateUrl: 'templates/runChart.html',
    }).then(function (clickedItem) {
      $scope.alert = clickedItem['name'] + ' clicked!';
    }).catch(function (error) {
    });
  };

  $scope.deleteRowCallback = function (rows) {
    $mdToast.show(
      $mdToast.simple()
        .content('Deleted row id(s): ' + rows)
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
    order: 'title',
    limit: 10,
    page: 1
  };



  $scope.editComment = function (event, dessert) {
    event.stopPropagation(); // in case autoselect is enabled

    var editDialog = {
      modelValue: dessert.comment,
      placeholder: 'Add a comment',
      save: function (input) {
        if (input.$modelValue === 'Donald Trump') {
          input.$invalid = true;
          return $q.reject();
        }
        if (input.$modelValue === 'Bernie Sanders') {
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

    if ($scope.options.largeEditDialog) {
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
    return ['Adapt', 'Adopt', 'Abandon'];
  };

  $scope.loadStuff = function () {
    $scope.promise = $timeout(function () {
      // loading
    }, 2000);
  };

  $scope.logItem = function (item) {
    console.log(item.title, 'was selected');
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
  $scope.isOpenRight = function () {
    return $mdSidenav('right').isOpen();
  };

  function buildToggler(navID) {
    return function () {
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


  function pdsaModalCtrl($scope, $mdDialog, id, st) {

    $scope.options = {
      responsive: true, 
      elements: 
    {       line: { fill: false,
      backgroundColor: 'blue',
      borderDash: [5, 5],
      borderColor: 'blue' },

        point: 
        {
            radius: 5,
            backgroundColor:'blue',
            hitRadius: 5,
            hoverRadius: 10,
            borderColor: 'red',
            hoverBorderWidth: 2
        }
    },         
      legend: {
        display: false
     },
      scales: {
        xAxes: [{
          
          display: true,
          type: 'time',
        }],
        yAxes: [
        
          {
            ticks: {
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                  return value + '%';
              },
              beginAtZero: true, max: 100
          },
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left',
      }
         ]
      }
    };
  
  
       $scope.draggableObjects = [];

    $scope.addStep = function (step) {
      $scope.draggableObjects.push({ detail: step.detail });
      $scope.steps.detail = [];
    }

     $scope.upStep = function (key, step) {
      var newRef = firebase.database().ref('/intervention/' + key + '/steps');
      var Inte = $firebaseArray(newRef);
      Inte.$add({ detail: step.detail });
      $scope.steps.detail = [];
    }

    $scope.delStep = function (index) {
      $scope.draggableObjects.splice(index, 1);
    }

      if (id) {
      var currentInterRef = firebase.database().ref('/intervention/' + id + '/');
      var currentInterObj = $firebaseObject(currentInterRef);
      $scope.currentInterObj = currentInterObj;
 
      $scope.label = [];
      $scope.data = [];
      $timeout(function () {
        $scope.currentPdsa = $scope.currentInterObj;
        console.log($scope.currentPdsa.pdsa);
    
        angular.forEach($scope.currentPdsa.pdsa, function (value, key) {
          console.log(value.positive);
                         var cal = value.positive / value.pop * 100;
                         $scope.data.push(cal);
                         $scope.label.push(value.date);
                 });
            }, 1000);
      
    }

     
  

    var InterRef = firebase.database().ref('/intervention');
    var Interventions = $firebaseArray(InterRef);

    Interventions.$loaded().then(function (data) {
      console.log(data === Interventions);

    }).catch(function (err) {
      console.error(err);
      $scope.dataToast('Sorry:', err);
    });

    $scope.Interventions = Interventions;

    $scope.addIntervention = function () {
      var created = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
      $scope.Interventions.$add({
        userId: $rootScope.currentUser.$id,
        firstname: $rootScope.currentUser.firstname,
        date: created,
        title: $scope.intervention.title,
        description: $scope.intervention.description,
        expectedResult: $scope.intervention.expectedResult
      }).then(function (data) {
        console.log(data.key.key);
        var newRef = firebase.database().ref('/intervention/' + data.key + '/steps');
        var Inte = $firebaseArray(newRef);

        angular.forEach($scope.draggableObjects, function (value, key) {
          Inte.$add({ detail: value.detail });

        });

        $mdDialog.cancel();

      })
    };


    $scope.submitPDSA = function () {
      var dateNow = firebase.database.ServerValue.TIMESTAMP;
      var subdate = new Date();
      var diff = (subdate - st) / 1000;
      var InterRef = firebase.database().ref('/intervention/' + id + '/pdsa/');
      var Interventions = $firebaseArray(InterRef);
      Interventions.$add({
        userId: $rootScope.currentUser.$id,
        firstname: $rootScope.currentUser.firstname,
        title: $scope.currentInterObj.title,
        interId: $scope.currentInterObj.$id,
        pop: $scope.data.pop,
        positive: $scope.data.plus,
        date: dateNow,
        diff: diff,
        negative: $scope.data.minus,
        action: $scope.pdsa.action
      }).then(function () {
        $mdDialog.cancel();

      })

    };



    $scope.onDropComplete = function (index, obj, evt) {
      var otherObj = $scope.draggableObjects[index];
      var otherIndex = $scope.draggableObjects.indexOf(obj);
      $scope.draggableObjects[index] = obj;
      $scope.draggableObjects[otherIndex] = otherObj;
    }

       $scope.hide = function () {
      $mdDialog.hide();
    };
    $scope.cancel = function () {
      $mdDialog.cancel();
    };
  }

  $scope.addIntervention = function (ev, id) {
    var starttime = firebase.database.ServerValue.TIMESTAMP;
    $scope.interid = id;
    $mdDialog.show({
      locals: { id: $scope.interid, st: starttime },
      controller: pdsaModalCtrl,
      templateUrl: 'views/addIntervention.html',
      closeTo: 'button',
      parent: angular.element(document.body),
      fullscreen: true,
      targetEvent: ev,
    })
      .then(function (answer) {
        console.log(answer);
        $scope.stype = answer;
      });
  };


  $scope.editIntervention = function (ev, id) {
    var starttime = firebase.database.ServerValue.TIMESTAMP;
    $scope.interid = id;
    $mdDialog.show({
      locals: { id: $scope.interid, st: starttime },
      controller: pdsaModalCtrl,
      templateUrl: 'views/editIntervention.html',
      closeTo: 'button',
      parent: angular.element(document.body),
      fullscreen: true,
      targetEvent: ev,
    })
      .then(function (ev) {
        console.log(ev);
      });
  };

  $scope.addPDSA = function (ev, id) {
    var starttime = new Date();
    var interId = id;
    $mdDialog.show({
      locals: { id: interId, st: starttime },
      controller: pdsaModalCtrl,
      templateUrl: 'views/addPDSA.html',
      fullscreen: true,
      targetEvent: ev,
    })
      .then(function (id) {
        console.log(id);

      });
  };


}]);

app.controller('PartnerCtrl', ['$rootScope', 'Auth', 'currentAuth', '$firebaseAuth', '$route', '$scope', '$timeout', '$mdSidenav', '$log', '$mdBottomSheet', '$mdDialog', '$mdToast', '$http', '$q', '$mdEditDialog', '$firebaseArray', '$firebaseObject', 'Students', '$location', function ($rootScope, Auth, currentAuth, $firebaseAuth, $route, $scope, $timeout, $mdSidenav, $log, $mdBottomSheet, $mdDialog, $mdToast, $http, $q, $mdEditDialog, $firebaseArray, $firebaseObject, Students, $location) {

  $scope.cancelSearch = function () {
    $scope.search = '';
    $scope.showSearch = !$scope.showSearch;

  }

  $scope.dataToast = function (msg) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(msg)
        .position('top right')
        .hideDelay(3000)
    );
  };

  Students.$loaded().then(function (data) {
    console.log(data === Students);

  }).catch(function (err) {
    console.error(err);
    $scope.dataToast('Sorry:', err);
  });

  $scope.students = Students;

  Students.$bindTo($scope, "students").then(function () {
    console.log($scope.students);
    $scope.dataToast('Student Data Updated');

  });
  var ArrayRef = firebase.database().ref('/students/-LBnJq348asrpMV0kAKi/data');

  var chartData = $firebaseArray(ArrayRef);
  chartData.$loaded()
    .then(function (x) {
      $scope.dataToast('Chart Data Loaded', x);
    })
    .catch(function (error) {
      console.log("Error:", error);
    });

  chartData.$watch(function (event) {
    $scope.labels = [];
    $scope.series = [];
    $scope.dataOne = [];
    angular.forEach(chartData, function (value, key) {
      $scope.labels.push(value.name);
      $scope.series.push(value.type);
      $scope.dataOne.push(value.math.value);
    });
  });

  $scope.signout = function () {
    Auth.$signOut().then(function () {
      $rootScope.currentUser = '';
      $route.reload();
      $location.path('/');
    });

  };

  $scope.showListBottomSheet = function () {
    $scope.alert = '';
    $mdBottomSheet.show({
      templateUrl: 'templates/tutorstudentlist.html',
    }).then(function (clickedItem) {
      $scope.alert = clickedItem['name'] + ' clicked!';
    }).catch(function (error) {
    });
  };


  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };


  $scope.deleteRowCallback = function (rows) {
    $mdToast.show(
      $mdToast.simple()
        .content('Deleted row id(s): ' + rows)
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
        if (input.$modelValue === 'Donald Trump') {
          input.$invalid = true;
          return $q.reject();
        }
        if (input.$modelValue === 'Bernie Sanders') {
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

    if ($scope.options.largeEditDialog) {
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
  $scope.isOpenRight = function () {
    return $mdSidenav('right').isOpen();
  };

  function buildToggler(navID) {
    return function () {
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

  $scope.addPartner = function (ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/addPartner.html',
      closeTo: 'button',
      parent: angular.element(document.body),
      fullscreen: true,
      targetEvent: ev,
    })
      .then(function (answer) {
        console.log(answer);
        $scope.stype = answer;
      });
  };

  $scope.showAdd = function (ev, id) {
    $scope.eventid = id;
    $mdDialog.show({
      locals: { id: $scope.eventid },
      controller: DetailController,
      templateUrl: 'addPDSA.html',
      fullscreen: true,
      targetEvent: ev,
    })
      .then(function (id) {
        console.log(id);

      });
  };

}]);


function DetailController($scope, $http, $mdDialog, id) {

  console.log(id);
  $scope.hide = function () {
    $mdDialog.hide();
  };
  $scope.cancel = function () {
    $mdDialog.cancel();
  };
}

function DialogController($scope, $mdDialog, ) {

  $scope.stepChanged = function () {
    console.log('step changed');
  };

  $scope.wizardSaved = function () {
    console.log('save clicked');
  };

  $scope.hide = function () {
    $mdDialog.hide();
  };
  $scope.cancel = function () {
    $mdDialog.cancel();
  };
  $scope.answer = function (answer) {
    $mdDialog.hide(answer);
  };
}





