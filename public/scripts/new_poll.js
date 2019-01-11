
var newOption = function () {
	var newPollOption =
	`<div class="input-group mb-3 option-box">
  		<span class="input-group-text option-title" id="inputGroup-sizing-default"></span>
		  <input type="text" class="form-control option-input" placeholder="Option" aria-label="" aria-describedby="basic-addon1">
		  <textarea type="text" class="form-control option-info" placeholder="Description"></textarea>
		  <div class="input-group-append">
    		<button class="btn btn-outline-secondary delete-option" type="button">Delete</button>
  		</div>
	</div>`;
	return newPollOption;
};

  var updateOptionCount = function () {

  		var optionsArr = $(".option-title").toArray();
  		var increment = 1;
  		optionsArr.forEach((option) => {
  			$(option).text(`Option ${increment}`)
  			increment++;
  		});
  };

  var addOption = function () {
  	$(".add-option").on('click', function(e) {
  		$(".poll-form").append(newOption());
  		updateOptionCount();
  	});
  };

  var deleteOption = function () {
  	$('section.poll-form').on('click', ".delete-option", function(e) {
  		var target = $(this).parents('.option-box');
  		target.remove();
  		updateOptionCount();
  	});
  };

  var submitUserData = function () {
  	$(".submitbutton").on("click", function(e) {
  		e.preventDefault();
  		var $username = $(".username").val();
  		var $email = $(".email").val();
  		var $error = $(".erroruser");
      var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
      if (!email_regex.test($email) && $email) {
        $error.text("Sorry, Please enter a valid email address");
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
            $error.empty();
  				}
  			})
  			.done(function(data) {
  				if (data === 'done') {
						$(".userinfo").fadeOut(function() {
							$(".polls").fadeIn();
						}) 
					}
				});
  		} else {
  			$error.text("Sorry, Please fill out all input fields")
  		}
  	})
  }

  var submitPollData = function () {
  	$('.submit-btn').on('click', function(e) {
  		e.preventDefault()
      var $question = $(".question").val()
  		var $options = $(".option-input").val()
  		var $error = $(".erroroption")
      var flag = true;
  		var options = []
  		$('.option-input').toArray().forEach((option) => {
  			options.push($(option).val());
        if (!$(option).val()) {
          flag = false;
        }
  		});
  		// Use class info for option info input fields
  		var info = [];
    $('.option-info').toArray().forEach((info_) => {
      info.push($(info_).val());
    });
  	var question = $('.question').val();
    if ($options && $question && flag) {
  		$.ajax({
  			url:'/polls',
  			type:'POST',
  			data: {
  				question,
  				options,
  				info
  			},
  			success: function() {
  				console.log("successful post of new poll to /polls")
          $error.empty();
  			}
  		})
  		.done(function(data) {
        var id = data;
        if (data !== null) {
          window.location = `/polls/${id}/admin`;
        }
  		})
    } else {
        $error.text("Sorry, Please fill out all input fields");
      }
  	});
  }



  var showDeleteButtons = function () {
  	$(document).on('click', '.delete-option, .add-option', function() {
  		var n = $('.delete-option').length;
  		console.log(n);
  		if (n < 3) {
  			$('.delete-option').hide();
  		} else {
  			$('.delete-option').show();
  		}
  	})
  }





  $(document).ready(function() {
  	submitUserData();
  	addOption();
  	deleteOption();
  	submitPollData();
  	showDeleteButtons();

  })
