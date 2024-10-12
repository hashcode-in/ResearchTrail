import React, { useState, useEffect } from 'react';
import { Play, Square, FileText } from 'lucide-react';

function App() {
  const [isTracking, setIsTracking] = useState(false);
  const [visitedSites, setVisitedSites] = useState<string[]>([]);

  useEffect(() => {
    chrome.storage.local.get(['isTracking', 'visitedSites'], (result) => {
      setIsTracking(result.isTracking || false);
      setVisitedSites(result.visitedSites || []);
    });
  }, []);

  const toggleTracking = () => {
    const newTrackingState = !isTracking;
    setIsTracking(newTrackingState);
    chrome.storage.local.set({ isTracking: newTrackingState });
    chrome.runtime.sendMessage({ action: newTrackingState ? 'startTracking' : 'stopTracking' });
  };

  const generateReport = () => {
    chrome.runtime.sendMessage({ action: 'generateReport' });
  };

  return (
    <div className="w-80 p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Research Path Tracker</h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={toggleTracking}
          className={`flex items-center px-4 py-2 rounded ${
            isTracking ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          {isTracking ? <Square className="mr-2" /> : <Play className="mr-2" />}
          {isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </button>
        <button
          onClick={generateReport}
          className="flex items-center px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
          disabled={!visitedSites.length}
        >
          <FileText className="mr-2" />
          Generate Report
        </button>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Visited Sites:</h2>
        <ul className="list-disc pl-5">
          {visitedSites.map((site, index) => (
            <li key={index} className="text-sm truncate">{site}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;