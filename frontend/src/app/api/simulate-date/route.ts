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
You are simulating an authentic 6-stage dating conversation between two AI agents representing real people.
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

AGENT B represents: ${personB.name}
- Gender: ${personB.gender || 'Not specified'}
- Headline: ${personB.headline || 'Independent Operator'}
- Summary: ${personB.summary || ''}
- Interests: ${(personB.interests || []).join(', ')}
- Values: ${(personB.values || []).join(', ')}
- Lifestyle: ${personB.lifestyle || (personB.hobbies || []).join(', ')}
- Needs: ${(personB.needs || []).join(', ')}
- Dealbreakers: ${(personB.dealbreakers || []).join(', ')}

CONVERSATION RULES:
1. Simulate exactly 6 conversational exchanges (turns), exactly 1 exchange per stage:
   - Turn 0 (Stage 01: INTRO): Speaker A introduces themselves and their person's world/passions, and asks an open, warm question. Speaker A DOES NOT know anything about Speaker B beforehand. NEVER claim to have "analyzed your verified profiles".
   - Turn 1 (Stage 02: INTERESTS): Speaker B introduces their person in response, shares what gives them energy outside of work, and asks about Speaker A's rhythm.
   - Turn 2 (Stage 03: VALUES): Speaker A shares what matters deeply to their person (real values from profile) and asks about trust and growth.
   - Turn 3 (Stage 04: LIFESTYLE): Speaker B discusses daily routines, how they recharge, and what they need in a supportive partner.
   - Turn 4 (Stage 05: FUTURE & DEALBREAKERS): Speaker A shares perspectives on real dealbreakers (from profile) and how they handle disagreements.
   - Turn 5 (Stage 06: DECISION & VERDICT): Speaker B reflects on the conversation, gives an honest mutual verdict, and suggests a specific first date activity.
2. ABSOLUTELY NO TEMPLATE JARGON:
   - Do NOT say "analyzed your verified profiles" or "internal compatibility algorithms".
   - Do NOT use unnatural buzzwords like "sovereign boundaries", "craft devotion", or "status games" unless specifically stated in profile data.
   - Tone must feel like a genuine, intelligent, charming, and specific first date dialogue between two real adults.
3. Every message MUST be complete, natural, and end with proper punctuation (. ! ?). Never leave a sentence unfinished.
4. For each turn, include an agent thought ("thought") explaining the strategic internal evaluation before speaking.
5. Compute an honest compatibility score (0-100) based on shared values, interests, lifestyle, and needs.
6. Return ONLY a single raw JSON object with NO markdown formatting, NO backticks.

SCHEMA:
{
  "compatibilityScore": 84,
  "matchReason": "2 sentences explaining the genuine dynamic and chemistry between both individuals.",
  "breakdown": {
    "values": { "score": 82, "label": "Strong alignment on principles" },
    "interests": { "score": 80, "label": "Shared creative focus" },
    "lifestyle": { "score": 85, "label": "Balanced daily rhythms" },
    "needs": { "score": 78, "label": "Mutually supportive" }
  },
  "sparks": [
    "Genuine mutual respect for independent projects and ambition",
    "Shared curiosity and love for learning without superficial pretense",
    "Direct, transparent communication and emotional maturity"
  ],
  "tensions": [
    "Demanding professional calendars require intentional quality time",
    "Both operate with intense solo focus routines"
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
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            maxOutputTokens: 4096,
            temperature: 0.7
          }
        });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout with model ${modelName}`)), 14000)
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

    // Strict sanitization: ensure no message is truncated or missing terminal punctuation
    if (Array.isArray(parsedData.conversation)) {
      parsedData.conversation.forEach((turn: any) => {
        if (turn && turn.message) {
          let msg = String(turn.message).trim();
          if (!/[.!?]$/.test(msg)) {
            const lastPunct = Math.max(msg.lastIndexOf('.'), msg.lastIndexOf('!'), msg.lastIndexOf('?'));
            if (lastPunct > 25) {
              msg = msg.slice(0, lastPunct + 1);
            } else {
              msg += '.';
            }
          }
          turn.message = msg;
        }
      });
    }

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
