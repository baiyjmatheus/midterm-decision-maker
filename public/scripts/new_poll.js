const newOption = function (increment) {
	let newPollForm = `<div class="input-group mb-3 option-box">
  <span class="input-group-text" id="inputGroup-sizing-default">Option ${increment}</span>
  <input type="text" class="form-control" placeholder="Option" aria-label="" aria-describedby="basic-addon1">
  <div class="input-group-append">
    <button class="btn btn-outline-secondary delete-option" type="button">Delete</button>
  </div>
</div>`
	return newPollForm;
}

const addOption = function () {
	let increment = 3
	$(".add-option").on('click', function(e) {
		$(".poll-form").append(newOption(increment))
		increment++
	})
}

const deleteOption = function () {
	$('section.poll-form').on('click', ".delete-option", function(e) {
		console.log(e)
		let target = $(this).parents('.option-box')
		target.remove()
		console.log(target)
	})
}

const submitUserData = function () {
	$(".submitbutton").on("click", function(e) {
		e.preventDefault();
		var username = $(".username").val()
		var email = $(".email").val()
		var $error = $(".error")
		if (username && email) {
			$.ajax({
				url: '/users',
				type: 'POST',
				data: {
					username,
					email
				},
				success: function() {
					console.log("SUCCESS")
				}
			})
			.done(function(data) {
				console.log(data)	
			})
		} else {
			$error.text("Input fields cannot be blank.")
		}
	})
}


$(document).ready(function() {
	submitUserData();
	addOption();
	deleteOption();
})