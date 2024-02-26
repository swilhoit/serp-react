import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';

const KeywordForm = ({ onKeywordsSubmit }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (keyword.trim()) {
      onKeywordsSubmit(keyword);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        marginTop: 2,
        display: 'flex',
        flexDirection: 'column', // Changed from 'row' to 'column'
        alignItems: 'center',
      }}
    >
      <TextField
        variant="outlined"
        margin="normal"
        required
        id="keyword"
        label="Enter Keyword"
        name="keyword"
        autoComplete="keyword"
        autoFocus
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        size="extralarge" 
        sx={{ 
          fontSize: '3rem', 
          backgroundColor: 'white',
          borderRadius: '5px',
          width: '50%',
        }}
      />
      <Button
        type="submit"
        variant="contained"
        size="medium" // Changed size to 'medium'
        sx={{ 
          mt: 3, 
          mb: 2, 
          ml: 1, 
          height: '100%', 
          width: '50%', 
          backgroundColor: '#3c4163' 
        }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default KeywordForm;