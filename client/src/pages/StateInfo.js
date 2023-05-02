import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const config = require('../config.json');

const columns = ['County', 'Name', 'Address', 'Lat', 'Lng', 'Type', 'State', 'City'];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#43a047',

  color: theme.palette.common.white,
  fontSize: '16px', // add font size

  fontWeight: theme.typography.fontWeightBold,
  padding: '8px 16px', // adjust padding
  margin: '10px' // adjust margin

}));



const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#e8f5e1',

  },
  height: '40px' // adjust height
}));


export default function StateInfo() {
  const [attractions, setAttractions] = useState([]);
  const [counties, setCounties] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { state } = useParams();

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/searchAttractionsbystate?state=${state}`)
      .then((res) => res.json())
      .then((resJson) => setAttractions(resJson));

    // Fetch available counties and types from database
    fetch(`http://${config.server_host}:${config.server_port}/getCounties?state=${state}`)
      .then((res) => res.json())
      .then((resJson) => setCounties(resJson));
    fetch(`http://${config.server_host}:${config.server_port}/getTypes?state=${state}`)
      .then((res) => res.json())
      .then((resJson) => setTypes(resJson));
  }, [state]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = () => {
    fetch(`http://${config.server_host}:${config.server_port}/searchAttractionsbyCountyType?state=${state}&county=${selectedCounty}&type=${selectedType}`)
      .then((res) => res.json())
      .then((resJson) => setAttractions(resJson));
  };

  return (
    <Box>
<h1 style={{ marginBottom: '16px', fontSize: '30px', fontFamily: '"Roboto", sans-serif', textAlign: 'center', color: 'green' }}>
  Attractions in {state}
</h1>

      <Box display="flex" justifyContent="center" alignItems="center" marginBottom="16px">
        <FormControl variant="outlined" size="small" style={{ marginRight: '8px', width: '200px', height: '40px' }}>
          <InputLabel id="county-select-label">County</InputLabel>
          <Select
            labelId="county-select-label"
            value={selectedCounty}
            onChange={(event) => setSelectedCounty(event.target.value)}
            label="County"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {counties.map((county) => (
              <MenuItem key={county} value={county}>
                {county}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small" style={{ marginRight: '8px', width: '200px', height: '40px' }}>
          <InputLabel id="type-select-label">Type</InputLabel>
          <Select
            labelId="type-select-label"
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
            label="Type"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {types.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleSearch} style={{ backgroundColor: '#43a047', color: 'white' }}>
  Search
</Button>
      </Box>
      <TableContainer component={Paper} style={{ margin: '1px' }}>
        <TablePagination
          rowsPerPageOptions={[10,25,50,100]}
          component="div"
          count={attractions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={column}>{column}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {attractions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((attraction, index) => (
                <StyledTableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column}>{attraction[column]}</TableCell>
                  ))}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10,25,50,100]}
          component="div"
          count={attractions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}
