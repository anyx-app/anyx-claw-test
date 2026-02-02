import { useState, useMemo } from 'react';
import { MOCK_TRENDS } from './data/mockTrends';
import { TrendCard } from './components/TrendCard';

export default function App() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [minGrowth, setMinGrowth] = useState<number>(0);

  const industries = ['All', ...Array.from(new Set(MOCK_TRENDS.map(t => t.industry)))];

  const filteredTrends = useMemo(() => {
    return MOCK_TRENDS.filter(trend => {
      const industryMatch = selectedIndustry === 'All' || trend.industry === selectedIndustry;
      const growthMatch = trend.growth_cagr >= minGrowth;
      return industryMatch && growthMatch;
    });
  }, [selectedIndustry, minGrowth]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦞</span>
            <span className="font-bold text-slate-900 text-lg tracking-tight">Anyx<span className="text-indigo-600">Claw</span> Scout</span>
          </div>
          <div className="text-xs font-mono text-slate-400">v0.1.0 • Alpha</div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="mb-12 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Spot the next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">unicorn trend.</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Curated market signals, valuation projections, and growth vectors. 
            Don't build in the dark.
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-10 sticky top-20 z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Filter Group */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Industry</label>
                <div className="relative">
                  <select 
                    className="appearance-none pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow hover:bg-slate-100 cursor-pointer min-w-[160px]"
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                  >
                    {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Min Growth (CAGR)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    value={minGrowth} 
                    onChange={(e) => setMinGrowth(Number(e.target.value))}
                    className="w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md font-mono text-sm font-bold min-w-[60px] text-center">
                    {minGrowth}%
                  </div>
                </div>
              </div>

            </div>

            {/* Results Counter */}
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {filteredTrends.length} opportunities found
            </div>

          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrends.map(trend => (
            <TrendCard key={trend.id} trend={trend} />
          ))}
        </div>

        {/* Empty State */}
        {filteredTrends.length === 0 && (
          <div className="text-center py-32 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50">
            <div className="text-6xl mb-4">🌪️</div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No trends found</h3>
            <p className="text-slate-500">Try adjusting your filters to see more results.</p>
            <button 
              onClick={() => { setMinGrowth(0); setSelectedIndustry('All'); }}
              className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
