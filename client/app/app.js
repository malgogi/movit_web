'use strict';

angular.module('movitWebApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap'
])
  .constant('ROTTEN_TOMATO_URL', 'http://www.rottentomatoes.com' )
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('search', {
          url : '/search/:query',
          templateUrl : 'app/search/search.html',
          controller : 'SearchCtrl'
        })
    
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
