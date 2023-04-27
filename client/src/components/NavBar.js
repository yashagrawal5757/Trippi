import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
const NavText = ({ href, text, isMain }) => {
  return (
    <Typography
      variant={isMain ? 'h3' : 'subtitle1'}
      noWrap
      style={{
        marginLeft: isMain ? 'auto' : '30px',
        fontFamily: 'monospace',
        fontWeight: isMain ? 900 : 700,
        letterSpacing: '.3rem',
        color: isMain ? '#fff' : '#e0e0e0'
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {
  return (
    <AppBar position='static' sx={{ bgcolor: '#43a047' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
        <link rel="shortcut icon" type="image/x-icon" href="/client/public/favicon.ico" />

          <NavText href='/' text='TRIPPI' isMain />
          <div style={{ flexGrow: 1 }} />
          <NavText href='/attractions' text='Attractions' />
          <NavText href='/listings' text='Listings' />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
