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

 
// **************************PROJECT QUERY ROUTES *********************************



// basic queries
// 1. reviews

const reviews = async function(req, res) {
  connection.query(`SELECT * FROM Reviews WHERE listing_id = "${req.params.listing_id}"`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.map(review => ({
        review_id: review.rev_id,
        listing_id: review.listing_id,
        reviewer_id: review.reviewer_id,
        review_name: review.review_name,
        review_date: review.date,
        comments: review.comments
      })));
    }
  });
}

// 2. hosts
const hosts = async function(req, res) {
  connection.query(`SELECT h.host_id,host_name,id,name,description,neighborhood,Price,city,state FROM Listings l JOIN Host h ON h.host_id = l.host_id WHERE l.host_id = "${req.params.host_id}" `, 
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.map(host => ({
        host_id: host.host_id,
        host_name: host.host_name,
        listing_id: host.id,
        lisitng_name: host.name,
        neighborhood: host.neighborhood,
        price: host.Price,
        city: host.city,
        state: host.state
      })));
    }
  });
}

// 3. search listing in city

const searchListings = async function(req, res) {
  const city = req.query.city ?? "Chicago";
  const limit = req.query.limit ?? 100;

  

  connection.query(`SELECT * FROM Listings WHERE city = "${city}"  LIMIT ${limit}`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.map(listing => ({
        listing_id: listing.listing_id,
        name: listing.name,
        description: listing.description,
        price: listing.Price,
        city: listing.city,
        neighborhood: listing.neighborhood
      })));
    }
  });
}

//4. get attractions in a county and of a type
// route endpoint -  /attractions
const attractions = async function(req, res) {
  const county = req.query.county ?? "New York";
  const limit = req.query.limit ?? 100;
  const type = req.query.type ?? "tourist"

  

  connection.query(`SELECT * FROM Attractions WHERE County = "${county}" and Type = "${type}" LIMIT ${limit}`, 
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.map(attractions => ({
        county: attractions.County,
        name: attractions.Name,
        address: attractions.Address,
        lat: attractions.Lat,
        lng: attractions.Lng,
        city: attractions.City,
        state: attractions.State,
        type: attractions.Type
      })));
    }
  });
}



// SIMPLE 1: Display the top hosts
// top_hosts/

const top_hosts = async function(req, res) {
  connection.query('SELECT h.host_id, h.host_name, COUNT(*) AS num_listings FROM Host h JOIN Listings l ON h.host_id = l.host_id GROUP BY h.host_id, h.host_name ORDER BY num_listings DESC LIMIT 20 '
   , (err, data) => {
  if (err || data.length === 0) {
  console.log(err);
  res.json({});
  } else {
  // Here, we return results of the query as an object, keeping only relevant data
  // being host_name, host_id and num_listings
  res.json(data.map((entry) => {
  return {
  host_id: entry.host_id,
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


const getHostsInSameCity = async function(req, res) {
  connection.query(`WITH target_host AS (
                      SELECT host_id, city
                      FROM Listings
                      WHERE host_id = '${req.params.hostid}'
                    )
                    SELECT DISTINCT h.host_name
                    FROM Host h
                    JOIN Listings l ON h.host_id = l.host_id
                    JOIN target_host th ON l.city = th.city
                    WHERE h.host_id != th.host_id;`, 
                    (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.map((entry) => {
        return {
          host_name: entry.host_name
        };
      }));
    }
  });
};

//Yash query 1 complex
const getHostsWithListingsAndRatings = async function(req, res) {
  connection.query(`SELECT h.host_name, COUNT(l.id) AS num_listings, AVG(r.comments) AS avg_rating
                    FROM Host h
                    JOIN Listings l ON h.host_id = l.host_id
                    LEFT JOIN Reviews r ON l.id = r.listing_id
                    GROUP BY h.host_name
                    HAVING COUNT(DISTINCT l.id) >= 5
                    ORDER BY COUNT(DISTINCT l.id) DESC;`,
                    (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.map((entry) => {
        return {
          host_name: entry.host_name,
          num_listings: entry.num_listings,
          avg_rating: entry.avg_rating
        };
      }));
    }
  });
};

// SIMPLE 3: 

const neighborhoods = async function(req, res) {
  connection.query('SELECT neighborhood, GROUP_CONCAT(name SEPARATOR ", ") AS listings, GROUP_CONCAT(CAST(price AS CHAR) SEPARATOR ", ") AS prices FROM ( SELECT neighborhood, name, price FROM Listings WHERE city in ("New York","Los Angeles") AND price < 200) AS Neighbour GROUP BY neighborhood HAVING COUNT(*) >= 3',
   (err, data) => {
  if (err || data.length === 0) {
  console.log(err);
  res.json({});
  } else {
  res.json(data.map(entry => ({
  neighborhood: entry.neighborhood,
  listings: entry.listings.split(', '),
  prices: entry.prices.split(', ').map(Number)
  })));
  }
  });
  }


//Yash query 2 complex
const getAttractionsWithinDistance = async function(req, res) {
  connection.query(`WITH attraction_distances AS (
                      SELECT a.Name, a.Type, a.Address, a.Lat, a.Lng, a.City, a.State, a.County,
                             MIN(sqrt(pow(l.latitude - a.Lat, 2) + pow(l.longitude - a.Lng, 2))) AS distance
                      FROM Attractions a
                      JOIN Listings l ON l.city = a.County AND l.state = a.State
                      WHERE l.city = 'Los Angeles' AND l.state = 'California' AND l.Price > 200
                      GROUP BY a.Name, a.Type, a.Address, a.Lat, a.Lng, a.City, a.State, a.County
                    )
                    SELECT Name, Type, Address, Lat, Lng, City, State, County, distance AS min_distance
                    FROM attraction_distances
                    ORDER BY min_distance ASC
                    LIMIT 20;`,
                    (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.map((entry) => {
        return {
          name: entry.Name,
          type: entry.Type,
          address: entry.Address,
          lat: entry.Lat,
          lng: entry.Lng,
          city: entry.City,
          state: entry.State,
          county: entry.County,
          min_distance: entry.min_distance
        };
      }));
    }
  });
};


const getHostStats = async function(req, res) {
  const { city, state } = req.params;
  
  connection.query(`
    WITH host_listings AS (
      SELECT host_id, COUNT(*) AS num_listings, AVG(Price) AS avg_price
      FROM Listings
      WHERE city = "${city}" AND state = "${state}"
      GROUP BY host_id
    ), listing_reviews AS (
      SELECT listing_id, COUNT(*) AS num_reviews
      FROM Reviews
      GROUP BY listing_id
    )
    SELECT h.host_name, hl.num_listings, hl.avg_price, SUM(lr.num_reviews) AS total_reviews
    FROM Host h
    JOIN host_listings hl ON h.host_id = hl.host_id
    JOIN Listings l ON h.host_id = l.host_id
    LEFT JOIN listing_reviews lr ON l.id = lr.listing_id
    WHERE l.city = "${city}" AND l.state = "${state}"
    GROUP BY h.host_name, hl.num_listings, hl.avg_price
    ORDER BY hl.num_listings DESC
    LIMIT 5;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      const results = data.map((row) => {
        return {
          host_name: row.host_name,
          num_listings: row.num_listings,
          avg_price: row.avg_price,
          total_reviews: row.total_reviews
        };
      });
      res.json(results);
}
});
};

//Simple 5 : Find the top 10 reviewers who have reviewed the most listings, along with the number of listings they've reviewed.

const getReviewerStats = async function(req, res) {
  connection.query('WITH reviewer_stats AS ( SELECT reviewer_id, COUNT(DISTINCT listing_id) AS num_listings_reviewed FROM Reviews GROUP BY reviewer_id ) SELECT h.host_name AS reviewer_name, rs.num_listings_reviewed FROM reviewer_stats rs JOIN Host h ON rs.reviewer_id = h.host_id ORDER BY rs.num_listings_reviewed DESC LIMIT 10', (err, data) => {
  if (err || data.length === 0) {
  console.log(err);
  res.json({});
  } else {
  const results = data.map((row) => {
  return {
  reviewer_name: row.reviewer_name,
  num_listings_reviewed: row.num_listings_reviewed
  };
  });
  res.json(results);
}
});
}


//query 6
const gettop10neighborhoodsincitybypricewithpoolwifi = async function(req, res) {
  connection.query(`WITH pool_listings AS (
    SELECT l.id, l.city, l.state, l.neighborhood, l.price
    FROM Listings l
    WHERE l.amenities LIKE '%pool%' OR
          l.amenities LIKE '%Wifi%'
  ), neighborhood_averages AS (
    SELECT pl.city, pl.state, pl.neighborhood, AVG(pl.price) AS avg_price
    FROM pool_listings pl
    GROUP BY pl.city, pl.state, pl.neighborhood
  ), ranked_neighborhoods AS (
    SELECT city, state, neighborhood, avg_price,
        ROW_NUMBER() OVER (PARTITION BY city, state ORDER BY avg_price DESC) AS ranks
    FROM neighborhood_averages
  )
  SELECT city, state, neighborhood, avg_price
  FROM ranked_neighborhoods
  WHERE ranks <= 10`
  , 
  (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        // Here, we return results of the query as an object, keeping only relevant data
        // being name, type, and address
        res.json(data.map((entry) => {
          return {
            id: entry.id,
            city: entry.city,
            state: entry.state,
            price: entry.price,
          };
        }));
      }
    });
  };

  const gettop10attractions = async function(req, res) {
    connection.query(`WITH nearby_listings AS (
      SELECT id, city, state, latitude, longitude
      FROM Listings
      WHERE city = 'Los Angeles' AND state = 'California'
    ), attractions_listings AS (
      SELECT A.Name, A.Type, A.Address, COUNT(*) AS num_listings
      FROM Attractions A
      JOIN nearby_listings N ON ST_Distance_Sphere(point(A.Lng, A.Lat), point(N.longitude, N.latitude)) <= 1609.34
      GROUP BY A.Name, A.Type, A.Address
    ), top_attractions AS (
      SELECT Name, Type, Address, num_listings,
             ROW_NUMBER() OVER (ORDER BY num_listings DESC) AS attraction_rank
      FROM attractions_listings
    )
    SELECT Name, Type, Address, num_listings
    FROM top_attractions
    WHERE attraction_rank <= 10`
    , 
    (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          // Here, we return results of the query as an object, keeping only relevant data
          // being name, type, and address
          res.json(data.map((entry) => {
            return {
              id: entry.id,
              city: entry.city,
              state: entry.state,
              latitude: entry.latitude,
              longitude: entry.longitude
            };
          }));
    }
  });
  };


module.exports = {
  author,
  reviews, 
  hosts,
  searchListings,
  attractions,

  top_hosts,
  getAttractionsNearListing,
  getHostsInSameCity,
  getHostsWithListingsAndRatings,
  getAttractionsWithinDistance,
  getHostStats,
  getReviewerStats,
  gettop10neighborhoodsincitybypricewithpoolwifi,
  neighborhoods,
  gettop10attractions
  
}
