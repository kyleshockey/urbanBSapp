angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})
.controller('LobbyCtrl', function($scope, $stateParams, $http) {
  // for viewing purposes only, will be removed when functionality is added -Kir
  var self = this;
  console.log('lets get gamedata')
  $http.get('http://localhost:3000/gameData')
    .success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
      console.log(data)
      $scope.games = data;
    })
    .error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });

})

.controller('GameCtrl', function($scope, $stateParams, $http, Game, Players){
  var self = this;
  var url = 'http://localhost:3000/gameData/';

  // playerinvite object contains input from user to invite
  $scope.playerInvite = {};

  // set index of game from hyperlink clicked in lobby
  var index = +[$stateParams['gameId']];

  // initially load page with available games
  console.log('lets get gamedata')
   $http.get(url)
    .success(function(data, status, headers, config) {

      $scope.gameData = data[index];
      $scope.getQuestion();
    })
    .error(function(data, status, headers, config) {
      console.log(error)
  });


    $scope.getQuestion = function() {
      console.log($scope.gameData)
      $scope.gameData.currentQuestion = Game.getQuestion().question;
    }


    $scope.invitePlayer = function() {
      var player = Game.invitePlayer($scope.playerInvite.username);

      if (typeof player === "object") {
        $scope.gameData.players.push(player);
      }

      $scope.playerInvite = {};
    };

})

.controller('LoginCtrl', function ($scope, $state, $cookieStore) {
 
    // FB Login
    $scope.fbLogin = function () {
        FB.login(function (response) {
            if (response.authResponse) {
                getUserInfo();
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {scope: 'email,user_photos,user_videos'});
 
        function getUserInfo() {
            // get basic info
            FB.api('/me', function (response) {
                console.log('Facebook Login RESPONSE: ' + angular.toJson(response));
                // get profile picture
                FB.api('/me/picture?type=normal', function (picResponse) {
                    console.log('Facebook Login RESPONSE: ' + picResponse.data.url);
                    response.imageUrl = picResponse.data.url;
                    console.log('Facebook response body' + json.response)
                    // store data to DB - Call to API
                    // Todo
                    // After posting user data to server successfully store user data locally
                    var user = {};
                    user.name = response.name;
                    user.email = response.email;
                    if(response.gender) {
                        response.gender.toString().toLowerCase() === 'male' ? user.gender = 'M' : user.gender = 'F';
                    } else {
                        user.gender = '';
                    }
                    user.profilePic = picResponse.data.url;
                    $cookieStore.put('userInfo', user);
                    $state.go('dashboard');
 
                });
            });
        }
    };
  });
    // END FB Login
