import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock data (static fallback)
const STATIC_TRENDS = [
  { id: "1", title: "Autonomous Coding Agents", industry: "AI", description: "AI agents capable of planning, coding, debugging, and deploying entire applications." },
  { id: "2", title: "Micro-SaaS Aggregators", industry: "SaaS", description: "Platforms that acquire, bundle, and optimize small, profitable SaaS tools." },
  { id: "3", title: "Personalized Longevity Protocols", industry: "BioTech", description: "Data-driven health platforms combining DNA analysis and wearable data." },
];

async function searchWeb(query, apiKey) {
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: `emerging market trends startup opportunities ${query}`,
        search_depth: "basic",
        include_answer: true,
        max_results: 3
      })
    });
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Tavily Search Error:', error);
    return [];
  }
}

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
    // 1. Search Web (if Tavily Key is present)
    let webContext = "";
    if (process.env.TAVILY_API_KEY) {
      const searchResults = await searchWeb(lastMessage, process.env.TAVILY_API_KEY);
      if (searchResults.length > 0) {
        webContext = `
        FRESH MARKET DATA (Real-time Web Search):
        ${searchResults.map(r => `- ${r.title}: ${r.content}`).join('\n')}
        `;
      }
    }

    // 2. Call Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // User requested specific preview model
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }); 

    const prompt = `
      You are an expert Market Trend Scout. Your goal is to help founders find their next big idea.
      
      CONTEXT:
      1. Internal Database: ${JSON.stringify(STATIC_TRENDS)}
      2. Web Search Results: ${webContext || "No live data available."}

      User Query: "${lastMessage}"

      Instructions:
      1. Analyze the user's query against both internal data and fresh web data.
      2. If the web search reveals NEW trends not in our DB, prioritize them.
      3. Explain WHY these match the user's criteria.
      4. Keep your tone: Direct, pragmatic, "Paul Graham" style. No corporate fluff.
      5. Return your response in JSON format: { "text": "Your explanation...", "recommendedTrendIds": [] } 
      (Note: If you recommend a web trend, leave recommendedTrendIds empty as it's not in our DB yet).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(text);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ 
      text: "I hit a snag analyzing the market data. Please try again.",
      recommendedTrendIds: [] 
    });
  }
}
