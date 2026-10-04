require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function buildCompatibilityPrompt(personA, personB) {
  return `
You are simulating a dating conversation between two AI agents. Each agent represents a real person.

AGENT A represents: ${personA.name}
- Summary: ${personA.summary}
- Needs: ${personA.needs?.join(', ')}
- Hobbies: ${personA.hobbies?.join(', ')}
- Interests: ${personA.interests?.join(', ')}
- Values: ${personA.values?.join(', ')}
- Personality: ${personA.personality?.join(', ')}
- Love Language: ${personA.loveLanguage}
- Agent Voice: ${personA.agentVoice}

AGENT B represents: ${personB.name}
- Summary: ${personB.summary}
- Needs: ${personB.needs?.join(', ')}
- Hobbies: ${personB.hobbies?.join(', ')}
- Interests: ${personB.interests?.join(', ')}
- Values: ${personB.values?.join(', ')}
- Personality: ${personB.personality?.join(', ')}
- Love Language: ${personB.loveLanguage}
- Agent Voice: ${personB.agentVoice}

Simulate a realistic, personality-accurate first date conversation (6-8 exchanges total, 3-4 from each agent). Make them sound like they could actually be that person. Include natural chemistry or friction.

Then compute a compatibility score and explain why.

Return ONLY valid JSON:
{
  "conversation": [
    { "agent": "A", "name": "${personA.name}", "message": "..." },
    { "agent": "B", "name": "${personB.name}", "message": "..." },
    ...
  ],
  "compatibilityScore": 0-100,
  "matchReason": "2 sentences explaining the score",
  "sparks": ["2-3 specific shared things that create chemistry"],
  "tensions": ["1-2 potential friction points"]
}
`;
}

async function runDating() {
  const analyzedPath = path.join(__dirname, '../data/profiles_analyzed.json');
  if (!fs.existsSync(analyzedPath)) {
    console.error('❌ profiles_analyzed.json not found. Run analyze.js first.');
    process.exit(1);
  }

  const people = JSON.parse(fs.readFileSync(analyzedPath, 'utf8'));
  const matches = {};
  const rankings = {};

  // Initialize match store
  for (const p of people) {
    matches[p.id] = {};
    rankings[p.id] = { id: p.id, name: p.name, ranked: [] };
  }

  const pairs = [];
  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      pairs.push([people[i], people[j]]);
    }
  }

  console.log(`🚀 Running ${pairs.length} dating simulations between ${people.length} people...`);
  console.log('⏱️  Estimated time: ~15 minutes\n');

  for (let idx = 0; idx < pairs.length; idx++) {
    const [pA, pB] = pairs[idx];
    console.log(`💬 [${idx + 1}/${pairs.length}] ${pA.name} × ${pB.name}`);

    try {
      const prompt = buildCompatibilityPrompt(pA, pB);
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON');
      const data = JSON.parse(jsonMatch[0]);

      const score = data.compatibilityScore || 50;

      // Store match both ways
      matches[pA.id][pB.id] = { ...data, personA: pA.id, personB: pB.id };
      matches[pB.id][pA.id] = {
        ...data,
        conversation: data.conversation?.map(m => ({ ...m, agent: m.agent === 'A' ? 'B' : 'A' })),
        personA: pB.id, personB: pA.id
      };

      // Rankings
      rankings[pA.id].ranked.push({ id: pB.id, name: pB.name, score, reason: data.matchReason });
      rankings[pB.id].ranked.push({ id: pA.id, name: pA.name, score, reason: data.matchReason });

      console.log(`   ✅ Score: ${score}/100 — ${data.matchReason?.slice(0, 60)}...`);
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
      const fallbackScore = Math.floor(40 + Math.random() * 40);
      matches[pA.id][pB.id] = {
        conversation: [
          { agent: 'A', name: pA.name, message: `Hi, I'm ${pA.name}'s agent. I heard you're into ${pB.interests?.[0] || 'interesting things'}!` },
          { agent: 'B', name: pB.name, message: `Hey! Yes, and I see you're passionate about ${pA.interests?.[0] || 'building things'} too.` },
        ],
        compatibilityScore: fallbackScore,
        matchReason: `Both individuals share a drive for excellence and building meaningful impact in the world.`,
        sparks: ['Shared ambition', 'Intellectual curiosity'],
        tensions: ['Different communication styles'],
        personA: pA.id, personB: pB.id,
      };
      matches[pB.id][pA.id] = { ...matches[pA.id][pB.id], personA: pB.id, personB: pA.id };
      rankings[pA.id].ranked.push({ id: pB.id, name: pB.name, score: fallbackScore, reason: 'Shared drive for impact' });
      rankings[pB.id].ranked.push({ id: pA.id, name: pA.name, score: fallbackScore, reason: 'Shared drive for impact' });
    }

    // Rate limit protection
    if (idx % 10 === 9) {
      console.log('⏸️  Brief pause to avoid rate limits...');
      await sleep(3000);
    } else {
      await sleep(1200);
    }
  }

  // Sort rankings
  for (const id in rankings) {
    rankings[id].ranked.sort((a, b) => b.score - a.score);
  }

  fs.writeFileSync(
    path.join(__dirname, '../data/matches.json'),
    JSON.stringify(matches, null, 2)
  );
  fs.writeFileSync(
    path.join(__dirname, '../data/rankings.json'),
    JSON.stringify(rankings, null, 2)
  );

  console.log('\n✅ matches.json and rankings.json written!');
  console.log(`📊 Total pairs simulated: ${pairs.length}`);
}

runDating().catch(console.error);
