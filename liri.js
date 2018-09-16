var Spotify = require('node-spotify-api');
var moment = require('moment');
var bandsintown = require('bandsintown')('codingbootcamp');
var fs = require("fs"); // for reading random file
var request = require("request");
require('dotenv').load(); // for .env properties
console.log(process.env);
console.log(process.env.SECRET_KEY)

// concert-this
// spotify-this-song ** Not currently supported.
// movie-this
// do-what-it-says


var debug = "true" // toggle for debugging

// Action Handle
var action = process.argv[2];

// Determine which function gets run.
switch (action) {
    case "concert-this": // concert-this
        concert_this(process.argv[3]);
        break;

    case "spotify-this": // spotify-this-song
        spotify_this(process.argv[3]);
        break;

    case "movie-this":  // movie-this
        movie_this(process.argv[3]);
        break;

    case "do-what-it-says":  // do-what-it-says
        doWhat();
        break;
}

function renderDebugTxt(a, b) {
    if (debug === "true") {
        console.log('\x1b[31m%s\x1b[0m', a, b);
    }
}

function renderTxt(a, b) {
    console.log('\x1b[37m%s\x1b[34m%s\x1b[0m', a, b);

    var logger = fs.createWriteStream('log.txt', {
        flags: 'a' // 'a' means appending (old data will be preserved)
    });

    logger.write(a + b + '\n', 'utf8');// append string to your file
    //fs.appendFileSync('log.txt', a + b + '\n');
}

//  ****  +Concert This! *****
function concert_this(band) {
    bandsintown
        .getArtistEventList(band)
        .then(function (events) {
            // return array of events
            renderDebugTxt('Number of Events: ', events.length);
            for (var e = 0, l = events.length; e < l; e++) {
                var event = events[e];
                // renderDebugTxt('Event Object: ', event);
                // Title of Event
                renderTxt('', "++++++++++++++++++++++++++++++++++++++++++++++");
                renderTxt('Event Title: ', event['title']);
                var ev = JSON.stringify(event['venue']);
                renderDebugTxt('Venue Obj: ', ev);
                //renderDebugTxt('Number of Venues', JSON.parse(ev).length);
                renderTxt('Venu Name: ', event['venue'].name);
                //Venue location
                renderTxt('Location: ', event['venue'].city + ', ' + event['venue'].region + ', ' + event['venue'].country);
                //Date of the Event (use moment to format this as "MM/DD/YYYY")
                var ed = moment(event['datetime']).format('l');
                renderTxt('Date of Event: ', ed);
            }
        });
}
// *** -Concert This ****

//  ****  +Movie This! *****
function movie_this(movie) {
    // format for cleaner URL string.
    let _mov = movie.split(' ').join('+');
    renderDebugTxt('movie string', _mov);

    // Then run a request to the OMDB API with the movie specified
    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            // Need to return ::
            //console.log(JSON.stringify(body));
            renderDebugTxt('json-out', body);
            //* Title of the movie.
            renderTxt("Title: ", JSON.parse(body).Title);
            //* Year the movie came out.
            renderTxt("Year: ", JSON.parse(body).Year);
            //* IMDB Rating of the movie.
            renderTxt("IMDB Rating: ", JSON.parse(body).imdbRating);
            //* Rotten Tomatoes Rating of the movie.
            var rObj = JSON.parse(body).Ratings; // grab nested ratings from json
            //console.log('Ratings Obj:  ' +  JSON.stringify(rObj));
            var newRatings = {};
            for (var i = 0, len = rObj.length; i < len; i++) {
                newRatings[rObj[i].Source] = (rObj[i].Value); // Convert to a key:value pair (make it easier, for later :P ) 
            }
            //console.log('New Ratings : ' + JSON.stringify(newRatings));
            renderTxt('Rotten Tomatoes: ', newRatings["Rotten Tomatoes"]);
            //* Country where the movie was produced.
            renderTxt('Country: ', JSON.parse(body).Country);
            //* Language of the movie.
            renderTxt('Language: ', JSON.parse(body).Language);
            //* Plot of the movie.
            renderTxt('Plot: ', JSON.parse(body).Plot);
            //* Actors in the movie
            renderTxt("Actors: ", JSON.parse(body).Actors);
        }
    });
}
// *** -Movie This ****


// ****** +Spotify HANDLE * * ******
function spotify_this(song) {
    // need more
    var spoti = new Spotify(keys.spotify);

    spoti.searchTracks('Love', function (err, sdata) {
        if (err) {
            console.error('Something went wrong', err.message);
            return;
            // Print some information about the results
            console.log('I got ' + sdata.body.tracks.total + ' results!')
            // Loop Through the newly created output array
            for (var i = 0; i < output.length; i++) {

                // Print each element (item) of the array/
                console.log(output[i]);
                //   Artist(s)
                // The song's name
                // A preview link of the song from Spotify
                // The album that the song is from
            }
        }
    });
}
// ******* -Spotify FILE HANDLE * * ******

// ****** +do-what-it-says HANDLE * * ******
function doWhat() {
    // need more
    var spotify = new Spotify(keys.spotify);
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
    });
}
// ****** * *  -do-what-it-says HANDLE * * ******