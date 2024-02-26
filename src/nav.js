import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Navigation = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: '#1e2024' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My Application
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Home
        </Button>
        <Button color="inherit" component={RouterLink} to="/serp">
          Basic SERP
        </Button>
        <Button color="inherit" component={RouterLink} to="/related-keywords">
          Related Keyword Finder
        </Button>
        <Button color="inherit" component={RouterLink} to="/historical-serp">
          Historical SERP
        </Button>
        {/* Add more buttons as needed */}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
