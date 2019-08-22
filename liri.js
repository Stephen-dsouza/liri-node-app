require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');

//get the keys for the API from keys.js
var spotify = new Spotify(keys.spotify);

var options = process.argv[2];
var optionsString = process.argv.slice(3).join(" ");

switch (options) {
    case "spotify-this-song":
        spotifyTrack();
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

        // console.log(data.tracks.items[0]);
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
        // console.log(artist);
        // console.log(preview);
        // console.log(songName);
    });

}