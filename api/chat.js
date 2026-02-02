import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock data (duplicated here for serverless simplicity until DB is connected)
const AVAILABLE_TRENDS = [
  { id: "1", title: "Autonomous Coding Agents", industry: "AI", description: "AI agents capable of planning, coding, debugging, and deploying entire applications." },
  { id: "2", title: "Micro-SaaS Aggregators", industry: "SaaS", description: "Platforms that acquire, bundle, and optimize small, profitable SaaS tools." },
  { id: "3", title: "Personalized Longevity Protocols", industry: "BioTech", description: "Data-driven health platforms combining DNA analysis and wearable data." },
  { id: "4", title: "Decentralized Energy Grids", industry: "Energy", description: "Peer-to-peer energy trading platforms." },
  { id: "5", title: "Vertical AI for Legal", industry: "AI", description: "Specialized LLMs trained specifically on case law and contracts." },
  { id: "6", title: "Embedded Finance for Gig Platforms", industry: "FinTech", description: "Banking infrastructure built directly into gig worker apps." },
  { id: "7", title: "Synthetic Data for Training", industry: "AI", description: "Generating high-quality artificial data sets to train AI models." },
  { id: "8", title: "Niche Community CRMs", industry: "SaaS", description: "Relationship management tools designed for specific creator communities." },
  { id: "9", title: "Sustainable Packaging Materials", industry: "Consumer", description: "Mushroom-based and seaweed-based alternatives to plastics." },
  { id: "10", title: "Mental Health Biomarkers", industry: "BioTech", description: "Using vocal patterns and typing speed to detect early signs of anxiety." },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
  const lastMessage = messages[messages.length - 1]?.content || '';

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not set' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert Market Trend Scout. Your goal is to help founders find their next big idea.
      
      Here is the list of available market trends we are tracking:
      ${JSON.stringify(AVAILABLE_TRENDS)}

      User Query: "${lastMessage}"

      Instructions:
      1. Analyze the user's query.
      2. Recommend 1-3 specific trends from the list above that match their interest.
      3. Explain WHY these match.
      4. If nothing matches perfectly, suggest the closest options or ask clarifying questions.
      5. Keep your tone: Direct, pragmatic, "Paul Graham" style. No corporate fluff.
      6. Return your response in JSON format: { "text": "Your explanation...", "recommendedTrendIds": ["1", "5"] }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Cleanup code blocks if Gemini adds them
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(text);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ 
      text: "I'm having trouble connecting to my trend database right now. Please try again.",
      recommendedTrendIds: [] 
    });
  }
}
