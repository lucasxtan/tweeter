/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// const { json } = require("express/lib/response");



function createTweetElement(tweetData) {
  const $tweet = $(
    `<article class="tweet">
  <header>
    <div class="icon-name">
      <img src=${tweetData.user.avatars} id="avatar">
      <label>${tweetData.user.name}</label>
    </div>
    <div>
      <p class="tag-name">${tweetData.user.handle}</p>
    </div>
  </header id="header">
  <p>
    ${tweetData.content.text}
  </p>
  <footer id="footer">
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

function renderTweets(tweetDataArray) {
  for (let tweetData of tweetDataArray) {
    const $tweetItem = createTweetElement(tweetData);
    $('#tweets-container').append($tweetItem);
  }
}



$('#tweetSubmit').on('submit', function (event) { //'#tweetSubmit is the form, .on('submit') has a function of on submission, do this, then add the function
  event.preventDefault() //on the event, prevent default (means don't refresh after submission)

  //1. Validation of the text should be not null
  let userTweet = $('#tweet-text').val();
  if (userTweet === null || userTweet === '') {
    alert("Please enter something. It cannot be blank");
  } else if (140 - userTweet.length < 0) {
    alert("Your tweet is too long")
  } else if (140 - userTweet.length > 0 && (userTweet !== null || userTweet !== '')) {
    const text = $(this).serialize(); //$(this) captures what's in #tweetSubmit, which includes the <textarea> where you input text. .serialize() is used to send json to server, cause json can only recognize json, can't just send string must send json, so convert to json
    console.log(text)
    $.ajax({ //need ajax to add it in, say method: post, url: /tweets/, data: is the text variable which captures your text input as json
      method: 'POST',
      url: '/tweets',
      data: text,
      // success: loadTweets() //for some reason it wasn't successful and didn't refresh

    }).done(loadTweets()) //handles both failure and success, should only be for success
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
// renderTweets(tweetDataArray);

// const tweetData = {
//   "user": {
//     "name": "Newton",
//     "avatars": "https://i.imgur.com/73hZDYK.png",
//     "handle": "@SirIsaac"
//     },
//   "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//   "created_at": 1461116232227
// }

// const $tweet = createTweetElement(tweetData);

// Test / driver code (temporary)
// console.log($tweet); // to see what it looks like
// $('#tweets-container').append($tweet); // to add it to the page so we can make sure it's got all the right elements, classes, etc.