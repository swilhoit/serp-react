import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const Login = ({ onLogin, onLogout, isLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username === 'test' && password === 'test') {
      onLogin();
    } else {
      alert('Invalid username or password');
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <>
      {isLoggedIn ? (
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        // Added Box component here with marginTop of 50px
        <Box marginTop={5}> {/* 50px margin top */}
          <form onSubmit={handleSubmit}>
            <Box marginBottom={2}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  style: { backgroundColor: 'white' }, // Set background color to white
                }}
              />
            </Box>
            <Box marginBottom={2}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  style: { backgroundColor: 'white' }, // Set background color to white
                }}
              />
            </Box>
            <Button variant="contained" color="primary" type="submit">
              Login
            </Button>
          </form>
        </Box>
      )}
    </>
  );
};

export default Login;
