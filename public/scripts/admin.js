
const sendEmail = function() {
	$('.send-email-btn').on('click', function(e) {
		e.preventDefault();
		let pollId = $('.send-email-btn').data('pollid')
		let question = $('.question').text()
		let descriptions = $('.descriptions').text()
		let scores = $('.scores').text()
		let descArr = descriptions.split(',')
		let scoreArr = scores.split(',')
		let descriptionsOptions = {}
		console.log(pollId)
		for (var i = 0; i < descArr.length; i++) {
			descriptionsOptions[descArr[i]] = Number(scoreArr[i])
		}
		$.ajax({
			url: '/polls/:poll_id/admin',
			type: 'POST',
			data: {
				question,
				descriptionsOptions,
				pollId
			},
			success: function(data) {
				console.log("Successfully sent graph data")
			}

		})
	})
}

$(document).ready(function() {
	sendEmail()
})