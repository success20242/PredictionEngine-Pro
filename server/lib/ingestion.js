const axios = require("axios");

/**
 * ===============================
 * 1. CALL GEMINI (SAFE)
 * ===============================
 */
async function callGemini(prompt) {
  try {
    const res = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }]
      },
      {
        params: { key: process.env.GEMINI_KEY },
        timeout: 15000
      }
    );

    return (
      res?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ""
    );
  } catch (error) {
    console.error("Gemini API error:", error.message);
    return "";
  }
}

/**
 * ===============================
 * 2. SAFE JSON EXTRACTION
 * ===============================
 */
function extractJSONSafe(text) {
  try {
    if (!text || typeof text !== "string") return [];

    // remove markdown blocks
    text = text.replace(/```json|```/g, "").trim();

    // try direct parse first
    try {
      return JSON.parse(text);
    } catch {}

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start === -1 || end === -1) return [];

    const sliced = text.slice(start, end + 1);

    return JSON.parse(sliced);

  } catch (e) {
    console.warn("JSON parse failed:", e.message);
    return [];
  }
}

/**
 * ===============================
 * 3. NORMALIZE MATCH
 * ===============================
 */
function normalizeMatch(match) {
  if (!match) return null;

  return {
    homeTeam: match.homeTeam?.trim(),
    awayTeam: match.awayTeam?.trim(),
    league: match.league || "Unknown",
    date: match.date || null
  };
}

/**
 * ===============================
 * 4. VALIDATION
 * ===============================
 */
function validateMatch(match) {
  if (!match) return false;
  if (!match.homeTeam || !match.awayTeam) return false;
  if (match.homeTeam === match.awayTeam) return false;
  if (match.homeTeam.length < 2 || match.awayTeam.length < 2) return false;
  return true;
}

/**
 * ===============================
 * 5. CONSENSUS ENGINE (FIXED)
 * ===============================
 */
function consensusMatches(datasets) {
  const map = {};

  datasets
    .filter(Array.isArray)
    .flat()
    .forEach(raw => {
      const match = normalizeMatch(raw);
      if (!validateMatch(match)) return;

      const key = `${match.homeTeam}_${match.awayTeam}`;

      if (!map[key]) {
        map[key] = { count: 0, data: match };
      }

      map[key].count++;
      map[key].data = match;
    });

  return Object.values(map);
}

/**
 * ===============================
 * 6. CONFIDENCE SCORING
 * ===============================
 */
function scoreConfidence(match, count) {
  let score = 0;

  if (match.homeTeam) score += 0.3;
  if (match.awayTeam) score += 0.3;
  if (match.league && match.league !== "Unknown") score += 0.2;
  if (count >= 2) score += 0.2;

  return score;
}

/**
 * ===============================
 * 7. CLEAN + FILTER PIPELINE
 * ===============================
 */
function cleanMatches(consensusData) {
  return consensusData
    .map(entry => {
      const match = entry.data;
      const count = entry.count;

      if (!validateMatch(match)) return null;

      const confidence = scoreConfidence(match, count);

      return {
        ...match,
        confidence,
        sources: count,
        reliability:
          confidence > 0.75
            ? "HIGH"
            : confidence > 0.5
            ? "MEDIUM"
            : "LOW"
      };
    })
    .filter(Boolean)
    .filter(m => m.confidence >= 0.35); // FIXED THRESHOLD
}

/**
 * ===============================
 * 8. FETCH RELIABLE MATCHES
 * ===============================
 */
async function fetchReliableMatches() {
  const prompts = [
    `Return ONLY valid JSON array.
     Format: [{ "homeTeam": "", "awayTeam": "", "league": "", "date": "" }]
     No explanation.`,

    `List today's football fixtures ONLY as JSON array.`,

    `Return football matches in strict JSON format only.`
  ];

  for (let attempt = 1; attempt <= 3; attempt++) {
    console.log(`Fetching matches (attempt ${attempt})...`);

    const responses = await Promise.all(
      prompts.map(p => callGemini(p))
    );

    const datasets = responses.map(extractJSONSafe);

    const consensusData = consensusMatches(datasets);

    const cleaned = cleanMatches(consensusData);

    // DEBUG (important during development)
    console.log("RAW DATASETS:", JSON.stringify(datasets, null, 2));
    console.log("CONSENSUS:", consensusData);
    console.log("CLEANED:", cleaned);

    if (cleaned.length > 0) {
      console.log("✅ Reliable matches fetched:", cleaned.length);
      return cleaned;
    }

    console.warn("⚠️ Low-quality data, retrying...");
  }

  console.error("❌ Failed to fetch reliable matches");
  return [];
}

/**
 * ===============================
 * EXPORT
 * ===============================
 */
module.exports = { fetchReliableMatches };
