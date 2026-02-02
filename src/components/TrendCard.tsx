import { Trend } from '../data/mockTrends';

interface TrendCardProps {
  trend: Trend;
}

export const TrendCard: React.FC<TrendCardProps> = ({ trend }) => {
  const formatMoney = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${val}`;
  };

  const signalColor = 
    trend.signal_strength > 85 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
    trend.signal_strength > 70 ? 'bg-amber-100 text-amber-800 border-amber-200' : 
    'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Top Accent Line */}
      <div className={`h-1 w-full ${trend.signal_strength > 80 ? 'bg-indigo-500' : 'bg-slate-200'}`} />
      
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 uppercase tracking-wide">
            {trend.industry}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${signalColor}`}>
            {trend.signal_strength} Signal
          </span>
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {trend.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
          {trend.description}
        </p>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 pt-5 border-t border-slate-100 mt-auto bg-slate-50/50 -mx-6 -mb-6 px-6 py-4">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Market Size</p>
            <p className="text-lg font-mono font-semibold text-slate-700">{formatMoney(trend.tam_valuation)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Growth (CAGR)</p>
            <div className="flex items-center">
              <span className="text-lg font-mono font-semibold text-emerald-600">+{trend.growth_cagr}%</span>
              <svg className="w-4 h-4 text-emerald-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
