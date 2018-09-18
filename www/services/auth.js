app.factory('AuthService',
  ['$rootScope', '$filter', '$timeout','$firebaseAuth', '$firebaseObject',
  '$location',
  function($rootScope,$filter, $timeout, $firebaseAuth, $firebaseObject, 
    $location) {

  var ref = new firebase.database().ref();
  var auth = firebase.auth();
  var storeRef = new firebase.storage();
 var storageRef = storeRef.ref();
  $rootScope.created = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

   auth.onAuthStateChanged(function(authUser) {
    if (authUser) {
      var userRef = ref.child('users/' + authUser.uid );
      var userObj = $firebaseObject(userRef);
      $rootScope.currentUser = userObj;
    } else {
      $rootScope.currentUser = '';
    }
  });
  
 function authUserCallback(authUser) {
  if (authUser) {
    console.log("User " + authUser.uid + " is logged in with " + authUser.provider);
  } else {
    console.log("User is logged out");
     $location.path('/login');
     $rootScope.message = "Your session has expired. Please re-login to continue.";
  }
}
  

  var myObject = {
    login: function(user) {
      auth.signInWithEmailAndPassword(
        user.email,
        user.password
             ).then(function(regUser) {
               
        $location.path('/main');
      }).catch(function(error) {
       $rootScope.loginerrormessage = error.message;
      });
    }, //login

    logout: function() {
        auth.signOut().then(function(){
             $rootScope.message = "you have successfully signed out.";
        }, function(error){
            alert("logoout error" + error);
        });

            
    }, //logout

    requireAuth: function() {
     return auth.currentUser;
    }, //require Authentication

changePassword: function(user){
    ref.changePassword({
  email: user.email,
  oldPassword: user.oldpassword,
  newPassword: user.newpassword
}, function(error) {
  if (error) {
    switch (error.code) {
      case "INVALID_PASSWORD":

       $timeout(function () {
          $rootScope.changestatus ="alert alert-danger alert-dismissible";
        $rootScope.changemessage ="The specified user account password is incorrect.";
             
              }, 1000);
    
        break;
      case "INVALID_USER":
        $timeout(function () {
          $rootScope.changestatus ="alert alert-danger alert-dismissible";
        $rootScope.changemessage ="The specified user account does not exist.";
                           }, 1000);
        
        break;
      default:
        $timeout(function () {
          $rootScope.changestatus ="alert alert-danger alert-dismissible";
        $rootScope.changemessage =("Error changing password:", error);
                           }, 1000);
        
           }
  } else {
    console.log("User password changed successfully!");
  }
});

},

resetPassword: function(user) {
        ref.resetPassword({
  email: user.email
}, function(error) {
  if (error) {
    switch (error.code) {
      case "INVALID_USER":

      $timeout(function () {
          $rootScope.status ="alert alert-danger alert-dismissible";
        $rootScope.resetmessage ="The specified user account does not exist.";
             
              }, 1000);
     
        break;
      default:

        $timeout(function () {
           $rootScope.status ="alert alert-danger alert-dismissible";
         $rootScope.resetmessage=("Error resetting password:", error);
              }, 1000);

              
    }
  } else {

      
        $timeout(function () {
           $rootScope.status ="alert alert-success alert-dismissible";
     $rootScope.resetmessage="Password reset email sent successfully! Please check your email for instructions.";
                   }, 1000);

        }
});
},

    register: function(user) {
        console.log(user);
      auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(function(regUser) {
                       
            //      var file = document.getElementById('input').files[0];
                
            //      var uploadTask = storageRef.child('profileimages/' + file.name).put(file);
                  
           //       uploadTask.on('state_changed', function (snapshot) {
           //           var imageURL = uploadTask.snapshot.downloadURL; 
                   
                     
        ref.child("users/")
        .child(regUser.uid).set({
          date: $rootScope.created,
          regUser: regUser.uid,
          firstname: user.firstname,
          lastname: user.lastname,
          address: user.address.formatted_address,
          bio: user.bio,
          status: 1,
        //  picurl: imageURL,
          email:  user.email
        }); //user info

        $location.path('/');
                  
      }).catch(function(error) {
        $rootScope.loginerrormessage = error.message;
        console.log(error.message);
      }); // //createUser
      
    } // register
  };

  return myObject;
}]); //factory