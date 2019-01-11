
var sendEmailFromButton = function() {
	$('.send-email-btn').on('click', function(e) {
		e.preventDefault();
		var pollId = $('.send-email-btn').data('pollid');
		var question = $('.question').text();
		var descriptions = $('.descriptions').text();
		var scores = $('.scores').text();
		var descArr = descriptions.split(',');
		var scoreArr = scores.split(',');
		var descriptionsOptions = {};
		for (var i = 0; i < descArr.length; i++) {
			descriptionsOptions[descArr[i]] = Number(scoreArr[i]);
		}
		$.ajax({
			url: '/polls/:poll_id/admin',
			type: 'POST',
			data: {
				question,
				descriptionsOptions,
				pollId
			}
		})
	})
}

$(document).ready(function() {
	sendEmailFromButton();
})
