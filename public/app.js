$.getJSON("/scrape");
$("#articles").hide();

$(document).on("click", "#scrape-button", function () {
  $("#articles").show();
  $("#notes").empty();
  $("#articles").empty();
  $.getJSON("/articles", function (data) {
    data.forEach(article => {
      $("#articles").append(`
      <div class="card">
      <img class="card-img-top" src='${article.image}'
      <div class="text-left card-body articles">
      <a class="card-title" href='${article.link} data-id=' ${article._id}'> ${article.title}</a> 
      <p class="card-text">${article.summary}</p>
      </div>
      <button data-id='${article._id}'class="view-comments btn btn-primary">Comments</button>`);
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
      $("#notes").append(`
      <h5>${data.title}</h5>
      <h4>Leave a comment</h4>
      <br>
      <input id='titleinput' name='title' placeholder='Name'>
      <textarea id='bodyinput' name='body' placeholder='Comment'></textarea>
      <button class="btn btn-primary" data-id='${data._id}' id='savenote'>Save Note</button>
      <br>
      <h4>Comments:</h4>
      `);
      if (data.note.length > 0) {
        data.note.forEach(note => {
          $("#notes").append(`
          <h5 class="text-left comment">${note.title} says: ${note.body}</h5>
          <br>`)
        })
      }
      else {
        $("#notes").append(`<h5>Be the first to leave a comment!</h5> <br>`)
      }

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
    $("#notes").empty();
    $.ajax({
      method: "GET",
      url: `/articles/${thisId}`
    })
      .then(function (data) {
        $("#notes").append(`
        <h5>${data.title}</h5>
        <h4>Leave a comment</h4>
        <br>
        <input id='titleinput' name='title' placeholder='Name'>
        <textarea id='bodyinput' name='body' placeholder='Comment'></textarea>
        <button class="btn btn-primary" data-id='${data._id}' id='savenote'>Save Note</button>
        <br>
        <h4>Comments:</h4>
        `);
        if (data.note.length > 0) {
          data.note.forEach(note => {
            $("#notes").append(`
            <h5 class="text-left comment">${note.title} says: ${note.body}</h5>
            <br>`)
          })
        }
        else {
          $("#notes").append(`<h5>Be the first to leave a comment!</h5> <br>`)
        }

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
