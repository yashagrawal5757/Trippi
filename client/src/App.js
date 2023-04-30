import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { purple, green } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import Listings from './pages/Listings';
import Reviews from './pages/Reviews';
import Hosts from './pages/Hosts';



// createTheme enables you to customize the look and feel of your app past the default
// in this case, we change the primary and secondary colors to purple and green
export const theme = createTheme({
  palette: {
    primary: purple,
    secondary: {
      main: green[500], // Set the main color to green
      darker: green[700], // Set a darker shade of green
    },
  },
});



const globalStyles = `
  a:link {
    color: ${theme.palette.secondary.main}; // Set the color of non-visited links to the main green color
  }
  a:visited {
    color: ${theme.palette.secondary.darker}; // Set the color of visited links to a darker shade of green
  }
`;

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>{globalStyles}</style> {/* Add the global styles */}
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hosts/:host_id" element={<Hosts/>} />
          <Route path="/reviews/:listing_id" element={<Reviews/>} />
          <Route path="/get_listings" element={<Listings/>} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
