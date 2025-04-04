'use client';  // This is required to enable React hooks like useState and useEffect

import { useState, useEffect } from 'react';

// Example of a simple React component fetching data
export default function HomePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data from an API or other source
    fetch('/api/data')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Welcome to the Knowledge Base</h1>
      <div>
        {data ? (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
}
