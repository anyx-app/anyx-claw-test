import React, { useState, useMemo } from 'react';
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
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Market Trend Scout 🦞</h1>
          <p className="text-gray-600">Discover high-signal opportunities before they go mainstream.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-wrap gap-6 items-center border border-gray-200">
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Industry</label>
            <select 
              className="border rounded p-2 text-sm bg-gray-50"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Min Growth (CAGR)</label>
            <div className="flex items-center gap-2">
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={minGrowth} 
                onChange={(e) => setMinGrowth(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm font-mono w-12">{minGrowth}%</span>
            </div>
          </div>

          <div className="ml-auto text-sm text-gray-400">
            Showing <strong>{filteredTrends.length}</strong> results
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrends.map(trend => (
            <TrendCard key={trend.id} trend={trend} />
          ))}
        </div>

        {filteredTrends.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No trends match your criteria. Try lowering your standards.
          </div>
        )}

      </div>
    </div>
  );
}
