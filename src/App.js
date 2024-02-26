import React, { useState } from 'react';
import axios from 'axios';
import KeywordForm from './KeywordForm';
import Login from './login';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

const App = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleKeywordsSubmit = (submittedKeyword) => {
    setLoading(true);
    setError('');
    setKeyword(submittedKeyword);
    const API_POST_URL = 'https://api.dataforseo.com/v3/serp/google/organic/task_post';
    const postArray = [{
      "language_code": "en",
      "location_code": 2840,
      "keyword": submittedKeyword
    }];

    axios.post(API_POST_URL, postArray, {
      auth: {
        username: process.env.REACT_APP_API_USERNAME,
        password: process.env.REACT_APP_API_PASSWORD
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(postResponse => {
      const taskId = postResponse.data.tasks[0].id;
      setTimeout(() => {
        const API_GET_URL = `https://api.dataforseo.com/v3/serp/google/organic/task_get/regular/${taskId}`;
        axios.get(API_GET_URL, {
          auth: {
            username: process.env.REACT_APP_API_USERNAME,
            password: process.env.REACT_APP_API_PASSWORD
          }
        }).then(getResponse => {
          if (getResponse.data && getResponse.data.tasks && getResponse.data.tasks[0].result) {
            const organicResults = getResponse.data.tasks[0].result[0]?.items
              .filter(item => item.type === "organic")
              .map(item => ({
                ...item,
                domain: item.domain.replace(/^www\./, ''),
                favicon: `https://s2.googleusercontent.com/s2/favicons?domain=${item.domain}`
              }))
              .slice(0, 20); // Only take the top 20 results
            setResults(organicResults);
          } else {
            setError('No data found');
          }
          setLoading(false);
        }).catch(getError => {
          console.error("Error fetching results:", getError);
          setError('Error fetching results');
          setLoading(false);
        });
      }, 10000); // Adjust based on expected task completion time
    }).catch(postError => {
      console.error("Error creating task:", postError);
      setError('Error creating task');
      setLoading(false);
    });
  };

  return (
    <Container maxWidth="lg">
      {isLoggedIn ? (
        <>
          <Typography variant="h4" component="h1" gutterBottom align="center" marginTop={4}>
            Keyword SERP
          </Typography>
          <KeywordForm onKeywordsSubmit={handleKeywordsSubmit} />
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <CircularProgress />
            </div>
          ) : error ? (
            <Typography color="error" align="center">
              {error}
            </Typography>
          ) : (
            <>
              <Typography variant="h6" gutterBottom marginTop={4}>
                Results for: <span style={{ color: '#1976d2' }}>{keyword}</span>
              </Typography>
              <TableContainer component={Paper} elevation={3}>
                <Table aria-label="search results table">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Domain</TableCell>
                      <TableCell>Title</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={item.favicon} alt="Favicon" style={{ width: '24px', height: '24px' }} />
                            {item.domain}
                          </div>
                        </TableCell>
                        <TableCell>{item.title}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </Container>
  );
};

export default App;