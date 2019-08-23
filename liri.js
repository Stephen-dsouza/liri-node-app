require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var axios = require("axios");
//get the keys for the API from keys.js
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
var fs = require("fs");
// moment().format();
var options = process.argv[2];
var optionsString = process.argv.slice(3).join(" ");

switch (options) {
    case "spotify-this-song":
        spotifyTrack();
        break;
    case "concert-this":
        concerts();
        break;
}

function spotifyTrack() {
    if (optionsString === "") {
        optionsString = "ace of base"
    } else {
        optionsString
    }

    spotify.search({
        type: 'track',
        query: optionsString
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var albumName = data.tracks.items[0].album.name;
        var artist = data.tracks.items[0].artists[0].name;
        var preview = data.tracks.items[0].album.preview_url;
        var songName = data.tracks.items[0].name;

        var output =
            "\n********************************" +
            "\nArtist: " +
            artist +
            "\nSong Name: " +
            songName +
            "\nPreview : " +
            preview +
            "\nAlbum : " +
            albumName + "\n********************************";
        console.log(output);
    });
}


function concerts() {
    if (optionsString === "") {
        console.log("Choose an artist");
    } else {
        axios.get("https://rest.bandsintown.com/artists/" + optionsString + "/events?app_id=codingbootcamp").then(
                function (response) {

                    for (var x = 0; x < response.data.length; x++) {

                        var venue = response.data[x].venue.name;
                        var venueLocation = response.data[x].venue.city + " , " + response.data[x].venue.country;
                        var date = moment(response.data[x].datetime).format("DD/MM/YYYY");
                        var output =
                            "\n********************************" +
                            "\nEvent Venue: " +
                            venue +
                            "\nLocation of Event: " +
                            venueLocation +
                            "\nDate of Event : " +
                            date +
                            "\n********************************";
                        console.log(output);
                    }
                    
                })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("---------------Data---------------");
                    console.log(error.response.data);
                    console.log("---------------Status---------------");
                    console.log(error.response.status);
                    console.log("---------------Status---------------");
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an object that comes back with details pertaining to the error that occurred.
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
                console.log(error.config);
            });

    }
}