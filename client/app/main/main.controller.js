'use strict';
(function() {

function MainController($scope, $http, $state ) {
  var self = this;
  this.awesomeThings = [];
  $scope.query = '';
  $scope.move = {
  	search : function () {
  		$state.go( 'search', {
        query : encodeURIComponent( $scope.query )
      });
  	}
  };
  $http.get('/api/things').then(function(response) {
    self.awesomeThings = response.data;
  });
}

angular.module('movitWebApp')
  .controller('MainController', MainController);

})();
