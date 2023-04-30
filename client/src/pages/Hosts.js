import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Divider, Link } from '@mui/material';
import LazyTable from '../components/LazyTable';


import { useParams } from 'react-router-dom';


const config = require('../config.json');


export default function HostsPage() {

  const {host_id} = useParams();
  const [hostsData, setHosts] = useState({});
  const [HostNameData, HostName] = useState('');

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/hosts/${host_id}`)
      .then(res => res.json())
      .then(resJson => {
        console.log(resJson); // add this line to log the response data
        setHosts(resJson);
      });

      fetch(`http://${config.server_host}:${config.server_port}/host_name/${host_id}`)
      .then(res => res.json())
      .then(resJson => {
        console.log("lol",resJson); // add this line to log the response data
        HostName(resJson);
      });
  }, [host_id]);

  const hostColumns = [
    { field: 'listing_id', headerName: 'Listing ID',renderCell: (row) => <NavLink to={`/reviews/${row.listing_id}`}>{row.listing_id}</NavLink> },
    { field: 'lisitng_name', headerName: 'Listing Name' },
    { field: 'neighborhood', headerName: 'Neighborhood' },
    { field: 'price', headerName: 'Price' },
    { field: 'city', headerName: 'City' },
    { field: 'state', headerName: 'State' },
  ];

const get_host_list_ratings = [
  { field: 'host_id', headerName: ' Host ID', renderCell: (row) => <NavLink to={`/hosts/${row.host_id}`}>{row.host_id}</NavLink> },
    { field: 'host_name', headerName: 'Host Name' },  
    {field: 'num_listings', headerName: 'Number of Listings' },
];


  return (
    <Container maxWidth="lg">

{/* <Typography variant="h3" component="h3" fontWeight="bold" style={{ marginBottom: '16px' }}>
  {HostNameData ? HostNameData : "Loading..."}
</Typography> */}
{/* 
  {HostNameData ? HostNameData : "Loading..."} */}
   <p>
  <h1 style={{ color: 'green' }}>{HostNameData}'s Listings</h1>
</p>

      <h2> Host Listings</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/hosts/${host_id}`} columns={hostColumns} />
      <Divider />
      <h2> Hosts in the same city with Most Listings</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/get_mostpop_hosts/${host_id}`} columns={get_host_list_ratings} />
      <Divider />

{/*  get unique host name from host listings and print it */}


    </Container>
  );
}
