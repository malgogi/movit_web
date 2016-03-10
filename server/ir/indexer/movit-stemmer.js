var stemmer = require('porter-stemmer').stemmer;
var fs = require( 'fs' );

function removeSpecificChar( str ) {
	var newStr = "";
	var list = str.match( /([a-zA-Z0-9]|(<s>)|(<\/s>))/gi );
	for( var i in list ) {
		newStr += list[i].toLowerCase();
	}

	return newStr;
}

process.argv.splice( 0, 2 );

var str = "";
for( var i in process.argv ) {
	str += " "+ stemmer( removeSpecificChar( process.argv[ i ] ) );
}

console.log ( str );
