/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// const { json } = require("express/lib/response");

const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

//change all id here to be classes cause every time you submit one it will create a copy of the id and id should be unique
//don't need header or footer tags at all
function createTweetElement(tweetData) {
  const $tweet = $(
    `<article class="tweet">
  <header>
    <div class="icon-name">
      <img src=${tweetData.user.avatars} class="avatar">
      <label>${tweetData.user.name}</label>
    </div>
    <div>
      <p class="tag-name">${tweetData.user.handle}</p>
    </div>
  </header>
  <p>
    ${escape(tweetData.content.text)}
  </p>
  <footer>
    <div>
      ${timeago.format(tweetData.created_at)}
    </div>
    <div class="icons">
      <i class="fa-solid fa-flag"></i>
      <i class="fa-solid fa-retweet"></i>
      <i class="fa-solid fa-heart"></i>
    </div>
  </footer>
</article>`);
  return $tweet;
}

// Fake data taken from initial-tweets.json
const tweetDataArray = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd"
    },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
]

//this renders a new tweet
function renderTweets(tweetDataArray) {
  $('.tweets-container').empty();
  for (let tweetData of tweetDataArray) {
    const $tweetItem = createTweetElement(tweetData);
    $('#tweets-container').prepend($tweetItem);
  }
}



//takes in input from user
$('#tweetSubmit').on('submit', function (event) { //'#tweetSubmit is the form, .on('submit') has a function of on submission, do this, then add the function
  event.preventDefault() //on the event, prevent default (means don't refresh after submission)
  $('.alert').hide();
  //1. Validation of the text should be not null
  let userTweet = $('#tweet-text').val();
  if (userTweet === null || userTweet === '') {
    $('.error-message-none').slideDown();
  } else if (140 - userTweet.length < 0) {
    // alert("Your tweet is too long") 
    $('.error-message-long').slideDown();
  } else if (140 - userTweet.length > 0 && (userTweet !== null || userTweet !== '')) {
    const text = $(this).serialize(); //$(this) captures what's in #tweetSubmit, which includes the <textarea> where you input text. .serialize() is used to send json to server, cause json can only recognize json, can't just send string must send json, so convert to json
    $.ajax({ //need ajax to add it in, say method: post, url: /tweets/, data: is the text variable which captures your text input as json
      method: 'POST',
      url: '/tweets',
      data: text,
      success: () => { //on success //the function inside must be written like () => {function()} cause that calls the function, function() is the value of the result of the function, which is wrong
        loadTweets()
        $('#tweet-text').val('') //clear the text in the text box on success
        $('.counter').text(140); //reset counter to 140
      } //for some reason it wasn't successful and didn't refresh

    })
  }
})

function loadTweets() {
  $.ajax({
    method: 'GET',
    url: '/tweets',
    dataType: "json",
    success: function (result) {
      renderTweets(result);
    }
  })
}

loadTweets()