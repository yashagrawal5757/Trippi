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

//************** new  ones ****************/ 
app.get('/author/:type', routes.author);

app.get('/reviews/:listing_id', routes.reviews);
app.get('/hosts/:host_id', routes.hosts);
app.get('/search', routes.searchListings);
app.get('/attractions', routes.attractions);
app.get('/states', routes.states);
app.get('/listing/:listing_id', routes.listing);


app.get('/top_hosts', routes.top_hosts);
app.get('/attractions_nearby/:listingid', routes.getAttractionsNearListing);
app.get('/hosts_samecity/:hostid', routes.getHostsInSameCity);
app.get('/gethost_list_ratings', routes.getHostsWithListingsAndRatings);
app.get('/attractions_within_distance', routes.getAttractionsWithinDistance);
app.get('top_5_hosts/:city/:state', routes.getHostStats);
app.get('/top_reviewers',routes.getReviewerStats);
app.get('/hosts_top10neighborpoolwifi', routes.gettop10neighborhoodsincitybypricewithpoolwifi);app.get('/get_neighborhoods', routes.neighborhoods);
app.get('/hosts_top10attractions', routes.gettop10attractions);
app.get('/get_neighborhoods', routes.neighborhoods);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
