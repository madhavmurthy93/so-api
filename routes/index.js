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
					   'question': question, 
					   'link': link,
					   'tags': tags,
					   'user': user,
					   'reputation-score': rep});
		});
		res.json({'questions': json});
	});
};