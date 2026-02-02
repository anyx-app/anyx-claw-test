import { useState, useMemo } from 'react';
import { MOCK_TRENDS } from '../data/mockTrends';
import { TrendCard } from '../components/TrendCard';
import { HeroChat } from '../components/recipes/heroes/HeroChat';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';

export default function Home() {
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* Navbar */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦞</span>
            <span className="font-bold text-lg tracking-tight">Anyx<span className="text-primary">Claw</span> Scout</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="pb-20">
        
        {/* Hero Section with Chat */}
        <HeroChat 
          title="Spot the Next Unicorn"
          subtitle="Chat with our AI agent to brainstorm ideas, validate markets, and find high-growth trends before they go mainstream."
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          
          {/* Controls Toolbar */}
          <Card className="p-6 shadow-design-lg border-border bg-card/50 backdrop-blur-sm mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              
              <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center flex-1">
                
                {/* Industry Filter */}
                <div className="space-y-2 w-full sm:w-[200px]">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Industry</Label>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(ind => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator orientation="vertical" className="hidden sm:block h-10" />

                {/* Growth Slider */}
                <div className="space-y-4 w-full sm:w-[300px]">
                  <div className="flex justify-between">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Min Growth (CAGR)</Label>
                    <span className="font-mono text-xs font-bold text-primary">{minGrowth}%</span>
                  </div>
                  <Slider 
                    value={[minGrowth]} 
                    max={50} 
                    step={1} 
                    onValueChange={(vals) => setMinGrowth(vals[0])}
                    className="w-full"
                  />
                </div>

              </div>

              {/* Results Counter */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                  {filteredTrends.length} Opportunities
                </Badge>
              </div>

            </div>
          </Card>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrends.map(trend => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </div>

          {/* Empty State */}
          {filteredTrends.length === 0 && (
            <div className="text-center py-32 rounded-3xl border-2 border-dashed border-border bg-muted/20">
              <div className="text-6xl mb-4 grayscale opacity-50">🌪️</div>
              <h3 className="text-lg font-bold text-foreground mb-1">No trends found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
