require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');

//get the keys for the API from keys.js
var spotify = new Spotify(keys.spotify);


spotify.search({
        type: 'track',
        query: 'All the Small Things'
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (err) {
        console.log(err);
    });