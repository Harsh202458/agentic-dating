import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { personA, personB } = body;

    if (!personA || !personB) {
      return NextResponse.json(
        { error: 'Both candidate profiles are required to simulate encounter.' },
        { status: 400 }
      );
    }

    if (String(personA.id) === String(personB.id)) {
      return NextResponse.json(
        { error: 'Cannot simulate a date with the same person.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on server. Please set GEMINI_API_KEY.', retryable: true },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

    const prompt = `
You are simulating a 6-stage autonomous dating conversation between two AI agents representing real people.
Each agent speaks STRICTLY on behalf of their person based only on their real personality, background, values, interests, and lifestyle.

AGENT A represents: ${personA.name}
- Gender: ${personA.gender || 'Not specified'}
- Headline: ${personA.headline || 'Independent Operator'}
- Summary: ${personA.summary || ''}
- Interests: ${(personA.interests || []).join(', ')}
- Values: ${(personA.values || []).join(', ')}
- Lifestyle: ${personA.lifestyle || (personA.hobbies || []).join(', ')}
- Needs: ${(personA.needs || []).join(', ')}
- Dealbreakers: ${(personA.dealbreakers || []).join(', ')}
- Agent Voice: ${personA.agentVoice || `I represent ${personA.name}.`}

AGENT B represents: ${personB.name}
- Gender: ${personB.gender || 'Not specified'}
- Headline: ${personB.headline || 'Independent Operator'}
- Summary: ${personB.summary || ''}
- Interests: ${(personB.interests || []).join(', ')}
- Values: ${(personB.values || []).join(', ')}
- Lifestyle: ${personB.lifestyle || (personB.hobbies || []).join(', ')}
- Needs: ${(personB.needs || []).join(', ')}
- Dealbreakers: ${(personB.dealbreakers || []).join(', ')}
- Agent Voice: ${personB.agentVoice || `I represent ${personB.name}.`}

RULES:
1. Simulate exactly 6 conversational exchanges (turns), exactly 1 exchange per stage:
   - Turn 0 (Stage 01: INTRO): Speaker A introduces their person's essence, craft, and rhythm.
   - Turn 1 (Stage 02: INTERESTS): Speaker B responds, highlighting common ground or intriguing contrast in creative craft or intellectual drive.
   - Turn 2 (Stage 03: VALUES): Speaker A addresses fundamental life axioms, sovereign boundaries, and autonomy.
   - Turn 3 (Stage 04: LIFESTYLE): Speaker B tests daily schedule compatibility, rituals, and focus cadences.
   - Turn 4 (Stage 05: FUTURE & DEALBREAKERS): Speaker A tests non-negotiable dealbreakers and conflict resolution styles.
   - Turn 5 (Stage 06: DECISION & VERDICT): Speaker B synthesizes mutual compatibility and delivers their honest verdict.
2. For each turn, include an agent thought ("thought") explaining the strategic internal reasoning before speaking.
3. Compute an honest, nuanced compatibility score (0-100) based on shared values (20%), lifestyle rhythm (20%), intellectual resonance (20%), and emotional needs (20%).
4. Return ONLY a single raw JSON object with NO markdown formatting, NO backticks, NO explanation.

SCHEMA:
{
  "compatibilityScore": 84,
  "matchReason": "2 sentences explaining the synthesis and dynamic between both individuals.",
  "breakdown": {
    "values": { "score": 82, "label": "Strong alignment on autonomy" },
    "interests": { "score": 80, "label": "Shared creative focus" },
    "lifestyle": { "score": 85, "label": "Balanced daily cadences" },
    "needs": { "score": 78, "label": "Mutually supportive" }
  },
  "sparks": [
    "Resonance on independent ambition and sovereign boundaries",
    "Mutual appreciation for deep craft over superficial small talk",
    "Shared demand for radical candor and emotional transparency"
  ],
  "tensions": [
    "Demanding professional calendars require deliberate scheduling",
    "Both operate with intense solo focus habits"
  ],
  "conversation": [
    { "agent": "A", "name": "${personA.name}", "thought": "...", "message": "..." },
    { "agent": "B", "name": "${personB.name}", "thought": "...", "message": "..." },
    { "agent": "A", "name": "${personA.name}", "thought": "...", "message": "..." },
    { "agent": "B", "name": "${personB.name}", "thought": "...", "message": "..." },
    { "agent": "A", "name": "${personA.name}", "thought": "...", "message": "..." },
    { "agent": "B", "name": "${personB.name}", "thought": "...", "message": "..." }
  ]
}
`;

    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.1-pro-preview',
      'gemini-3.8-flash'
    ];

    let rawResponse = '';
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout with model ${modelName}`)), 12000)
        );
        const generatePromise = model.generateContent(prompt).then(res => res.response.text());
        rawResponse = (await Promise.race([generatePromise, timeoutPromise])) as string;
        if (rawResponse) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} encountered: ${err?.message}, trying next candidate...`);
      }
    }

    if (!rawResponse) {
      throw lastError || new Error('All candidate LLM models failed to generate date conversation.');
    }

    const cleanText = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('LLM response did not contain valid JSON.');
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      data: parsedData
    });
  } catch (err: any) {
    console.error('Date simulation API error:', err);
    return NextResponse.json(
      {
        error: err?.message || 'Date simulation encountered an error. Please retry.',
        retryable: true
      },
      { status: 500 }
    );
  }
}
