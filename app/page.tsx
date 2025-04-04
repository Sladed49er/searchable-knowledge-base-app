import { useState, useEffect } from 'react';

// Example of a simple React component fetching data
export default function HomePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Fetch data from an API or local resource
    fetch('/api/someEndpoint')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => {
        // You can handle errors here if needed
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <h1>Welcome to the Searchable Knowledge Base!</h1>
      {data ? (
        <div>
          <h2>Data Loaded Successfully</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}
