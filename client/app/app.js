angular.module('youtube', [
  'youtube.service',
  'youtube.auth',
  'youtube.songs',
  'youtube.giffy',
  'ngRoute'
])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .when('/youtube', {
      templateUrl: 'app/youtube/youtube.html',
      controller: 'YoutubeController',
      authenticate: true
    })
    .when('/giffy', {
      templateUrl: 'app/giffy/giffy.html',
      controller: 'GiffyController',
      authenticate: true
    })
    .when('/signout', {
      })
    .otherwise({ redirectTo: '/youtube' });

    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.assessment');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  if($location.$$path == '/signout'){
    Auth.signout();
  }

  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    //console.log('Authenticate ',next.$$route.authenticate)
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});
