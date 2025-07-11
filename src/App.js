import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRrJ-VBXrVcZFj9S5DDCnlYWLRs1E-HmxJvRLLUDtGjUwgPkJjRdrgVkq0HF5A0MNKlqNYUQ4d9u1mz/pub?gid=0&single=true&output=csv";

function App() {
  return (
    <Router>
      <nav className="p-4 bg-black text-white flex justify-between">
        <Link to="/">Accueil</Link>
        <Link to="/classement">Classement</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classement" element={<Classement />} />
      </Routes>
    </Router>
  );
}

function Home() {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.text())
      .then((csv) => {
        const rows = csv.split("\n").slice(1); // ignore headers
        const parsed = rows
          .map((row) => row.split(","))
          .filter((row) => row.length > 3);
        setData(parsed);
      });
  }, []);

  const handleVote = () => {
    setIndex((prev) => (prev + 1 < data.length ? prev + 1 : 0));
  };

  if (!data.length) return <div className="text-center p-8">Chargement...</div>;

  const [, user, message, url] = data[index];

  return (
    <div className="p-4 text-center">
      <div className="mb-2 text-sm text-gray-500">Ajouté par {user}</div>

      {/* Aperçu par iframe */}
      <div className="w-full max-w-xl mx-auto mb-4 aspect-video">
        <iframe
          src={url}
          title="preview"
          className="w-full h-full border rounded shadow"
          sandbox=""
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-blue-600 underline break-words"
      >
        {url}
      </a>

      <div className="mt-4 space-x-4">
        <button
          onClick={handleVote}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          👍 J'aime
        </button>
        <button
          onClick={handleVote}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          👎 Pas fan
        </button>
      </div>
    </div>
  );
}

function Classement() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.text())
      .then((csv) => {
        const rows = csv.split("\n").slice(1);
        const parsed = rows.map((r) => r.split(","));
        const counts = {};
        parsed.forEach((row) => {
          const user = row[1];
          if (user) {
            counts[user] = (counts[user] || 0) + 1;
          }
        });
        setStats(counts);
      });
  }, []);

  const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Classement des contributeurs 🏆</h2>
      <ul>
        {sorted.map(([user, count], i) => (
          <li key={i} className="mb-1">
            {i + 1}. {user} — {count} références
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
