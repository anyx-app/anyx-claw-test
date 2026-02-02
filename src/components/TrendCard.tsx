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
    trend.signal_strength > 85 ? 'bg-green-100 text-green-800' : 
    trend.signal_strength > 70 ? 'bg-yellow-100 text-yellow-800' : 
    'bg-gray-100 text-gray-800';

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {trend.industry}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${signalColor}`}>
          {trend.signal_strength} Signal
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{trend.title}</h3>
      <p className="text-gray-600 mb-4 text-sm line-clamp-3">{trend.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-400">TAM</p>
          <p className="font-mono font-medium">{formatMoney(trend.tam_valuation)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Growth (CAGR)</p>
          <p className="font-mono font-medium text-green-600">+{trend.growth_cagr}%</p>
        </div>
      </div>
    </div>
  );
};
