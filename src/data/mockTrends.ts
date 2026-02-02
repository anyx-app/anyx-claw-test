export interface Trend {
  id: string;
  title: string;
  description: string;
  industry: "AI" | "SaaS" | "BioTech" | "FinTech" | "Energy" | "Consumer";
  tam_valuation: number; // In Billions usually, but stored as raw number
  growth_cagr: number; // Percentage
  signal_strength: number; // 0-100
}

export const MOCK_TRENDS: Trend[] = [
  {
    id: "1",
    title: "Autonomous Coding Agents",
    description: "AI agents capable of planning, coding, debugging, and deploying entire applications with minimal human oversight.",
    industry: "AI",
    tam_valuation: 45000000000,
    growth_cagr: 35.5,
    signal_strength: 92,
  },
  {
    id: "2",
    title: "Micro-SaaS Aggregators",
    description: "Platforms that acquire, bundle, and optimize small, profitable SaaS tools for niche markets.",
    industry: "SaaS",
    tam_valuation: 12000000000,
    growth_cagr: 18.2,
    signal_strength: 78,
  },
  {
    id: "3",
    title: "Personalized Longevity Protocols",
    description: "Data-driven health platforms combining DNA analysis, bloodwork, and wearable data to optimize lifespan.",
    industry: "BioTech",
    tam_valuation: 65000000000,
    growth_cagr: 22.0,
    signal_strength: 85,
  },
  {
    id: "4",
    title: "Decentralized Energy Grids",
    description: "Peer-to-peer energy trading platforms allowing households with solar to sell excess power to neighbors.",
    industry: "Energy",
    tam_valuation: 150000000000,
    growth_cagr: 14.5,
    signal_strength: 65,
  },
  {
    id: "5",
    title: "Vertical AI for Legal",
    description: "Specialized LLMs trained specifically on case law and contracts to automate paralegal work.",
    industry: "AI",
    tam_valuation: 28000000000,
    growth_cagr: 42.0,
    signal_strength: 88,
  },
  {
    id: "6",
    title: "Embedded Finance for Gig Platforms",
    description: "Banking and lending infrastructure built directly into gig worker apps (Uber, Upwork, etc.).",
    industry: "FinTech",
    tam_valuation: 85000000000,
    growth_cagr: 26.5,
    signal_strength: 72,
  },
  {
    id: "7",
    title: "Synthetic Data for Training",
    description: "Generating high-quality, privacy-compliant artificial data sets to train AI models where real data is scarce.",
    industry: "AI",
    tam_valuation: 18000000000,
    growth_cagr: 38.0,
    signal_strength: 90,
  },
  {
    id: "8",
    title: "Niche Community CRMs",
    description: "Relationship management tools designed for specific creator communities and paid mastermind groups.",
    industry: "SaaS",
    tam_valuation: 5000000000,
    growth_cagr: 15.0,
    signal_strength: 60,
  },
  {
    id: "9",
    title: "Sustainable Packaging Materials",
    description: "Mushroom-based and seaweed-based alternatives to single-use plastics in e-commerce.",
    industry: "Consumer",
    tam_valuation: 90000000000,
    growth_cagr: 12.5,
    signal_strength: 70,
  },
  {
    id: "10",
    title: "Mental Health Biomarkers",
    description: "Using vocal patterns and typing speed to detect early signs of depression and anxiety via smartphones.",
    industry: "BioTech",
    tam_valuation: 32000000000,
    growth_cagr: 28.0,
    signal_strength: 81,
  },
];
