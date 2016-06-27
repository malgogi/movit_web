'use strict';

angular.module('movitWebApp')
  .controller('MultipleCarouselCtrl', function ($scope) {
  		$scope.myInterval = 3000000;
		  $scope.slides = [
		    [
		      'http://resizing.flixster.com/Pz0KeBbil3XmA59WotTZQJIcwVY=/180x267/dkpu1ddg7pbsk.cloudfront.net/movie/11/18/08/11180844_ori.jpg',
		      'http://resizing.flixster.com/w2d4Y9WP5Zx-NdrI9kUs2Cdh9Nw=/180x266/dkpu1ddg7pbsk.cloudfront.net/movie/11/19/16/11191640_ori.jpg',
		      'http://resizing.flixster.com/y49rv5B_Av5HPKh9mup2_0JzQVQ=/319x426/dkpu1ddg7pbsk.cloudfront.net/movie/11/20/02/11200233_ori.jpg'
		    ],
		    [
		      'http://resizing.flixster.com/8c90N0zu2eikSYt3o-OZcj40P5E=/180x267/dkpu1ddg7pbsk.cloudfront.net/movie/11/16/42/11164268_ori.jpg',
		      'http://resizing.flixster.com/Bmz7JFcMnV4jIHUmJhbtd1pT9pg=/180x267/dkpu1ddg7pbsk.cloudfront.net/movie/11/19/17/11191738_ori.jpg',
		      'http://resizing.flixster.com/YHnZeqtfx2kj5xCHa9IutzODH5A=/180x267/dkpu1ddg7pbsk.cloudfront.net/movie/11/19/14/11191450_ori.jpg'
		    ]
		  ];


  });