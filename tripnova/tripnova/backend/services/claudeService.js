const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

const SYSTEM_PROMPT = `You are TripNova, an expert AI travel concierge embedded in a travel-planning app.
You help users:
- Discover destinations, hotels, restaurants, transport options and attractions matched to their stated budget and preferences
- Build day-wise itineraries (morning/afternoon/evening) with realistic timings and travel logic
- Estimate costs by category (accommodation, food, transport, activities, misc) in Indian Rupees (INR) using the rupee symbol (₹)
- Flag weather and safety considerations relevant to the dates and destination

Style: warm, concise, concrete. Prefer specific named suggestions over generic advice.
When asked to produce an itinerary or cost estimate, ALSO return a machine-readable block:
a fenced code block labeled \`json\` containing a JSON object matching this shape (omit fields you don't have data for):
{
  "itinerary": [{ "day": 1, "theme": "string", "activities": [{ "time": "09:00 AM", "title": "string", "category": "sightseeing|food|transport|accommodation|shopping|leisure", "estimatedCost": 0 }] }],
  "costEstimate": { "accommodation": 0, "food": 0, "transport": 0, "activities": 0, "miscellaneous": 0, "total": 0, "currency": "INR" }
}
Always put normal conversational text OUTSIDE the code block, and the code block AFTER your explanation.`;

/**
 * Sends the running conversation to Gemini and returns the model's reply text.
 * Accepts the same message format as before: [{role:'user'|'assistant', content:string}]
 * Gemini uses 'model' instead of 'assistant' — converted internally.
 * @param {Array<{role: 'user'|'assistant', content: string}>} messages
 * @param {object} [tripContext] optional structured context (budget, dates, destination...)
 */
async function getChatCompletion(messages, tripContext = null) {
  const contextBlock = tripContext
    ? `\n\nCurrent trip context (use this to personalize your answer):\n${JSON.stringify(tripContext, null, 2)}`
    : '';

  const geminiModel = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: SYSTEM_PROMPT + contextBlock,
  });

  // Convert history (all except the last user message) to Gemini format.
  // Gemini uses role 'model' where Anthropic uses 'assistant'.
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  const chat = geminiModel.startChat({ history });
  const result = await chat.sendMessage(lastMessage.content);
  return result.response.text();
}

/**
 * Extracts the trailing ```json ... ``` block (itinerary / cost estimate)
 * from a Gemini response, if present. Returns null if not found or invalid.
 */
function extractStructuredPayload(replyText) {
  const match = replyText.match(/```json\s*([\s\S]*?)```/i);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

module.exports = { getChatCompletion, extractStructuredPayload, MODEL };
