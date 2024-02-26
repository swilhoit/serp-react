import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './app'; // Assuming this is your main or home component
import RelatedKeywordFinder from './related-keywords'; // Your related keywords component
import HistoricalSERP from './historical-serp'; // Your related keywords component
import BasicSERP from './serp'; // Your related keywords component
import './index.css';
import Navigation from './nav'; 
import { AuthProvider } from './AuthContext';

ReactDOM.render(
  <AuthProvider>
  <Router>
      <Navigation />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/serp" element={<BasicSERP />} />
      <Route path="/related-keywords" element={<RelatedKeywordFinder />} />
      <Route path="/historical-serp" element={<HistoricalSERP />} />
      {/* Add more routes as needed */}
    </Routes>
  </Router>
  </AuthProvider>,
  document.getElementById('root')
);
