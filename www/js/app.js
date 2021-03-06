// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

(function() {


var app = angular.module('mynotes', ['ionic', 'mynotes.user', 'mynotes.notestore']);

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  });

  $stateProvider.state('list', {
    url: '/',
    templateUrl: 'templates/list.html',
    cache: false
  });  

  $stateProvider.state('edit', {
    url: '/edit/:noteId',
    templateUrl: 'templates/edit.html',
    controller: 'EditCtrl'
  });

  $stateProvider.state('add', {
    url: '/add',
    templateUrl: 'templates/edit.html',
    controller: 'AddCtrl'
  });

  $urlRouterProvider.otherwise('/');
});


app.controller('LoginCtrl', function($scope, $state, $ionicHistory, $ionicPopup, User) {
 
  $scope.credentials = {
    user: '',
    password: ''
  };

  $scope.login = function() {
    User.login($scope.credentials)
      .then(function () {        
        $ionicHistory.nextViewOptions({historyRoot: true});    
        $state.go('list');
      })
      .catch(function() { 

        var alertPopup = $ionicPopup.alert({
           title: 'Login Error',
           template: 'The username or password is incorrect.'
          });
      }); 
    };

   
});


app.controller('ListCtrl', function($scope, $state, $ionicHistory, NoteStore, User) {

  $scope.reordering = false;

  $scope.logout = function () {
    User.logout();     
    $ionicHistory.nextViewOptions({historyRoot: true}); 
    $state.go('login');
  };

  function refreshNotes () {
    NoteStore.list().then(function(notes) {
      $scope.notes = notes;
    });
  }
  
  refreshNotes();

  $scope.remove = function(noteId) {
    NoteStore.remove(noteId).then(refreshNotes);
  };

  $scope.move = function(note, fromIndex, toIndex) {
    NoteStore.move(note, fromIndex, toIndex);
  };

  $scope.toggleReordering = function () {
    $scope.reordering = !$scope.reordering;
  };

});

app.controller('AddCtrl', function($scope, $state, NoteStore) {
  $scope.note = {    
    title: '',
    description: ''
  };
  $scope.save = function (){
    NoteStore.create($scope.note).then(function(){
      $state.go('list');
    });
  };
});

app.controller('EditCtrl', function($scope, $state, NoteStore) {

  NoteStore.get($state.params.noteId).then(function(note ){
    $scope.note = note;
  });

  $scope.save = function (){
    NoteStore.update($scope.note).then(function() {
      $state.go('list');  
    });    
  };
});


app.run(function($rootScope, $state, $ionicPlatform, User) {
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    if (!User.isLoggedIn() && toState.name != 'login') {
      event.preventDefault();
      $state.go('login');
    }
  });
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

}());