require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
//get the keys for the API from keys.js
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
var fs = require("fs");
//get the value of search function to be performed
var options = process.argv[2];
//get the artist/track/movie the search to be performed on
var optionsString = process.argv.slice(3).join(" ");



function spotifyTrack(searching) {
    // console.log(search);
    
    spotify.search({
        type: 'track',
        query: searching
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

        fs.appendFile("log.txt", output, function (err) {
            if (err) {
                console.log("Cound not log results.Did you follow the steps in README.md?");
            }
            console.log("Search logged");
        });
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
                        fs.appendFile("log.txt", output, function (err) {
                            if (err) {
                                console.log("Cound not log results.Did you follow the steps in README.md?");
                            }
                            console.log("Search logged");
                        });
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


function movies() {
    if (optionsString === "") {
        optionsString = "Mr. Nobody"
    } else {
        optionsString
    }
    axios.get("http://www.omdbapi.com/?apikey=c8c4f132&t=" + optionsString).then(
            function (response) {
                var rottenRating = "";
                var title = response.data.Title;
                var year = response.data.Year;
                var imdbValue = response.data.Ratings.filter(function (imdbValue) {
                    return (imdbValue.Source === "Internet Movie Database")
                });
                //get the array from response.data .sources,pass this onto a function to filter

                var rottenValue = response.data.Ratings.filter(function (rottenValue) {
                    //and create a new array rottenRatings based on response.data.Ratings.Source has value Rotten Tomatoes
                    return (rottenValue.Source === "Rotten Tomatoes")

                });
                if (rottenValue.length === 0) {
                    rottenRating = "NO Ratings";
                } else {
                    rottenRating = rottenValue[0].Value;
                }

                var language = response.data.Language;
                var plot = response.data.Plot;
                var actors = response.data.Actors;
                var output =
                    "\n********************************" +
                    "\nTitle: " +
                    title +
                    "\nYear: " +
                    year +
                    "\nIMDB Rating: " +
                    imdbValue[0].Value +
                    "\nRotten Tomato Rating: " +
                    rottenRating +
                    "\nLanguage: " +
                    language +
                    "\nMovie Plot: " +
                    plot +
                    "\nActors: " +
                    actors +
                    "\n********************************";
                console.log(output);
                fs.appendFile("log.txt", output, function (err) {
                    if (err) {
                        console.log("Cound not log results.Did you follow the steps in README.md?");
                    }
                    console.log("Search logged");
                });

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

switch (options) {
    case "spotify-this-song":
            if (optionsString === "") {
                optionsString = "ace of base"
            } else {
                optionsString
            }
        
        spotifyTrack(optionsString);
        break;
    case "concert-this":
        concerts();
        break;
    case "movie-this":
        movies();
        break;
    case "do-what-it-says":
        fs.readFile("./random.txt", "utf-8", function (err, data) {
            if (err) {
                console.log("READ THE README FILE");
            }
            
            var searchString = (data.substring(data.indexOf(",") + 2, data.length - 1).toString());
            spotifyTrack(searchString);
        })
        break;


}