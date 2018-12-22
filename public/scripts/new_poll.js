const newOption = function () {
	let newPollForm =
	`<div class="input-group mb-3 option-box">
  		<span class="input-group-text option-title" id="inputGroup-sizing-default"></span>
  			<input type="text" class="form-control option-input" placeholder="Option" aria-label="" aria-describedby="basic-addon1">
 		<div class="input-group-append">
    		<button class="btn btn-outline-secondary delete-option" type="button">Delete</button>
  		</div>
	</div>`
	return newPollForm;
}

const updateOptionCount = function () {

		let optionsArr = $(".option-title").toArray()
		let len = optionsArr.length
		let increment = 1
		optionsArr.forEach((option) => {
			$(option).text(`Option ${increment}`)
			increment++
		})
}

const addOption = function () {
	$(".add-option").on('click', function(e) {
		$(".poll-form").append(newOption())
		updateOptionCount($(".option-title"))
	})
}

const deleteOption = function () {
	$('section.poll-form').on('click', ".delete-option", function(e) {
		let target = $(this).parents('.option-box')
		target.remove()
		updateOptionCount()
	})
}

const submitUserData = function () {
	$(".submitbutton").on("click", function(e) {
		e.preventDefault();
		var $username = $(".username").val()
		var $email = $(".email").val()
		var $error = $(".error")
    var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    if (!email_regex.test($email)) {
      $error.text("Email is not valid")
    }
		else if ($username && $email) {
			$.ajax({
				url: '/users',
				type: 'POST',
				data: {
					$username,
					$email
				},
				success: function() {
					console.log("Successfully sent user data")
          $error.empty();
				}
			})
			.done(function(data) {
				if (data === 'done') {
        $(".userinfo").fadeOut(function() {
          $(".polls").fadeIn();
      }) }})
		} else {
			$error.text("Input fields cannot be blank.")
		}
	})
}

const submitPollData = function () {
	$('.submit-btn').on('click', function(e) {
		e.preventDefault()
    var $question = $(".question").val()
    var $options = $(".option-input").val()
    var $error = $(".error")
    if ($options && $question) {
		var options = []
		$('.option-input').toArray().forEach((option) => {
			options.push($(option).val())
		})
		let question = $('.question').val();
		$.ajax({
			url:'/polls',
			type:'POST',
			data: {
				question,
				options
			},
			success: function() {
				console.log("successful post of new poll to /polls")
        $error.empty();
			}
		})
		.done(function(data) {
      const id = data;
      if (data !== null) {
        window.location = `/polls/${id}/admin`;
      }
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
	submitPollData();

})
