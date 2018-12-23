$(document).ready(function() {
  // User enters email and name and sends them to server
  $(".submitbutton").on("click", function(e) {
		e.preventDefault();
		var $username = $(".username").val();
		var $email = $(".email").val();
    var $error = $(".error");
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
				console.log("SUCCESS");
        $error.empty();
			}
		})
		.done(function(data) {
      if (data === 'done') {
        $("div.wrapper").fadeOut(function() {
          $("div#poll").fadeIn();
        });
      }
    });
    } else {
      $error.text("Input fields cannot be blank.")
    }
  });



  // User sends his sequence to server
  $(".send-vote").on("click", function(e) {
    e.preventDefault();
    var options = [];
    $("ul#sortable li").toArray().forEach((option) => {
      var newOption = {
        id: $(option).data("id"),
        description: $(option).text()
      }
      options.push(newOption);
    });
    // Send options to server
    $.ajax({
      // Hardcoded URL for now
      url: "/polls/2",
      type: "POST",
      data: {
        options
      },
      success: function() {
        console.log("Sent to server");
      }
    })
    .done(function(data) {
      $("body").fadeOut(function() {
        $("body").html(`<h1 class="thank-you">${data}</h1>`);
      });
      $("body").fadeIn("slow");
    });
  });

});
