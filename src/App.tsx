import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AnalyzerPage from './pages/AnalyzerPage';
import ResultsPage from './pages/ResultsPage';
import BuilderPage from './pages/BuilderPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyzer" element={<AnalyzerPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/builder" element={<BuilderPage />} />
      </Routes>
    </Layout>
  );
}

export default App;