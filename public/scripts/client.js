/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

//creates new tweet data
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

// data of tweets
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
];

//this renders a new tweet
function renderTweets(tweetDataArray) {
  $('.tweets-container').empty();
  for (let tweetData of tweetDataArray) {
    const $tweetItem = createTweetElement(tweetData);
    $('#tweets-container').prepend($tweetItem);
  }
}



//takes in input from user
$('#tweetSubmit').on('submit', function (event) {
  event.preventDefault(); //refresh after submission

  //hide error message
  $('.alert').hide();

  //error message conditions
  let userTweet = $('#tweet-text').val();
  if (userTweet === null || userTweet === '') { //if user didn't input anything
    $('.error-message-none').slideDown();
  } else if (140 - userTweet.length < 0) { //if user typed too long of a tweet
    $('.error-message-long').slideDown();
  } else if (140 - userTweet.length > 0 && (userTweet !== null || userTweet !== '')) { //post tweet
    const text = $(this).serialize();
    $.ajax({
      method: 'POST',
      url: '/tweets',
      data: text,
      success: () => { //on success execute this
        loadTweets();
        $('#tweet-text').val(''); //clear the text in the text box on success
        $('.counter').text(140); //reset counter to 140
      }

    });
  }
});

//load tweets
function loadTweets() {
  $.ajax({
    method: 'GET',
    url: '/tweets',
    dataType: "json",
    success: function (result) {
      renderTweets(result);
    }
  });
}

loadTweets();