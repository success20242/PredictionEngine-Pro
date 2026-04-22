export default function MatchCard({ match }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl mb-3">
      
      <div className="flex justify-between">
        <span>{match.homeTeam}</span>
        <span className="text-gray-400">vs</span>
        <span>{match.awayTeam}</span>
      </div>

      <div className="mt-2 text-sm text-gray-400">
        Confidence: {match.confidence}
      </div>

      <div className="mt-2 text-green-400">
        Value: {match.value?.home}
      </div>

    </div>
  );
}
