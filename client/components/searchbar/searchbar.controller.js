'use strict';

angular.module('movitWebApp')
  .controller('SearchbarCtrl', function ( $scope, $state ) {
	$scope.query = '';
	$scope.move = {
		search : function ( ) {
			$state.go( 'search', {
				query : encodeURIComponent( $scope.query )
			});
		}
	};

    $scope.isCollapsed = true;
  });
