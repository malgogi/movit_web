from __future__ import division
import json
import math
import os
import sys

movies = json.loads(open( os.path.dirname(os.path.realpath(__file__)) + "/formatted_docs.json").read())
collection = json.loads(open( os.path.dirname(os.path.realpath(__file__)) + "/collection.json").read())
query = sys.argv[1]
query = list(query.split())
rank = {}
w1 = 0.5
w2 = 0.1
max_conlen = 0
max_replen = 0
col_conlen = collection["movie_content"]["unigram_length"]
col_replen = collection["reply_content"]["unigram_length"]
for movie in movies:
	max_conlen = max(max_conlen, movie["movie_content"]["unigram_length"])
	max_replen = max(max_replen, movie["reply_content"]["unigram_length"])
for movie in movies:
	conlen = movie["movie_content"]["unigram_length"]
	replen = movie["reply_content"]["unigram_length"]
	con_score = 0
	rep_score = 0
	for word in query:
		unigram = word
		if unigram in movie["movie_content"]["unigram"].keys():
			con_score += math.log(w1*(movie["movie_content"]["unigram"][unigram]/conlen)+(1-w1)*(collection["movie_content"]["unigram"][unigram]/col_conlen))
		else:
			if unigram in collection["movie_content"]["unigram"].keys():
				con_score += math.log(w1*(1/(max_conlen*10))+(1-w1)*(collection["movie_content"]["unigram"][unigram]/col_conlen))
			else:
				con_score += math.log(w1*(1/(max_conlen*10))+(1-w1)*(1/(col_conlen*10)))
		if unigram in movie["reply_content"]["unigram"].keys():
			rep_score += math.log(w1*(movie["reply_content"]["unigram"][unigram]/replen)+(1-w1)*(collection["reply_content"]["unigram"][unigram]/col_replen))
		else:
			if unigram in collection["reply_content"]["unigram"].keys():
				rep_score += math.log(w1*(1/(max_replen*10))+(1-w1)*(collection["reply_content"]["unigram"][unigram]/col_replen))
			else:
				rep_score += math.log(w1*(1/(max_replen*10))+(1-w1)*(1/(col_replen*10)))
	rank[movie["name"]] = {};
	rank[movie["name"]][ "score" ] = w2*(con_score)+(1-w2)*(rep_score)
	rank[movie["name"]][ "imgs" ] = movie[ "imgs" ]
	rank[movie["name"]][ "url" ] = movie[ "url" ]
	rank[movie["name"]][ "actors" ] = movie[ "actors" ]
	rank[movie["name"]][ "genre" ] = movie[ "genre" ]
	rank[movie["name"]][ "date" ] = movie[ "date" ]


#res = [(k,v) for v,k in sorted([(v,k) for k,v in rank.items()],reverse=False)]
res = sorted(rank.items(),key=lambda x: x[1][ 'score' ],reverse=True)


json_res = {}
for i in range(30):
	title, item = res[i]
	json_res[title] = {}
	json_res[title] = item
	json_res[title]["rank"] = i+1

print json.dumps(json_res, indent=4, sort_keys=False)

#print(res[:30])	# show top 30 rank movies