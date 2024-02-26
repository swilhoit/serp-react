import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box } from '@mui/material';
import KeywordForm from './KeywordForm';
import { Line } from 'react-chartjs-2';
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import Login from './login';

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RelatedKeywordFinder = () => {
  const [relatedKeywords, setRelatedKeywords] = useState([]);
  const [totalSearchVolume, setTotalSearchVolume] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');
  const [monthlySearchData, setMonthlySearchData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };


  const handleKeywordsSubmit = (submittedKeyword) => {
    setLoading(true);
    setError('');
    setKeyword(submittedKeyword);
    const API_POST_URL = 'https://api.dataforseo.com/v3/dataforseo_labs/google/related_keywords/live';
    const postArray = [{
      "keyword": submittedKeyword,
      "language_name": "English",
      "location_code": 2840,
      "depth": 4,
      "filters": [
        ["keyword_data.keyword_info.search_volume", ">", 10]
      ],
      "limit": 50
    }];

    axios({
      method: 'post',
      url: API_POST_URL,
      auth: {
        username: process.env.REACT_APP_API_USERNAME,
        password: process.env.REACT_APP_API_PASSWORD
      },
      data: postArray,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      const relatedKeywordsData = response.data.tasks[0].result[0]?.items.map(item => ({
        keyword: item.keyword_data.keyword,
        searchVolume: item.keyword_data.keyword_info.search_volume,
        competition: item.keyword_data.keyword_info.competition_level,
        searchIntent: item.keyword_data.search_intent_info.main_intent,
        backlinks: item.keyword_data.avg_backlinks_info.backlinks,
        monthlySearches: item.keyword_data.keyword_info.monthly_searches // Add this line
      }));
      if (relatedKeywordsData.length > 0) {
        setRelatedKeywords(relatedKeywordsData);
        const totalVolume = relatedKeywordsData.reduce((acc, cur) => acc + cur.searchVolume, 0);
        setTotalSearchVolume(totalVolume);
      } else {
        setError('No related keywords found');
      }
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching related keywords:", error);
      setError('Error fetching related keywords');
      setLoading(false);
    });
  };

  // State for the filtered monthly searches
  const [filteredMonthlySearches, setFilteredMonthlySearches] = useState([]);

  useEffect(() => {
    if (relatedKeywords.length > 0 && relatedKeywords[0].monthlySearches) {
      let monthlySearches = relatedKeywords[0].monthlySearches;

      setFilteredMonthlySearches(monthlySearches);
    }
  }, [relatedKeywords]);

  useEffect(() => {
    let monthlySearches = [...filteredMonthlySearches];

    if (startDate || endDate) {
      monthlySearches = monthlySearches.filter(ms => {
        const date = new Date(ms.year, ms.month - 1);
        return (!startDate || date >= new Date(startDate)) && (!endDate || date <= new Date(endDate));
      });
    }

    // Reverse the data if it's in descending order
    if (monthlySearches.length > 0 && (monthlySearches[0].year > monthlySearches[monthlySearches.length - 1].year ||
      (monthlySearches[0].year === monthlySearches[monthlySearches.length - 1].year &&
        monthlySearches[0].month > monthlySearches[monthlySearches.length - 1].month))) {
      monthlySearches = monthlySearches.reverse();
    }

    const chartLabels = monthlySearches.map(ms => `${ms.year}-${ms.month.toString().padStart(2, '0')}`);
    const chartData = monthlySearches.map(ms => ms.search_volume);

    setMonthlySearchData({
      labels: chartLabels,
      datasets: [{
        label: 'Monthly Search Volume',
        data: chartData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }],
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month'
            }
          }
        }
      }
    });
  }, [filteredMonthlySearches, startDate, endDate]);

  return (
    <Container maxWidth="lg">
      {isLoggedIn ? (
        <>
          <Typography variant="h4" component="h1" gutterBottom align="center" marginTop={4}>
            Related Keywords Finder
          </Typography>
          <KeywordForm onKeywordsSubmit={handleKeywordsSubmit} />
          {loading ? (
            <Box display="flex" justifyContent="center" marginTop="20px">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">
              {error}
            </Typography>
          ) : (
            <>
              <Typography variant="h6" gutterBottom marginTop={4}>
                Related keywords for: <span style={{ color: '#1976d2' }}>{keyword}</span> (Total Search Volume: {totalSearchVolume})
              </Typography>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              {monthlySearchData.labels && (
                <div>
                  <Typography variant="h6" gutterBottom>
                    Monthly Search Trends
                  </Typography>

                  <Line data={monthlySearchData} />

                </div>
              )}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Keyword</TableCell>
                      <TableCell>Search Volume</TableCell>
                      <TableCell>Competition</TableCell>
                      <TableCell>Search Intent</TableCell>
                      <TableCell>Backlinks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {relatedKeywords.map(keyword => (
                      <TableRow key={keyword.keyword}>
                        <TableCell>{keyword.keyword}</TableCell>
                        <TableCell>{keyword.searchVolume}</TableCell>
                        <TableCell>{keyword.competition}</TableCell>
                        <TableCell>{keyword.searchIntent}</TableCell>
                        <TableCell>{keyword.backlinks}</TableCell>
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

export default RelatedKeywordFinder;
