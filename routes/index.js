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
	var urls = get_urls(req.params.tag, req.query.limit, req.path);
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
				var id = question_summary.attr('id').split('-')[2];
				var summary = question_summary.children('.summary');
				var question = summary.children('h3').children('a').text();
				var link = 'http://www.stackoverflow.com/questions/' + id;
				var tags = '';
				summary.children('.tags ').children('a').each(function() {
					tags = tags + $(this).text() + ' ';
				});
				tags = tags.trim();
				var user_details = summary.children('.started').children('.user-info ').children('.user-details');
				if(user_details.first().children('.community-wiki').html() != null) {
					json.push({'question-id': id, 
						'views': views,
						'answers': answers,
						'question': question, 
						'link': link,
						'tags': tags,
						'user': 'community-wiki - community owned post',
						'reputation-score': 'no rep score'});
				} else {
					var user = user_details.children('a').text();
					var rep = user_details.children('.reputation-score').text();
					json.push({'question-id': id, 
						'views': views,
						'answers': answers,
						'question': question, 
						'link': link,
						'tags': tags,
						'user': user,
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
			res.json({'questions': json});
		}
	});
};

// gets array of urls based on user tag and questions limit input
function get_urls(tag_given, limit, path) {
	var urls = [];
	var base_url = 'http://www.stackoverflow.com/questions';
	var sort = path.split('/')[2];
	var questions = 10;
	var pages = 0;
	if(limit) {
		questions = limit;
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


// attempt to get answers to questions. need to change.
exports.question = function(req, res) {
	var url = 'http://stackoverflow.com/questions/' + req.params.id;
	request(url, function(err, response, body) {
		if (err) console.log(err);
		var $ = cheerio.load(body);
		var question = $('#question-header h1 a').text();
		var tags = '';
		$('#mainbar .post-taglist a').each(function() {
			tags = tags + $(this).text() + ' ';
		});
		tags = tags.trim();
		var answers = [];
		$('#mainbar .answer').each(function() {
			var answer_summary = $(this);
			var id = answer_summary.attr('data-answerid');
			var answer = '';
			answer_summary.children('table').children('tr').first().children('.answercell').children('.post-text').children().each(function() {
				answer = answer + $(this).text() + ' ';
			});
			answer = answer.trim();
			answers.push({'id': id,
						  'answer': answer});
		});
		res.json({'question': question,
				  'tags': tags,
				  'answers': answers});
	});
}