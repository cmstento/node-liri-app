require("dotenv").config();
var fs = require('fs')
var keys = require("./keys.js");
var request = require('request')
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


function runCommand(args) {
  var command = args[0];
  if (command === 'my-tweets') {
    getTweets();
  } else if (command === 'spotify-this-song') {
    var song = args[1] || 'The Sign';
    spotifySong(song);
  } else if (command === 'movie-this') {
    var movie = args[1] || 'Mr. Nobody';
    getMovie(movie);
  } else if (command === 'do-what-it-says') {
    doThing();
  }
}

function getTweets() {
  client.get('statuses/user_timeline', function(error, tweets, response) {
    if (error) throw error;
    tweets.forEach(t => {
      console.log(t.text + "            " + t.created_at);
    });
  })
}


function spotifySong(song) {
  spotify.search({ type: 'track', query: song }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
 
    var first_hit = data.tracks.items[0];

    var artist = first_hit.artists[0].name;
    var name = first_hit.name;
    var link = first_hit.preview_url;
    var album = first_hit.album.name;

    console.log(`Artist: ${artist}`); 
    console.log(`Name: ${name}`); 
    console.log(`Preview Link: ${link}`); 
    console.log(`Album: ${album}`); 
  });
}


function getMovie(title) {
  request(`http://www.omdbapi.com/?apikey=${keys.omdb.api_key}&t=${title}`, function(error, response, body) {
    var movie = JSON.parse(body)
    console.log(`Title: ${movie.Title}`)
    console.log(`Year: ${movie.Year}`)
    console.log(`IMDB Rating: ${movie.imdbRating}`)
    console.log(`Rotten Tomatoes Rating: ${movie.Ratings.find(r => r.Source == 'Rotten Tomatoes').Value}`)
    console.log(`Country: ${movie.Country}`)
    console.log(`Language: ${movie.Language}`)
    console.log(`Plot: ${movie.Plot}`)
    console.log(`Actors: ${movie.Actors}`)
  })
}

function doThing() {
  fs.readFile('./random.txt', 'utf8', function(error, data) {
    var myCommand = data.split(',')
    runCommand(myCommand)
  })
}

runCommand(process.argv.slice(2));
