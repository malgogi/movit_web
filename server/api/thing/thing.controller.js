/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 */

'use strict';

var exec = require('child_process').exec,
	stemmer = require('porter-stemmer').stemmer,
	net = require( 'net' ),
    child,
    QueryModel = require('../../model/Query');

function removeSpecificChar( str ) {
	var newStr = "";
	var list = str.match( /([a-zA-Z0-9]|(<s>)|(<\/s>))/gi );
	for( var i in list ) {
		newStr += list[i].toLowerCase();
	}

	return newStr;
}

function chunckData( content ) {
	var list = content.split( " " );
	var newList = [];
	list.forEach( function ( item, itemIdx ) {
		var newStr = stemmer( removeSpecificChar( item ) );
		if( newStr !== "" ) {
			newList.push( newStr );
		}
	});

	return newList;
}

// Gets a list of Things
exports.index = function(req, res) {
	//console.log( __dirname );
	res.json([{
  		name : ""
  	}]);
	
};

var mongoStore = function(query){

	

	var silence = new QueryModel({name: query});
	console.log(silence.name);

	silence.save(function (err, silence){
		if(err) return console.error(err);
		
	});

}

exports.search = function( req, res ) {
	var q = decodeURIComponent( req.query[ 'query' ] );
	var newQ  = "";
	var qList = chunckData( q );
	
	qList.forEach( function ( value, idx ) {
		newQ += value + " ";
	})

	//mongoDB store query
	mongoStore(newQ);



	// prev vesion language model
	// child = exec( 'python ' + __dirname + '/../../ir/rank/rank.py "' + newQ + '"',
	// 	function( error, stdout, stderr ) {
	// 		console.log ( 'response search' );
	// 		res.json( JSON.parse( stdout ) );
	// 	});


	// new version svd
	var client = new net.Socket();

	client.connect( 9090, '127.0.0.1', function() {
		console.log('Connected');
		client.write( newQ );
	});

	client.on('readable', function() {
		var total;
	  	var chunk;
	  	while (null !== (chunk = client.read())) {
	    	total += chunk.toString('utf-8');
	  	}
	  	res.json( JSON.parse( total.toString('utf-8') ) );
	  	client.destroy(); // kill client after server's response
	});

	client.on('data', function(data) {
		try {
			var parsed = JSON.parse( data.toString('utf-8' ) );
			res.json(  parsed );
		} catch ( e ) {
			res.json( 500, []);
		}	
		
		//console.log('Received: ' + data );
		client.destroy(); // kill client after server's response
	});

	client.on('close', function() {
		console.log('Connection closed');
	});
	//res.json(  200, [] );
	
}

exports.crawl = function( req, res ) {
	
	child = exec( 'scrapy runspider ' + __dirname + '/../../ir/cralwer/movie_name_spider.py -o movie_name.json',
		function( error, stdout, stderr ) {
			console.log( error );
			console.log( stdout );
			console.log( stderr );
			res.json([{
				"trigger" : error
			}]);
		});
};
