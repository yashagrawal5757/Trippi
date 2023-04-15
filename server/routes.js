const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
const author = async function(req, res) {
  // TODO (TASK 1): replace the values of name and pennKey with your own
  const name = 'Gokul, Shivani, Yash & Priyanka';
  const pennKey = 'gokuln';

  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (req.params.type === 'pennkey') {
    res.send(`Created by ${pennKey}`);
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`);
  }
}


// Route 2: GET /random
const random = async function(req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey
  const explicit = req.query.explicit === 'true' ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  connection.query(`
    SELECT *
    FROM Songs
    WHERE explicit <= ${explicit}
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json({
        song_id: data[0].song_id,
        title : data[0].title
      });
    }
  });
}

/********************************
 * BASIC SONG/ALBUM INFO ROUTES *
 ********************************/

// Route 3: GET /song/:song_id
const song = async function(req, res) {

  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Most of the code is already written for you, you just need to fill in the query
  connection.query(`SELECT * FROM Songs WHERE song_id = "${req.params.song_id}"`
  , (err, data) => {
    if (err || data.length === 0) {
      res.json({});
    } else {
      res.json({
        song_id: data[0].song_id,
        title : data[0].title,
        number : data[0].number,
        duration : data[0].duration,
        explicit : data[0].explicit,
        key_mode : data[0].key_mode,
        danceability : data[0].danceability,
        energy : data[0].energy,
        valence : data[0].valence,
        album_id: data[0].album_id,
        plays : data[0].plays,
        tempo : data[0].tempo
      });
    }
  });
}

// Route 4: GET /album/:album_id
const album = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
    connection.query(`SELECT * FROM Albums WHERE album_id = "${req.params.album_id}"`
    , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({
        title : data[0].title,
        album_id : data[0].album_id,
        release_date: data[0].release_date,
        thumbnail_url : data[0].thumbnail_url
      });
    }
  });

}

// Route 5: GET /albums
const albums = async function(req, res) {
  // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
  // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
 connection.query(`SELECT * FROM Albums ORDER BY release_date DESC`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.map(song => ({
        title : song.title,
        album_id : song.album_id,
        release_date: song.release_date,
        thumbnail_url : song.thumbnail_url
      }))); 
      console.log(data);
    }
  });
}

// Route 6: GET /album_songs/:album_id
const album_songs = async function(req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  connection.query(`SELECT S.* from Albums a JOIN Songs S on a.album_id = S.album_id
WHERE a.album_id = "${req.params.album_id}" ORDER BY S.number`
    , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.map(song => ({
        song_id : song.song_id,
        title : song.title,
        number : song.number, 
        duration : song.duration,
        plays: song.plays
      })));
    }
  });
}

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /top_songs
const top_songs = async function(req, res) {
  const page = req.query.page;
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10

  const pageSize = req.query.page_size ? req.query.page_size : 10;
  
  if (!page) {

    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    // Hint: you will need to use a JOIN to get the album title as well
      // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  connection.query(`select S.*, a.title AS album
  from Albums a JOIN Songs S on a.album_id = S.album_id
  ORDER BY S.plays desc`
      , (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } 
      else{

        res.json(data.map(song => ({
          title : song.title,
          song_id: song.song_id,
          album_id : song.album_id,
          album: song.album,
          plays : song.plays
        })));
      }
    });
      

  } 
  else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
 // replace this with your implementation
 connection.query(`SELECT S.*, a.title as album
 FROM Albums a JOIN Songs S on a.album_id = S.album_id 
 ORDER BY S.plays DESC LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`
      , (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } 
      
      else {

        res.json(data.map(song => ({
          song_id: song.song_id,
          title : song.title,
          album_id : song.album_id,
          album: song.album,
          plays : song.plays
        })));
      }
    });

  }
}






// Route 8: GET /top_albums
const top_albums = async function(req, res) {
  // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
  const page = req.query.page;

  const pageSize = req.query.page_size ? req.query.page_size : 10;
  
  if (!page) {

   
  connection.query(`SELECT Albums.*, SUM(Songs.plays) AS album_plays
  FROM Albums
  JOIN Songs ON Albums.album_id = Songs.album_id
  GROUP BY Albums.album_id
  ORDER BY album_plays DESC`
      , (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } 
      else{
        console.log(data);
        res.json(data.map(album => ({
          album_id : album.album_id,
          title: album.title,
          plays : album.album_plays
        })));
      }
    });
      

  } 
  else {

 connection.query(`SELECT Albums.*, SUM(Songs.plays) AS album_plays
 FROM Albums
 JOIN Songs ON Albums.album_id = Songs.album_id
 GROUP BY Albums.album_id
 ORDER BY album_plays DESC LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`
      , (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } 
      
      else {

        res.json(data.map(album => ({
          album_id : album.album_id,
          title: album.title,
          plays : album.album_plays
        })));

      }
    });

  }
}

// Route 9: GET /search_albums
const search_songs = async function(req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const title = req.query.title ?? '';
  const durationLow = req.query.duration_low ?? 60;
  const durationHigh = req.query.duration_high ?? 660;
  const playsLow = req.query.plays_low ?? 0;
  const playsHigh = req.query.plays_high ?? 1100000000;
  const danceabilityLow = req.query.danceability_low ?? 0;
  const danceabilityHigh = req.query.danceability_high ?? 1;
  const energyLow = req.query.energy_low ?? 0;
  const energyHigh = req.query.energy_high ?? 1;
  const valenceLow = req.query.valence_low ?? 0;
  const valenceHigh = req.query.valence_high ?? 1;
  const explicit = req.query.explicit ?? false;

  connection.query(`SELECT * FROM Songs 
  WHERE title LIKE '%${title}%' AND 
  duration >= ${durationLow} AND duration <= ${durationHigh} AND plays >= ${playsLow} AND plays <= ${playsHigh}
  AND danceability >= ${danceabilityLow} AND danceability <= ${danceabilityHigh} 
  AND energy >= ${energyLow} AND energy <= ${energyHigh} 
  AND valence >= ${valenceLow} AND valence <= ${valenceHigh} AND explicit <= ${explicit}  
  ORDER BY title ASC`
, (err, data) => {
       if (err || data.length === 0) {
         console.log(err);
         res.json([]);
       } 
       
       else {
        res.json(data.map(song => ({
          song_id: song.song_id,
          album_id: song.album_id,
          title: song.title,
          number : song.number,
          duration: song.duration,
          plays: song.plays,
          danceability: song.danceability,
          energy: song.energy,
          valence: song.valence,
          tempo: song.tempo,
          key_mode: song.key_mode,
          explicit: song.explicit
        })));
 
       }
     });
}
 
// **************************PROJECT QUERY ROUTES *********************************

// SIMPLE 1: Display the top hosts
// top_hosts/

const top_hosts = async function(req, res) {
  connection.query('SELECT h.host_name, COUNT(*) AS num_listings FROM Host h JOIN Listings l ON h.host_id = l.host_id GROUP BY h.host_name ORDER BY num_listings DESC LIMIT 10'
   , (err, data) => {
  if (err || data.length === 0) {
  console.log(err);
  res.json({});
  } else {
  // Here, we return results of the query as an object, keeping only relevant data
  // being host_name and num_listings
  res.json(data.map((entry) => {
  return {
  host_name: entry.host_name,
  num_listings: entry.num_listings
  };
  }));
  }
  });
  };


// SIMPLE 2: GET NEARBY ATTRACTIONS OF A LISTING
// attractions_nearby/:listingid

const getAttractionsNearListing = async function(req, res) {
connection.query(`SELECT Attractions.Name, Attractions.Type, Attractions.Address 
                   FROM Attractions 
                   JOIN Listings ON Listings.city = Attractions.County 
                   AND Listings.state = Attractions.State 
                   WHERE Listings.id = "${req.params.listingid}"
                   AND (3959 * ACOS(COS(RADIANS(Listings.latitude)) * COS(RADIANS(Attractions.Lat)) * COS(RADIANS(Attractions.Lng) - RADIANS(Listings.longitude)) + SIN(RADIANS(Listings.latitude)) * SIN(RADIANS(Attractions.Lat)))) <= 5`, 
                   (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being name, type, and address
      res.json(data.map((entry) => {
        return {
          name: entry.Name,
          type: entry.Type,
          address: entry.Address
        };
      }));
    }
  });
};


module.exports = {
  author,
  random,
  song,
  album,
  albums,
  album_songs,
  top_songs,
  top_albums,
  search_songs,
  top_hosts,
  getAttractionsNearListing
}
