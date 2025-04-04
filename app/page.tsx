'use client';

import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question) return;
    setLoading(true);
    setAnswer('');
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      setAnswer('Error fetching answer.');
    }
    setLoading(false);
  };

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">🤖 Vendor AI Assistant</h1>
      <textarea
        className="w-full p-2 border border-gray-300 rounded"
        rows={4}
        placeholder="Ask about a vendor..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={askQuestion}
        disabled={loading}
      >
        {loading ? 'Asking...' : 'Ask'}
      </button>
      {answer && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </main>
  );
}
