export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      
      <h1 className="text-3xl font-bold mb-6">
        ⚽ Prediction Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4">
        
        <div className="bg-slate-900 p-4 rounded-xl">
          <h2>Accuracy</h2>
          <p className="text-green-400 text-xl">72%</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl">
          <h2>ROI</h2>
          <p className="text-blue-400 text-xl">+18%</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl">
          <h2>Active Matches</h2>
          <p className="text-yellow-400 text-xl">24</p>
        </div>

      </div>
    </div>
  );
}
