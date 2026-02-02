import { Trend } from '../data/mockTrends';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TrendingUp, DollarSign } from 'lucide-react';

interface TrendCardProps {
  trend: Trend;
}

export const TrendCard: React.FC<TrendCardProps> = ({ trend }) => {
  const formatMoney = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${val}`;
  };

  const signalVariant = 
    trend.signal_strength > 85 ? 'default' : 
    trend.signal_strength > 70 ? 'secondary' : 
    'outline';

  return (
    <Card className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm relative">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className={cn(
        "h-1 w-full relative z-10", 
        trend.signal_strength > 80 ? "bg-gradient-to-r from-primary to-accent" : "bg-muted"
      )} />
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {trend.industry}
          </Badge>
          <Badge variant={signalVariant} className="font-bold">
            {trend.signal_strength} Signal
          </Badge>
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {trend.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {trend.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> TAM
            </span>
            <span className="font-mono font-medium text-foreground">{formatMoney(trend.tam_valuation)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Growth
            </span>
            <span className="font-mono font-medium text-emerald-600">+{trend.growth_cagr}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
