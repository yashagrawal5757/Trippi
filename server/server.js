const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/author/:type', routes.author);
app.get('/random', routes.random);
app.get('/song/:song_id', routes.song);
app.get('/album/:album_id', routes.album);
app.get('/albums', routes.albums);
app.get('/album_songs/:album_id', routes.album_songs);
app.get('/top_songs', routes.top_songs);
app.get('/top_albums', routes.top_albums);
app.get('/search_songs', routes.search_songs);

//************** new  ones ****************/ 
app.get('/reviews/:listing_id', routes.reviews);
app.get('/hosts/:host_id', routes.hosts);
app.get('/search', routes.searchListings);


app.get('/top_hosts', routes.top_hosts);
app.get('/attractions_nearby/:listingid', routes.getAttractionsNearListing);
app.get('/hosts_samecity/:hostid', routes.getHostsInSameCity);
app.get('/gethost_list_ratings', routes.getHostsWithListingsAndRatings);
app.get('/get_neighborhoods', routes.neighborhoods);




app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
