var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

// get home page
exports.index = function(req, res) {
  res.render('index', { title: 'Express' });
};

// get newest questions
exports.newest = function(req, res) {
	var questions = 10;
	if(req.params.limit) {
		questions = req.params.limit;
	}
	var url = 'http://www.stackoverflow.com/questions?sort=newest&pageSize=' + questions;
	var json = [];
	request(url, function(err, response, body) {
		if(err) console.log(err);
		var $ = cheerio.load(body);
		$('#questions .question-summary').each(function() {
			var question_summary = $(this);
			var answers = question_summary.children('.statscontainer').children('.stats').children('.status ').text();
			answers = answers.trim().charAt(0);
			var views = question_summary.children('.statscontainer').children('.views ').text();
			views = views.trim().charAt(0);
			var id = question_summary.attr('id').split('-')[2];
			var question = question_summary.children('.summary').children('h3').children('a').text();
			var link = 'http://www.stackoverflow.com/questions/' + id;
			var tags = '';
			question_summary.children('.summary').children('.tags ').children('a').each(function() {
				tags = tags + $(this).text() + ' ';
			});
			tags = tags.trim();
			var user = question_summary.children('.summary').children('.started').children('.user-info ').children('.user-details').children('a').text();
			var rep = question_summary.children('.summary').children('.started').children('.user-info ').children('.user-details').children('.reputation-score').text();
			json.push({'question-id': id, 
					   'views': views,
					   'answers': answers,
					   'question': question, 
					   'link': link,
					   'tags': tags,
					   'user': user,
					   'reputation-score': rep});
		});
		res.json({'questions': json});
	});
};

exports.featured = function(req, res) {
	var questions = 10;
	if(req.params.limit) {
		questions = req.params.limit;
	}
	var url = 'http://www.stackoverflow.com/questions?sort=featured&pageSize=' + questions;
	var json = [];
	request(url, function(err, response, body) {
		if(err) console.log(err);
		var $ = cheerio.load(body);
		$('#questions .question-summary').each(function() {
			var question_summary = $(this);
			var answers = question_summary.children('.statscontainer').children('.stats').children('.status ').text();
			answers = answers.trim().charAt(0);
			var views = question_summary.children('.statscontainer').children('.views ').text();
			views = views.trim().charAt(0);
			var id = question_summary.attr('id').split('-')[2];
			var question = question_summary.children('.summary').children('h3').children('a').text();
			var link = 'http://www.stackoverflow.com/questions/' + id;
			var tags = '';
			question_summary.children('.summary').children('.tags ').children('a').each(function() {
				tags = tags + $(this).text() + ' ';
			});
			tags = tags.trim();
			var user = question_summary.children('.summary').children('.started').children('.user-info ').children('.user-details').children('a').text();
			var rep = question_summary.children('.summary').children('.started').children('.user-info ').children('.user-details').children('.reputation-score').text();
			json.push({'question-id': id, 
					   'views': views,
					   'answers': answers,
					   'question': question, 
					   'link': link,
					   'tags': tags,
					   'user': user,
					   'reputation-score': rep});
		});
		res.json({'questions': json});
	});
};

exports.active = function(req, res) {
	var questions = 10;
	if(req.params.limit) {
		questions = req.params.limit;
	}
	var url = 'http://www.stackoverflow.com/questions?sort=active&pageSize=' + questions;
	var json = [];
	request(url, function(err, response, body) {
		if(err) console.log(err);
		var $ = cheerio.load(body);
		$('#questions .question-summary').each(function() {
			var question_summary = $(this);
			var answers = question_summary.children('.statscontainer').children('.stats').children('.status ').text();
			answers = answers.trim().charAt(0);
			var views = question_summary.children('.statscontainer').children('.views ').text();
			views = views.trim().charAt(0);
			var id = question_summary.attr('id').split('-')[2];
			var question = question_summary.children('.summary').children('h3').children('a').text();
			var link = 'http://www.stackoverflow.com/questions/' + id;
			var tags = '';
			question_summary.children('.summary').children('.tags ').children('a').each(function() {
				tags = tags + $(this).text() + ' ';
			});
			tags = tags.trim();
			var last_user = question_summary.children('.summary').children('.started').children('.user-info ').children('.user-details').children('a').text();
			var rep = question_summary.children('.summary').children('.started').children('.user-info ').children('.user-details').children('.reputation-score').text();
			json.push({'question-id': id, 
					   'views': views,
					   'answers': answers,
					   'question': question, 
					   'link': link,
					   'tags': tags,
					   'last_user': last_user,
					   'reputation-score': rep});
		});
		res.json({'questions': json});
	});
};

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