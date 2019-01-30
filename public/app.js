$.getJSON("/scrape");
$("#articles").hide();

$(document).on("click", "#scrape-button", function () {
  $("#articles").show();
  $("#notes").empty();
  $("#articles").empty();
  $.getJSON("/articles", function (data) {
    data.forEach(article => {
      $("#articles").append(`<a href='${article.link} data-id=' ${article._id}'> ${article.title}</a> <br> <p>${article.summary}</p> <br> <button data-id='${article._id}'class="view-comments btn btn-primary">Comments</button><br><br>`);
    });
  });

})


$(document).on("click", ".view-comments", function () {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: `/articles/${thisId}`
  })
    .then(function (data) {
      $("#notes").append(`<h5>${data.title}</h5>`);
      $("#notes").append(`<h4>Comments:<br><br>`)
      if (data.note.length > 0) {
        data.note.forEach(note => {
          $("#notes").append(`<h5>${note.title} says: ${note.body}</h5><br>`)
        })
      }
      else {
        $("#notes").append(`<h5>Be the first to leave a comment!</h5><br>`)
      }
      $("#notes").append("<br><h4>Leave a comment</h4>")
      $("#notes").append("<input id='titleinput' name='title' placeholder='Name'>");
      $("#notes").append("<textarea id='bodyinput' name='body' placeholder='Comment'></textarea>");
      $("#notes").append(`<button data-id='${data._id}' id='savenote'>Save Note</button>`);
    });
});

$(document).on("click", "#savenote", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: `/articles/${thisId}`,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).then(function () {
    $.ajax({
      method: "GET",
      url: `/articles/${thisId}`
    })
      .then(function (data) {
        $("#notes").append(`<h5>${data.title}</h5>`);
        $("#notes").append(`<h4>Comments:<br><br>`)
        if (data.note.length > 0) {
          data.note.forEach(note => {
            $("#notes").append(`<h5>${note.title} says: ${note.body}</h5> <br>`)
          })
        }
        else {
          $("#notes").append(`<h5>Be the first to leave a comment!</h5> <br>`)
        }
        $("#notes").append("<br><h4>Leave a comment</h4>")
        $("#notes").append("<input id='titleinput' name='title' placeholder='Name'>");
        $("#notes").append("<textarea id='bodyinput' name='body' placeholder='Comment'></textarea>");
        $("#notes").append(`<button data-id='${data._id}' id='savenote'>Save Note</button>`);
      });
    // $.ajax({
    //   method: "GET",
    //   url: `/articles/${thisId}`
    // }).then(function (data) {
    //   $("#notes h5, h6").empty();
    //   data.note.forEach(note => {
    //     $("#notes").append(`<h5>Name: ${note.title}</h5> <h6>Comment: ${note.body}</h6>`)
    //   })
    // })
  })
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
