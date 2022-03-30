$(document).ready(function() {
  console.log("ready")
  let counter;
  let len = 140;
  $("#tweet-text").on('input', function() {
 //The this keyword is a reference to the button
    counter = $(this).val().length;
    let remainChar = len - counter;
    $('.counter').text(remainChar);

    if (remainChar < 0) {
      $('.counter').css('color', 'red');
    } else {
      $('.counter').css('color', '');
    }
  });
});

