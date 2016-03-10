'use strict';

angular.module('movitWebApp')
  .directive('searchbar', function () {
    return {
      templateUrl: 'components/searchbar/searchbar.html',
      restrict: 'EA',
      controller: 'SearchbarCtrl',
      link: function (scope, element, attrs) {
      }
    };
  });
