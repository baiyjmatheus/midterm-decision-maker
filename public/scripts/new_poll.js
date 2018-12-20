const submitUserData = function () {
	$(".submitbutton").on("click", function(e) {
		e.preventDefault();
		var $username = $(".username").val()
		var $email = $(".email").val()
		$.ajax({
			url: '/users',
			type: 'POST',
			data: {
				$username,
				$email
			},
			success: function() {
				console.log("SUCCESS")
			}
		})
	})
}


$(document).ready(function() {
	submitUserData()
})