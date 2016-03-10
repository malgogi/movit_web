var fs = require( 'fs' );
var obj = JSON.parse(fs.readFileSync('formatted_docs.json', 'utf8'));
var _ = require('lodash');
var stemmer = require('porter-stemmer').stemmer;

var output = { 
	name : "collection",
	reply_content : {
		unigram : {},
		bigram : {}	
	},
	movie_content : {
		unigram : {},
		bigram : {}	
	}
	
};


//Object.keys( test ).length;

// {
// 	"name" : "the_martian",
// 	"url" : "/m/dddd",
//  	"genre" : [ "comedy" ],
// 	"reply_content" :  {
// 		"unigram" : {
// 			"word1" : 5,
// 			"word2" : 3,
// 			"word3" : 10
// 		},
// 		"bigram" : {
// 			"word1 word2" : 10,
// 			"word2 word3" : 5
// 		},
// 		"unigram_length" : 10,
// 		"bigram_length" : 10
// 	},
// 	"movie_content" :  {
// 		"unigram" : {
// 			"word1" : 5,
// 			"word2" : 3,
// 			"word3" : 10
// 		},
// 		"bigram" : {
// 			"word1 word2" : 10,
// 			"word2 word3" : 5
// 		}
// 		"unigram_length" : 10,
// 		"bigram_length" : 10
// 	}
// }

function countTotalWord( item ) {
	var cnt = 0;
	for(var i in item) {
	    if (item.hasOwnProperty( i )) {
	        cnt += item[ i ]; // only logs 'moo'
	    }
	}
	return cnt;
}


obj.forEach( function ( doc, docIdx ) {
	var isFind = false;

	for( var unigramKey in doc.reply_content.unigram ) {
		if( doc.reply_content.unigram.hasOwnProperty( unigramKey ) ) {
			if( output.reply_content.unigram[ unigramKey ] == undefined ) {
				output.reply_content.unigram[ unigramKey ] = 1;
			} else {
				output.reply_content.unigram[ unigramKey ] += 1;
			}
		}
	}

	for( var bigramKey in doc.reply_content.bigram ) {
		if( doc.reply_content.bigram.hasOwnProperty( bigramKey ) ) {
			if( output.reply_content.bigram[ bigramKey ] == undefined ) {
				output.reply_content.bigram[ bigramKey ] = 1;
			} else {
				output.reply_content.bigram[ bigramKey ] += 1;
			}
		}
	}

	for( var unigramKey in doc.movie_content.unigram ) {
		if( doc.movie_content.unigram.hasOwnProperty( unigramKey ) ) {
			if( output.movie_content.unigram[ unigramKey ] == undefined ) {
				output.movie_content.unigram[ unigramKey ] = 1;
			} else {
				output.movie_content.unigram[ unigramKey ] += 1;
			}
		}
	}

	for( var bigramKey in doc.movie_content.bigram ) {
		if( doc.movie_content.bigram.hasOwnProperty( bigramKey ) ) {
			if( output.movie_content.bigram[ bigramKey ] == undefined ) {
				output.movie_content.bigram[ bigramKey ] = 1;
			} else {
				output.movie_content.bigram[ bigramKey ] += 1;
			}
		}
	}

	output.reply_content.unigram_length = countTotalWord( output.reply_content.unigram );
	output.reply_content.bigram_length = countTotalWord( output.reply_content.bigram );
	output.movie_content.unigram_length = countTotalWord( output.movie_content.unigram );
	output.movie_content.bigram_length = countTotalWord( output.movie_content.bigram );



	// output.forEach( function ( doc, docIdx ) {
	// 	if( doc.name == review.movie_name ) {
	// 		isFind = true;
	// 		output[ docIdx ].content += " " + review.content;
	// 	}
	// });

	// if( !isFind ) {
	// 	output.push( {
	// 		name : review.movie_name,
	// 		content : review.content
	// 	});
	// }
});

fs.writeFile('collection.json', JSON.stringify( output, null, 4 ), function ( err ) {
	console.log ( err );
});