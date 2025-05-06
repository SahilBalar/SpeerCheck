// src/App.jsx
import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import { getEngineers, getCandidates } from './services/api';
import './App.css';

function App() {
  const [engineers, setEngineers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [engineersData, candidatesData] = await Promise.all([
          getEngineers(),
          getCandidates()
        ]);
        setEngineers(engineersData);
        setCandidates(candidatesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <Calendar 
            candidates={candidates}
            engineers={engineers}
            selectedCandidate={selectedCandidate}
            onCandidateSelect={setSelectedCandidate}
          />
        </div>
      </div>
    </div>
  );
}

export default App;