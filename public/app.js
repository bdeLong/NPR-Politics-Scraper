// Grab the articles as a json
$.getJSON("/scrape");
$("#articles").hide();

$(document).on("click", "#scrape-button", function () {
  $("#articles").show();
  $("#notes").empty();
  $("#articles").empty();
  $.getJSON("/articles", function (data) {
    data.forEach(article => {
      $("#articles").append(`<a href='${article.link} data-id=' ${article._id}'> ${article.title}</a> <br> <p>${article.summary}</p> <br> <button data-id='${article._id}'class="view-comments">Comments</button><br><br>`);
    });
  });

})


$(document).on("click", ".view-comments", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: `/articles/${thisId}`
  })
    // With that done, add the note information to the page
    .then(function (data) {

      // The title of the article
      $("#notes").append(`<h5>${data.title}</h5>`);
      $("#notes").append(`<h4>Comments:`)
      if (data.note.length > 0) {
        data.note.forEach(note => {
          $("#notes").append(`<h5>${note.title} says: ${note.body}</h5>`)
        })
      }
      else {
        $("#notes").append(`<h5>Be the first to leave a comment!</h5>`)
      }
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' placeholder='Name'>");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body' placeholder='Comment'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append(`<button data-id='${data._id}' id='savenote'>Save Note</button>`);
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: `/articles/${thisId}`,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  }).then(function () {
    $.ajax({
      method: "GET",
      url: `/articles/${thisId}`
    }).then(function (data) {
      $("#notes h5, h6").empty();
      data.note.forEach(note => {
        $("#notes").append(`<h5>Name: ${note.title}</h5> <h6>Comment: ${note.body}</h6>`)
      })
    })
  })

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
