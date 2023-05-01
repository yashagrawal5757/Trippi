import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import React, {  useRef } from "react";

import {
  Box,TextField,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from '@mui/material';

import { styled } from '@mui/material/styles';

function MapContainer({ lat, lng }) {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const loadMap = async () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDVHMOu8SJyExguiEce3cIClCHdo3SneyY`;
      script.onload = () => {
        const newMap = new window.google.maps.Map(mapContainer.current, {
          center: { lat: lat, lng: lng },
          zoom: 15,
        });
        setMap(newMap);
        new window.google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: newMap,
        });
      };


      document.head.appendChild(script);
    };

    loadMap();
  }, [lat, lng]);

  return <div ref={mapContainer} style={{ width: "800px", height: "550px" }}></div>;
}



const config = require('../config.json');

const columns = ['County', 'Name', 'Address', 'Lat', 'Lng', 'Type', 'State', 'City'];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f5f5f5',
  },
}));

const StateBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '16px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const StateImage = styled('img')({
  width: '50%',
  height: '50%',
  objectFit: 'cover',
});

export default function HomePage() {
  const [states, setStateData] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);




  useEffect(() => {
    // Fetch the state data from the server and set the state using the useState hook's setState method.
    fetch(`http://${config.server_host}:${config.server_port}/states`)
      .then((res) => res.json())
      .then((resJson) => setStateData(resJson));
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    fetch(`http://${config.server_host}:${config.server_port}/searchAttractions?name=${query}`)
      .then((res) => res.json())
      .then((resJson) => setSearchResults(resJson));
  }, [query]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSelectedAttraction(null); // Add this line
    fetch(`http://${config.server_host}:${config.server_port}/searchAttractions?name=${query}`)
      .then((res) => res.json())
      .then((resJson) => {
        setSearchResults(resJson);
        setIsDialogOpen(true);
      });
  };

  const handleSearchInput = (event) => {
    setQuery(event.target.value);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenMapDialog = () => {
    setIsMapDialogOpen(true);
  };
  
  const handleCloseMapDialog = () => {
    setIsMapDialogOpen(false);
    setSelectedAttraction(null);
  };

  return (
    <Box>
 <div style={{ marginTop: "40px", marginLeft: "40px", marginBottom: "40px" }}>
  <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center" }}>

    <Typography variant="h2" component="h2" fontWeight="bold" fontSize= "35px" marginLeft= "100px" >
    Explore Attractions by State
  </Typography>
    
    <TextField
      label="Search Attractions"
      value={query}
      onChange={handleSearchInput}
      style={{ marginLeft: "100px", width: "500px" }}
    />
    <Button
      type="submit"
      variant="contained"
      color="primary"
      style={{ marginLeft: "10px", height: "56px" }}
    >
      Search
    </Button>
   
  </form>
</div>




      {searchResults.length > 0 && (
        <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="lg" maxHeight="80%">
          <DialogTitle>Search Results</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>County</StyledTableCell>
                    <StyledTableCell>Attraction Name</StyledTableCell>
                    <StyledTableCell>Address</StyledTableCell>
                    <StyledTableCell>Latitude</StyledTableCell>
                    <StyledTableCell>Longitude</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell>State</StyledTableCell>
                    <StyledTableCell>City</StyledTableCell>
                    <StyledTableCell>Map</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
  {searchResults.map((result, index) => (
    <StyledTableRow key={index}>
      {columns.map((column) => (
        <TableCell key={column}>{result[column]}</TableCell>
      ))}
      <TableCell key="map">
  <img
    src="https://img.icons8.com/ios-glyphs/30/000000/marker.png"
    onClick={() => {
      setSelectedAttraction(result);
      handleOpenMapDialog();
    }}
  />
</TableCell>
    </StyledTableRow>
  ))}
</TableBody>

              </Table>
            </TableContainer>

            
            {selectedAttraction && (
      <DialogContent>
        <MapContainer lat={selectedAttraction['Lat']} lng={selectedAttraction['Lng']} />
      </DialogContent>
    )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

{selectedAttraction && (
  <Dialog open={isMapDialogOpen} onClose={handleCloseMapDialog} maxWidth="xl">
    <DialogTitle>Map</DialogTitle>
    <DialogContent>
      <MapContainer lat={selectedAttraction['Lat']} lng={selectedAttraction['Lng']} />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseMapDialog} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
)}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {states.map((state) => (
          <Link to={`/state/${state.state}`} key={state.state}>
          <StateBox key={state.state} m={2}>
            <Card sx={{ width: 250, height: 250, borderRadius: 2, cursor: 'pointer', transition: 'transform 0.3s' }}>
              <img
                src={`${process.env.PUBLIC_URL}/${state.state}.png`}
                alt={`${state.state} flag`}
                style={{ width: '100%', height: '70%', objectFit: 'cover', borderRadius: '2px 2px 0 0' }}
              />
              <CardContent>
                <Typography variant="h5" component="h2" align="center">
                  {state.state}
                </Typography>
              </CardContent>
            </Card>
          </StateBox>
          </Link>
        ))}
      </Box>
    </Box>
  );
        }
