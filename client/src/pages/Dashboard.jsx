import { useEffect, useState } from "react";
import { getPredictions } from "../api";
import MatchCard from "../components/MatchCard";

export default function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const res = await getPredictions();
      setMatches(res.data);
    } catch (err) {
      console.error("API error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    // 🔥 LIVE AUTO REFRESH (30 seconds)
    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <h1 className="text-3xl font-bold mb-4">
        ⚽ Live Predictions
      </h1>

      {loading && <p>Loading live matches...</p>}

      <div className="grid gap-3">
        {matches.map((match, i) => (
          <MatchCard key={i} match={match} />
        ))}
      </div>

    </div>
  );
}
