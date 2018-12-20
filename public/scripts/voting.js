$(document).ready(function() {

  // User sends his sequence to server
  $(".send-vote").on("click", function(e) {
    e.preventDefault();
    var options = [];
    $("ul#sortable li").toArray().forEach((option) => {
     options.push(option.textContent);
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
    });
  });

});