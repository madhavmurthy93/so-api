var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

// get home page
exports.index = function(req, res) {
  res.render('index', { title: 'Express' });
};

// get questions based on sort requested
exports.search = function(req, res) {
	var json = [];
	var urls = get_urls(req.params.tag, req.query.max, req.path);
	async.eachSeries(urls, function(url, callback) {
		request(url, function(err, response, body) {
			if(err) console.log(err);
			var $ = cheerio.load(body);
			$('#questions .question-summary').each(function() {
				var question_summary = $(this);
				var stats = question_summary.children('.statscontainer');
				var answers = stats.children('.stats').children('.status ').text();
				answers = answers.match(/[0-9]+/)[0];
				var views = stats.children('.views ').text().trim().split(" ");
				views = views[0];
				var votes = stats.children('.stats').children('.vote').children('.votes').children('.vote-count-post ').text();
				var id = question_summary.attr('id').split('-')[2];
				var summary = question_summary.children('.summary');
				var question = summary.children('h3').children('a').text();
				var link = 'http://www.stackoverflow.com/questions/' + id;
				var tags = '';
				summary.children('.tags ').children('a').each(function() {
					tags = tags + $(this).text() + ' ';
				});
				tags = tags.trim();
				var user_info = summary.children('.started').children('.user-info ');
				if(user_info.children('.user-details').first().children('.community-wiki').html() != null) {
					json.push({'question': question, 
						'question-id': id, 
						'link': link,
						'views': views,
						'answers': answers,
						'votes': votes,
						'tags': tags,
						'asker': 'community-wiki - community owned post',
						'reputation-score': 'no rep score'});
				} else {
					var asker = user_info.children('.user-details').children('a').text();
					var rep = user_info.children('.user-details').children('.reputation-score').text();
					var time = user_info.children('.user-action-time').children('.relativetime').attr('title').replace("Z", "");
					json.push({'question': question, 
						'question-id': id, 
						'link': link,
						'views': views,
						'answers': answers,
						'votes': votes,
						'tags': tags,
						'asker': asker,
						'time': time,
						'reputation-score': rep});
				}
			});
		callback();
		});
	}, function(err) {
		if(err) {
			console.log(err);
		} else {
			res.set({'content-type': 'application/json; charset=utf-8'});
			res.send(200, {
                'count': json.length,
                'questions': json
            });
		}
	});
};

// gets array of urls based on user tag and questions max input
function get_urls(tag_given, max, path) {
	var urls = [];
	var base_url = 'http://www.stackoverflow.com/questions';
	var sort = path.split('/')[1];
	var questions = 10;
	var pages = 0;
	if(max) {
		questions = max;
		pages = Math.floor(questions / 50);
	}
	var tag = '';
	if(tag_given) {
		tag = tag_given;
		var i;
		for(i = 1; i <= pages; i++) {
			url = base_url + '/tagged/' + tag + '?page=' + i + '&sort=' + sort + '&pageSize=50';
			urls.push(url);
		}
		var r = questions % 50;
		if(( r != 0)) {
			urls.push(base_url + '/tagged/' + tag + '?page=' + i + '&sort=' + sort + '&pageSize=' + r);
		}
	} else {
		var i;
		for(i = 1; i <= pages; i++) {
			url = base_url + '?page=' + i + '&sort=' + sort + '&pageSize=50';
			urls.push(url);
		}
		var r = questions % 50;
		if(( r != 0)) {
			urls.push(base_url + '?page=' + i + '&sort=' + sort + '&pageSize=' + r);
		}
	}
	return urls;
}
