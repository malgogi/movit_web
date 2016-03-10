'use strict';

angular.module('movitWebApp')
  .controller('SearchCtrl', function ( $scope, $stateParams, $http, $window, ROTTEN_TOMATO_URL ) {
    $scope.message = 'Hello';
    $scope.movieList = [];
    $scope.currentTab = 0;
    
    $scope.showPage = function ( url ) {
        $window.open( ROTTEN_TOMATO_URL + url );
    };
    var init = function () {
        waitingDialog.show();
        if( $stateParams.query == null || $stateParams.query == undefined || $stateParams.query.trim() == '' ) {
            waitingDialog.hide();
            return ;
        }
        //https://docs.angularjs.org/api/ng/service/$http 참조해서 timeout 넣기
        $http.get('/api/things/search?query=' + $stateParams.query ).then(function(response) {
            waitingDialog.hide();

            console.log ( response );
            if ( response.status == 200 ) {
                $scope.movieList = response.data;    
                window.drawPieChart( window.makePieChartData( $scope.movieList, 'genre' ), '#pie-chart' );
                window.drawWordCloud( window.makeWordCloudData( $scope.movieList, 'topWord' ), '#word-cloud' );
                window.drawEdgeBundling( window.makeEdgeBundlingData( $scope.movieList, 'topWord', 2 ), '#edge-bundling' );
                //window.drawEdgeBundling( window.makeEdgeBundlingGenre( $scope.movieList, 'genre' ), '#edge-bundling' );
                window.drawBipatite( window.makeBipatiteData( $scope.movieList, 'genre' ), '#bipatite');
            }
            
            
        });
    }();
    
  });


