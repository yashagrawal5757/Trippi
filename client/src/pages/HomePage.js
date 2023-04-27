import { useEffect, useState } from 'react';
import { Container, Divider, Link,Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import LazyTable from '../components/LazyTable';
import logo from './/favicon.ico'; // Import the image file

const config = require('../config.json');


export default function HomePage() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  
  // TODO (TASK 13): add a state variable to store the app author (default to '')
  const [author, setAuthor] = useState('')



  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/author/name`)
    .then(res => res.text())
    .then(resText => setAuthor(resText));
  }, []);

  
 

  // Here, we define the columns of the "Top Songs" table. The songColumns variable is an array (in order)
  // of objects with each object representing a column. Each object has a "field" property representing
  // what data field to display from the raw data, "headerName" property representing the column label,
  // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.
  const hostColumns = [
    {
      field: 'host_id',
      headerName: 'Host ID',
      renderCell: (row) => <NavLink to={`/hosts/${row.host_id}`}>{row.host_id}</NavLink>
    },
    {
      field: 'host_name',
      headerName: 'Host Name'
    },
    {
      field: 'num_listings',
      headerName: 'Number of Listings'
    },
    {
      field: 'avg_price',
      headerName: 'Average Price of Listing($)'
    }
  ]

  // TODO (TASK 15): define the columns for the top albums (schema is Album Title, Plays), where Album Title is a link to the album page
  // Hint: this should be very similar to songColumns defined above, but has 2 columns instead of 3
  const listingColumns = [
    {
      field: 'listing_id',
      headerName: 'Listing ID',
      renderCell: (row) => <NavLink to={`/reviews/${row.listing_id}`}>{row.listing_id}</NavLink>

    },
    {
      field: 'name',
      headerName: 'Name'

    },
    
    {
      field: 'price',
      headerName: 'Price'

    },
    {
      field: 'city',
      headerName: 'City'

    },
    {
      field: 'state',
      headerName: 'City'

    },

  ]

  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="Trippi favicon" style={{ marginRight: '10px' }} />
        <Typography variant="h2" component="h2" fontWeight="bold">
          Trippi : Your Travel Guide 
        </Typography>
      </div>
  
      {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
      <Divider />
      <h2>Top Hosts</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/top_hosts`} columns={hostColumns} />
      <Divider />
  
      {/* TODO (TASK 16): add a h2 heading, LazyTable, and divider for top albums. Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
      <h2>Top Listings</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/search`} columns={listingColumns} defaultPageSize={5} rowsPerPageOptions={[5, 10]}/>
      <Divider />
  
      {/* TODO (TASK 17): add a paragraph (<p>text</p>) that displays the value of your author state variable from TASK 13 */}
      <p>{author}</p>
  
    </Container>
  );
};