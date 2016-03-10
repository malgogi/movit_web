import scrapy
import json
from scrapy.http import Request

class movieSpider( scrapy.Spider ) :
	name = "movit"
	movie_name = "the_martian"
	allowed_domains = [ "www.rottentomatoes.com" ]
	#http://www.rottentomatoes.com/m/the_martian/reviews/
	start_urls = [
		"http://www.rottentomatoes.com/m/the_martian/reviews/"
	]
	#movie url http://www.rottentomatoes.com + item[ "url" ]
	#movie review url "http://www.rottentomatoes.com" + item["url"] + "reviews/?page=%d" % i

	def parse( self, response ) :
		#print response.url.split( "/" )
		# filename = response.url.split( "/" )[ 6 ] + '.html'
		# with open( filename, 'wb' ) as f :
		# 	f.write( response.body  )
		#review_table
			#review_table_row
				#critic_name a - name
				#review_container
					#review_area
						#review_date - date
						#review_desc
							#the_review - content
							#subtle - score

		print "response is : \n"
		print response.request.meta
		print "\n\nend response \n"


		for sel in response.css( '.review_table_row' ):
			response.request.meta[ 'item' ][ 'movie_name' ] = response.request.meta[ 'item' ][ 'name' ]
			response.request.meta['item' ][ 'date' ] = sel.css( '.review_date::text' ).extract()[0]
			response.request.meta[ 'item' ][ 'content' ] = sel.css( '.the_review::text' ).extract()[0]
			response.request.meta[ 'item' ][ 'score' ] = sel.css( '.review_desc .subtle::text' ).extract()[0]
			yield Request("http://www.rottentomatoes.com" + response.request.meta[ 'item' ][ "url" ], meta={ 'item': response.request.meta[ 'item' ] }, callback=self.parse_movie)
			# yield {
			# 	"movie_name" : response.request.meta.name,
			# 	"movie_url" : response.request.meta.url,
			# 	"movie_release_date" : response.request.meta.theaterReleaseDate,
			# 	"movie_imgs" : response.request.meta.posters,
			# 	"movie_actors" : response.request.meta.actors,
			# 	"movie_id" : response.request.meta.id,
			# 	"name" : name,
			# 	"date" : date,
			# 	"content" : content,
			# 	"score" : score,
			# }
			#print name, date, content, score

		
	def parse_movie( self, response ) :
		#print "parse_movie"
		
		#id="movieSynopsis" - content
		#itemprop="genre" - genre
		#itemprop="director" -> a
		yield {
			"movie_name" : response.request.meta[ 'item' ][ 'movie_name' ],
			"movie_url" : response.request.meta[ 'item' ][ 'url' ],
			"movie_imgs" : response.request.meta[ 'item' ][ 'imgs' ],
			"movie_actors" : response.request.meta[ 'item' ][ 'actors' ],
			"movie_id" : response.request.meta[ 'item' ][ 'id' ],
			"movie_content" : response.css( '#movieSynopsis::text' ).extract()[0],
			"movie_genre" : response.css( 'span[itemprop="genre"]::text' ).extract(),
			"date" : response.request.meta[ 'item' ][ 'date' ],
			"content" : response.request.meta[ 'item' ][ 'content' ],
			"score" : response.request.meta[ 'item' ][ 'score' ]
		}


	def start_requests(self):
		with open('movie_name_list.json') as data_file:
			data = json.load(data_file)
			#print data
    		for item in data:
    			for i in range( 1,10 ):
    				yield Request("http://www.rottentomatoes.com" + item["url"] + "reviews/?page=%d" % i, meta={'item': item}, callback=self.parse)
    				#yield self.make_requests_from_url( "http://www.rottentomatoes.com" + item["url"] + "reviews/?page=%d" % i )		
		