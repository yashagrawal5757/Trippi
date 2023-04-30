import { useEffect, useState } from 'react';
import { Button, MenuItem, Typography, FormControl, InputLabel, Select, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');


export default function SongsPage() {
  const [selectedListingId, setSelectedListingId] = useState(null);
  const {listing_id} = useParams();
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [price, setPrice] = useState([0, 1000]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/get_listings`)
      .then(res => res.json())
      .then(resJson => {
        const listingsWithId = resJson.map((listing) => ({ id: listing.id, ...listing }));
        setData(listingsWithId);
      });
  }, []);

  const search = () => {
    
    // Make a request to the backend with the search parameters
    fetch(`http://${config.server_host}:${config.server_port}/get_listings?name=${name}`+`&neighborhood=${neighborhood}`+`&city=${city}`+`&price_low=${price[0]}`+`&price_high=${price[1]}`)
      .then(res => res.json())
      .then(resJson => {
        const listingsWithId = resJson.map((listing) => ({id: listing.id, ...listing }));
        setData(listingsWithId);
      });
  }

const columns = [
  { field: 'id', headerName: 'ID', renderCell: (row) => <NavLink to={`/reviews/${row.id}`}>{row.id}</NavLink>
},
  {field : 'name', headerName : 'Name', width: 450 },
{ field: 'city', headerName: 'City', width: 250 },
{ field: 'neighborhood', headerName: 'Neighborhood', width: 250 },
{ field: 'price', headerName: 'Price' },
]

return (
  <Container>
      <Grid container spacing={2} alignItems="center" justify="center">
        <Grid item xs={12}>
          <TextField id="name" label="Name" fullWidth value={name} onChange={e => setName(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="city-label">City</InputLabel>
            <Select labelId="city-label" id="city" value={city} onChange={e => setCity(e.target.value)}>
              <MenuItem value="Austin">Austin</MenuItem>
              <MenuItem value="Chicago">Chicago</MenuItem>
              <MenuItem value="Los Angeles">Los Angeles</MenuItem>
              <MenuItem value="New York">New York</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField id="neighborhood" label="Neighborhood" fullWidth value={neighborhood} onChange={e => setNeighborhood(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <Typography id="price-label" gutterBottom>
            Price
          </Typography>
          <Slider
            value={price}
            onChange={(e, newValue) => setPrice(newValue)}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
          />
        </Grid>
        {/* <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Search
          </Button>
        </Grid> */}
      </Grid>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
    
    <h2>Results</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={data}
        columns={columns}
        autoHeight
      />
  </Container>
);
}
