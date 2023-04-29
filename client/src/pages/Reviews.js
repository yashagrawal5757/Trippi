import { useEffect, useState } from 'react';
import { Container, Divider } from '@mui/material';
import { Typography } from '@mui/material';
import LazyTable from '../components/LazyTable';

import { useParams } from 'react-router-dom';


const config = require('../config.json');



export default function ReviewsPage() {
  const [listingInfo, setListingInfo] = useState({});
  const {listing_id} = useParams();
  const [reviewData, setReviews] = useState([]);
  const [reviewAttraction, setAttractions] = useState({});
  

  useEffect(() => {

    fetch(`http://${config.server_host}:${config.server_port}/listing/${listing_id}`)
      .then(res => res.json())
      .then(resJson => setListingInfo(resJson));

      fetch(`http://${config.server_host}:${config.server_port}/reviews/${listing_id}`)
      .then(res => res.json())
      .then(resJson => {
        console.log("test log:" + resJson);
      setReviews(resJson);
      });

      fetch(`http://${config.server_host}:${config.server_port}/attractions_nearby/${listing_id}`)
      .then(res => res.json())
      .then(resJson => setAttractions(resJson));
    
    }, 
  
  [listing_id]);

  const reviewColumns = [
    {
    field: 'review_id',
    headerName: 'Review ID'
    },

    {
    field: 'reviewer_id',
    headerName: 'Reviewer ID'
    },
    {
    field: 'review_name',
    headerName: 'Reviewer Name'
    },
    {
    field: 'review_date',
    headerName: 'Review Date'
    },
    {
    field: 'comments',
    headerName: 'Comments'
    }
    ];
  
    const attractionColumns = [
      {
        field: 'name',
        headerName: 'Name'
      },
      {
        field: 'type',
        headerName: 'Type'
      },
      {
        field: 'address',
        headerName: 'Address'
      }
    ];
    

    return (
      <Container maxWidth="lg">
        <Typography variant="h2" component="h2" fontWeight="bold" style={{ marginBottom: '16px' }}>
          {listingInfo.name}
        </Typography>
        <Typography variant="h4" component="h4" fontWeight="bold" style={{ marginBottom: '16px' }}>
          {listingInfo.city}, {listingInfo.state}
        </Typography>
        <Divider />
    
        <Typography variant="body1" style={{ marginBottom: '16px', textAlign: 'justify' }}>
          {listingInfo.description}
        </Typography>
    
        <h2>Nearby Attractions (&lt; 5 miles)</h2>
        {reviewAttraction.length === 0 ?  (
          <p>No attractions found within 5 miles.</p>
        ):(
          <LazyTable route={`http://${config.server_host}:${config.server_port}/attractions_nearby/${listing_id}`} columns={attractionColumns} />
        ) }
        <Divider />
    
        <h2>Reviews</h2>
        {reviewData.length === 0 ? (
            <p>No reviews found.</p>
          ):(
            <LazyTable route={`http://${config.server_host}:${config.server_port}/reviews/${listing_id}`} columns={reviewColumns} defaultPageSize={5}/>
            ) }
        <Divider />



        
      </Container>
    );
    
}
