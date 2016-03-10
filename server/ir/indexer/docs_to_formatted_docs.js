var fs = require( 'fs' );
var obj = JSON.parse(fs.readFileSync('docs.json', 'utf8'));
var _ = require('lodash');
var stemmer = require('porter-stemmer').stemmer;
var output = [];
var stopWordChecker = require( './stop_word_checker' );


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
		if( newStr != ""
			&& !stopWordChecker.isStopWord( newStr )
			&& !stopWordChecker.isStopWord( item ) ) {
			newList.push( newStr );
		}
	});

	return newList;
}

function unigramListToBigramList( unigramList ) {
	var bigramList = [];
	var prevWord = "";
	unigramList.forEach( function ( unigram, unigramIdx ) {
		if( unigramIdx != 0 ) {
			bigramList.push( prevWord + " " + unigram );
		}
		

		prevWord = unigram;
	});

	return bigramList;
}

function countTotalWord( item ) {
	var cnt = 0;
	for(var i in item) {
	    if (item.hasOwnProperty( i )) {
	        cnt += item[ i ]; // only logs 'moo'
	    }
	}
	return cnt;
}

// var obj = [{
// 	movie_name : "zzzz",
// 	content : "<s> zz fjuia alkjf aif lajfa jif aio lkjfla aifoa lkajf ajopaa. </s> <s> zzzz </s> "
// }];

// {
// 	"name" : "the_martian",
// 	"url" : "/m/dddd",
//  "genre" : [ "comedy" ],
//	"actors" : [ "actors" ],
// 	"reply_content" :  {
// 		"unigram" : {
// 			"word1" : 5,
// 			"word2" : 3,
// 			"word3" : 10
// 		},
// 		"bigram" : {
// 			"word1 word2" : 10,
// 			"word2 word3" : 5
// 		}
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
// 	}
// }

obj.forEach( function ( doc, docIdx ) {
	var replyUnigramList = chunckData( doc.content );
	var replyBigramList = unigramListToBigramList( replyUnigramList );

	var movieUnigramList = chunckData( doc.movie_content );
	var movieBigramList = unigramListToBigramList( movieUnigramList );

	var formattedDocItem = {
		name : doc.movie_name,
		url : doc.movie_url,
		genre : doc.movie_genre,
		actors : doc.movie_actors,
		imgs : doc.movie_imgs,
		date : doc.date,
		content : doc.movie_content,
		reply_content : {
			unigram : {},
			bigram : {}
		},
		movie_content : {
			unigram : {},
			bigram : {}
		}
	};

	replyUnigramList.forEach( function ( newUnigram, newUnigramIdx ) {
		if( formattedDocItem.reply_content.unigram[ newUnigram ] == undefined ) {
			formattedDocItem.reply_content.unigram[ newUnigram ] = 1;
		} else {
			formattedDocItem.reply_content.unigram[ newUnigram ] += 1;
		}
	});

	replyBigramList.forEach( function ( newBigram, newBigramIdx ) {
		if( formattedDocItem.reply_content.bigram[ newBigram ] == undefined ) {
			formattedDocItem.reply_content.bigram[ newBigram ] = 1;
		} else {
			formattedDocItem.reply_content.bigram[ newBigram ] += 1;
		}
	});

	movieUnigramList.forEach( function ( newUnigram, newUnigramIdx ) {
		if( formattedDocItem.movie_content.unigram[ newUnigram ] == undefined ) {
			formattedDocItem.movie_content.unigram[ newUnigram ] = 1;
		} else {
			formattedDocItem.movie_content.unigram[ newUnigram ] += 1;
		}
	});

	movieBigramList.forEach( function ( newBigram, newBigramIdx ) {
		if( formattedDocItem.movie_content.bigram[ newBigram ] == undefined ) {
			formattedDocItem.movie_content.bigram[ newBigram ] = 1;
		} else {
			formattedDocItem.movie_content.bigram[ newBigram ] += 1;
		}
	});

	formattedDocItem.reply_content.unigram_length = countTotalWord( formattedDocItem.reply_content.unigram );
	formattedDocItem.reply_content.bigram_length = countTotalWord( formattedDocItem.reply_content.bigram );
	formattedDocItem.movie_content.unigram_length = countTotalWord( formattedDocItem.movie_content.unigram );
	formattedDocItem.movie_content.bigram_length = countTotalWord( formattedDocItem.movie_content.bigram );

	output.push( formattedDocItem );
	
});

fs.writeFile('formatted_docs.json', JSON.stringify( output, null, 4 ), function ( err ) {
	console.log ( err );
});