import scrapy
import json

class movieSpider( scrapy.Spider ) :
	name = "movit"
	movie_name = "the_martian"
	allowed_domains = [ "www.rottentomatoes.com" ]
	#http://d3biamo577v4eu.cloudfront.net/api/private/v1.0/m/list/find?page=1&limit=30&type=in-theaters&sortBy=popularity
	#http://www.rottentomatoes.com/m/the_martian/reviews/
	#just crawling result.url
	start_urls = [
		"http://www.rottentomatoes.com/m/the_martian/reviews/"
	]

	def parse( self, response ) :
		# print response.url.split( "/" )
		# filename = response.url.split( "/" )[ 6 ] + '.html'
		# with open( filename, 'wb' ) as f :
		# 	f.write( response.body  )

		print 'response is'
		jsonresponse = json.loads(response.body_as_unicode())
		for item in jsonresponse[ 'results' ]:
			yield {
				"name" : item[ 'title' ],
				"url" : item[ 'url' ],
				"date" : item[ 'theaterReleaseDate' ],
				"imgs" : item[ 'posters' ],
				"actors" : item[ 'actors' ],
				"id" : item[ 'id' ]
			} 
		# for sel in response.css( '.review_table_row' ):
		# 	name = sel.css( '.critic_name::text' ).extract()[0]
		# 	date = sel.css( '.review_date::text' ).extract()[0]
		# 	content = sel.css( '.the_review::text' ).extract()[0]
		# 	score = sel.css( '.review_desc .subtle::text' ).extract()[0]
		# 	yield {
		# 		"movie_name" : movie_name
		# 		"name" : name,
		# 		"date" : date,
		# 		"content" : content,
		# 		"score" : score,
		# 	}
		# 	print name, date, content, score

		



	def start_requests(self):
		for i in xrange( 55 ):
			yield self.make_requests_from_url( "http://d3biamo577v4eu.cloudfront.net/api/private/v1.0/m/list/find?page=%d&limit=500&type=dvd-all&services=amazon;amazon_prime;flixster;hbo_go;itunes;netflix_iw;vudu&sortBy=release" % i )

