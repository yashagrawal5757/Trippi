import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { Typography } from '@mui/material';
import LazyTable from '../components/LazyTable';

import { useParams } from 'react-router-dom';

const config = require('../config.json');



export default function ReviewsPage() {
  const [listingInfo, setListingInfo] = useState({});
  const { listing_id } = useParams();
  const [reviewData, setReviews] = useState({});
  

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/listing/${listing_id}`)
      .then(res => res.json())
      .then(resJson => setListingInfo(resJson));

      fetch(`http://${config.server_host}:${config.server_port}/reviews?listing_id=${listing_id}`)
      .then(res => res.json())
      .then(resJson => setReviews(resJson));
  }, [listing_id]);

  const reviewColumns = [
    {
    field: 'review_id',
    headerName: 'Review ID'
    },
    {
    field: 'listing_id',
    headerName: 'Listing ID'
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
  

  return (
    <Container maxWidth="lg">
   <Typography variant="h2" component="h2" fontWeight="bold" style={{ marginBottom: '16px' }}>
   {listingInfo.listing_id} - {listingInfo.name}
</Typography>
<Typography variant="h4" component="h4" fontWeight="bold" style={{ marginBottom: '16px' }}>
  {listingInfo.city}, {listingInfo.state}
</Typography>
<Divider />

<Typography variant="body1" style={{ marginBottom: '16px' }}>
  {listingInfo.description}
</Typography>



    <h2>Reviews</h2>
    <LazyTable route={`http://${config.server_host}:${config.server_port}/reviews/${listing_id}`} columns={reviewColumns} />
    <Divider />

    </Container>
  );
}
