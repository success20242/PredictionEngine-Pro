export default function MatchCard({ match }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl">

      <div className="flex justify-between text-lg">
        <span>{match.homeTeam}</span>
        <span className="text-gray-400">vs</span>
        <span>{match.awayTeam}</span>
      </div>

      <div className="mt-2 text-sm text-gray-400">
        League: {match.league}
      </div>

      <div className="mt-2">
        <p>🔥 Home: {(match.prediction.home * 100).toFixed(1)}%</p>
        <p>⚖️ Draw: {(match.prediction.draw * 100).toFixed(1)}%</p>
        <p>⚽ Away: {(match.prediction.away * 100).toFixed(1)}%</p>
      </div>

      <div className="mt-2">
        <span className={`text-sm px-2 py-1 rounded ${
          match.confidence === "HIGH"
            ? "bg-green-600"
            : match.confidence === "MEDIUM"
            ? "bg-yellow-600"
            : "bg-red-600"
        }`}>
          {match.confidence} CONFIDENCE
        </span>
      </div>

      <div className="mt-2 text-green-400">
        Value: {match.value?.home || "N/A"}
      </div>

    </div>
  );
}
