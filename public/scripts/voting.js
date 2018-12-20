$(document).ready(function() {

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
        $("body").html(`<h1>${data}</h1>`);
      });
      $("body").fadeIn();
    });
  });

});