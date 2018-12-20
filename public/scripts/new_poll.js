const submitUserData = function () {
	$(".submitbutton").on("click", function() {
		var $username = $(".username")
		var $email = $(".email")
		$.ajax({
			url: '/users',
			type: 'POST',
			body: {
				$username: username,
				$email: email
			},
			success: function() {
				
			}
		})
	})
