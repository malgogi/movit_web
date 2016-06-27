/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 */

'use strict';

var exec = require('child_process').exec,
	stemmer = require('porter-stemmer').stemmer,
	net = require( 'net' ),
	N3 = require( 'n3' ),
    child,
    fs = require( 'fs' ),
    Random = require("random-js"),
    Promise = require( 'promise' ),
    QueryModel = require('../../model/Query');


//remove special char
function movieNameFormatter( myStr ) {
    return myStr.replace( /[^a-zA-Z0-9]/gi, '_' );
};

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

function makeMovieQueryData( movieName, callback ) {

// query format
// 	{ :Mississippi_Grind :alsoLike ?O2. } 
// => 
// { 
//   	:Mississippi_Grind 
//   		:id ?I1;
// 	  	:genre ?G1;
// 	  	:actor ?A1;
// 	  	:alsoLike ?O2;
// 	  	:date ?D1.
// }.

	var prefix = "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.\n";
	prefix += "@prefix owl: <http://www.w3.org/2002/07/owl#>.\n";
	prefix += "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.\n";
	prefix += "@prefix log: <http://www.w3.org/2000/10/swap/log#>.\n";
	prefix += "@prefix math: <http://www.w3.org/2000/10/swap/math#>.\n";
	prefix += "@prefix list: <http://www.w3.org/2000/10/swap/list#>.\n";
	prefix += "@prefix e: <http://eulersharp.sourceforge.net/2003/03swap/log-rules#>.\n";
	prefix += "@prefix prolog: <http://eulersharp.sourceforge.net/2003/03swap/prolog#>.\n";
	prefix += "@prefix genres: <http://localhost:9000/n3/genres#>.\n";
	prefix += "@prefix actors: <http://localhost:9000/n3/actors#>.\n";
	prefix += "@prefix : <http://localhost:9000/n3/movies#>.\n";
	prefix += "@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.\n\n";
	
	var query = "{ " + ":" + movieName + " :alsoLike ?O2. }\n => ";
		query += "{ " + ":" + movieName + "\n"
			  + " :id ?I1;\n"
			  + " :genre ?G1;\n"
			  + " :actor ?A1;\n"
			  + " :alsoLike ?O2;\n"
		  	  + " :date ?D1. }";

	var r = new Random(Random.engines.mt19937().seedWithArray([0x12345678, 0x90abcdef]));
	var curDate = new Date();
	var randomQueryFileName = "";
		randomQueryFileName +=  curDate.getFullYear() + curDate.getMonth() + curDate.getDate() + curDate.getMilliseconds();
		randomQueryFileName += '_' + r.integer( 0, 100000 );
		randomQueryFileName += '.n3';
		
	fs.writeFile( __dirname + '/../../n3/query/' + randomQueryFileName, prefix + query, function ( err ) {
		if( err ) {
			callback( undefined );
		} else {
			callback( randomQueryFileName );
		}
	})

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

	//temp comment;
	//mongoStore(newQ);



	// prev vesion language model
	// child = exec( 'python ' + __dirname + '/../../ir/rank/rank.py "' + newQ + '"',
	// 	function( error, stdout, stderr ) {
	// 		console.log ( 'response search' );
	// 		res.json( JSON.parse( stdout ) );
	// 	});


	//temp comment
	// new version svd
	// var client = new net.Socket();

	// client.connect( 9090, '127.0.0.1', function() {
	// 	console.log('Connected');
	// 	client.write( newQ );
	// });

	// client.on('readable', function() {
	// 	var total;
	//   	var chunk;
	//   	while (null !== (chunk = client.read())) {
	//     	total += chunk.toString('utf-8');
	//   	}
	//   	res.json( JSON.parse( total.toString('utf-8') ) );
	//   	client.destroy(); // kill client after server's response
	// });

	// client.on('data', function(data) {
	// 	try {
	// 		var parsed = JSON.parse( data.toString('utf-8' ) );
	// 		res.json(  parsed );
	// 	} catch ( e ) {
	// 		res.json( 500, []);
	// 	}	
		
	// 	//console.log('Received: ' + data );
	// 	client.destroy(); // kill client after server's response
	// });

	// client.on('close', function() {
	// 	console.log('Connection closed');
	// });
	res.json(  200, [] );
	
}

exports.detail = function( req, res ) {
	var parser = N3.Parser();
	// parser.parse('@prefix c: <http://example.org/cartoons#>.\n' +
	// 	'c:Tom a c:Cat.\n' +
	// 	'c:Jerry a c:Mouse;\n' +
	// 	'        c:smarterThan c:Tom.',
	// 	function (error, triple, prefixes) {
	// 	if (triple)
	// 	 console.log(triple.subject, triple.predicate, triple.object, '.');
	// 	else
	// 	 console.log("# That's all, folks!", prefixes)
	// 	});
	var movieName = movieNameFormatter( req.query.movie_name ); 
	var retData = {
		prefixes : [],
		triple : []
	};

	

	fs.readFile( __dirname + '/../../n3/movie/' + movieName + '.n3', 'utf8', function( err, data ) {
		if ( !err ) {
			//for parser
			new Promise( function ( fulfill, reject ) {
				parser.parse( data, function( error, triple, prefixes ) {
					if( triple ) {
						retData.triple.push( triple );	
					} else {
						fulfill( retData );
					}
					//console.log( triple );
					
				});
			}).then( function ( parserRes, parserErr ) {
				if( !parserErr ) {
					res.status( 200 ).json( parserRes );
				} else {
					res.status( 200 ).json( [] );				
				}
			});
		} else {
			makeMovieQueryData( movieName, function ( fileName ) {
				//execute eye.sh
				res.status( 200 ).json( [] );
			});
			
			//if file not found, will make a query
			
		}
	});

	
};

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
