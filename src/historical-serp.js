import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HistoricalSERPs = () => {
  const [historicalSERPs, setHistoricalSERPs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allResults = [];
        let nextPageUrl = 'https://api.dataforseo.com/v3/dataforseo_labs/google/historical_serps/live';
        while (nextPageUrl) {
          const response = await axios.get(nextPageUrl, {
            auth: {
              username: process.env.REACT_APP_API_USERNAME,
              password: process.env.REACT_APP_API_PASSWORD
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const result = response.data.tasks;
          allResults.push(...result);
          nextPageUrl = response.data.pagination.next;
        }
        setHistoricalSERPs(allResults);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Historical SERPs</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {historicalSERPs.map((task, index) => (
            <li key={index}>
              <p>Task ID: {task.id}</p>
              <p>Status: {task.status_message}</p>
              <p>Keyword: {decodeURIComponent(task.data.keyword)}</p>
              <p>Location Code: {task.data.location_code}</p>
              {/* Add more details as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoricalSERPs;
