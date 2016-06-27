'use strict';

angular.module('movitWebApp')
  .controller('DetailCtrl', function ( $scope, $stateParams, $http ) {
    $scope.message = 'Hello';
    console.log( $stateParams.movie_name );
    //waitingDialog.show();
    $http.get('/api/things/detail?movie_name=' + $stateParams.movie_name ).then(function(response) {
            //waitingDialog.hide();

            console.log ( response );
            if ( response.status == 200 ) {
                console.log( response.data ); 
            }
            
            
        });
  });

