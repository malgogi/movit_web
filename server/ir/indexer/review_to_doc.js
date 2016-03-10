var fs = require( 'fs' );
var obj = JSON.parse(fs.readFileSync('movie.json', 'utf8'));
var _ = require('lodash');
var output = [];


// {
// 	name : "",
// 	content : ""
// }
obj.forEach( function ( review, reviewIdx ) {
	var isFind = false;
	output.forEach( function ( doc, docIdx ) {
		if( doc.name == review.movie_name ) {
			isFind = true;
			output[ docIdx ].content += "<s> " + review.content + " </s> ";
		}
	});

	if( !isFind ) {
		output.push({
			name : review.movie_name,
			url : review.movie_url,
			genre : review.movie_genre,
			movie_content : "<s> " + review.movie_content + " </s> ",
			actors : review.movie_actors,
			content : "<s> " + review.content + " </s> ",
			imgs : review.movie_imgs,
			date : review.date
		});
	}
});

fs.writeFile('docs.json', JSON.stringify( output, null, 4 ), function ( err ) {
	console.log ( err );
});