var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

// get home page
exports.index = function(req, res) {
  res.render('index', { title: 'Express' });
};

// get questions based on sort requested
exports.search = function(req, res) {
	var path = req.path;
	var sort = path.split('/')[2];
	var questions = 10;
	if(req.params.limit) {
		questions = req.params.limit;
	}
	var url = 'http://www.stackoverflow.com/questions?sort=' + sort + '&pageSize=' + questions;
	var json = [];
	request(url, function(err, response, body) {
		if(err) console.log(err);
		var $ = cheerio.load(body);
		$('#questions .question-summary').each(function() {
			var question_summary = $(this);
			var stats = question_summary.children('.statscontainer');
			var answers = stats.children('.stats').children('.status ').text();
			answers = answers.match(/[0-9]+/)[0];
			var views = stats.children('.views ').text();
			views = views.match(/[0-9]+/)[0];
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
		res.set({'content-type': 'application/json; charset=utf-8'});
		res.json({'questions': json});
	});
};

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