angular.module('starsApp').factory('AuthService',
  ['$q', '$timeout', '$http','$rootScope',
  function ($q, $timeout, $http, $rootScope) {

    // create user variable
    var user = null;

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register,
    
     
      
    });

      function isLoggedIn() {

      if(user) {
        return true;
      } else {
        return false;
      }
    }


     
    function getUserStatus() {
      return $http.get('http://192.168.8.100/api/profile')
      // handle success
      .then(function (response) {

       if (response.data != '0') {
 $rootScope.userStatus = response.data.status;
 $rootScope.currentUser = response.data
          user = true;

        } else {
          $rootScope.userStatus = null;
            $rootScope.currentUser = null
          user = false;

        }
      });
      
    }

   
    function login(username, password, rememberMe) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('http://192.168.8.100/api/login',
        {username: username, password: password, rememberMe:rememberMe})
        // handle success
        .then(function (response) {
        
          if(response.status === 200 && response.data.status){
           
            
            $http.get("http://192.168.8.100/api/profile").then(function(user) { 
               
    if(user.data !='0') {
     
$rootScope.currentUser = user.data;
console.log($rootScope.currentUser)
     }
  });
  deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        }, function errorCallback(err) {
  $rootScope.loginError = err.data.err.message;
         
        })
      
      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/api/logout')
        // handle success
        .then(function (data) {
          user = false;
          deferred.resolve();
        })
       
      // return promise object
      return deferred.promise;

    }

      function register(username, password, firstname, lastname, picUrl) {
       // create a new instance of deferred
      var deferred = $q.defer();

  $http.post('http://192.168.8.100/api/register', {username: username, password: password, picUrl:picUrl, firstname: firstname, lastname: lastname, status:0})
    // handle success
    .then(function (response) {
        if(response.status === 200 && response.data.status){
           
            $http.get("http://192.168.8.100/api/profile").then(function(user) { 
               
    if(user.data !='0') {
     
$rootScope.currentUser = user.data;

     }
  });
  deferred.resolve();

    } else {
            user = false;
            deferred.reject();
          }

    });
      // return promise object
      return deferred.promise;
}
}]);