const fs = require('fs');
const path = require('path');

const profilesPath = path.join(__dirname, '..', 'public', 'data', 'profiles_analyzed.json');
const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));

// Build lookup map by string ID
const profMap = new Map();
profiles.forEach(p => profMap.set(String(p.id), p));

// Men: 1..13, Women: 14..25
const men = profiles.filter(p => p.gender === 'male');
const women = profiles.filter(p => p.gender === 'female');

console.log(`Men: ${men.length}, Women: ${women.length}`);

function cleanSentence(s) {
  let trimmed = s.trim();
  if (!/[.!?]$/.test(trimmed)) {
    trimmed += '.';
  }
  return trimmed;
}

function calculateScore(pA, pB) {
  // Base compatibility around 74-94
  let score = 75;
  const interestsA = new Set((pA.interests || []).map(i => i.toLowerCase()));
  const interestsB = new Set((pB.interests || []).map(i => i.toLowerCase()));
  const valuesA = new Set((pA.values || []).map(v => v.toLowerCase()));
  const valuesB = new Set((pB.values || []).map(v => v.toLowerCase()));

  // Count overlap or synergies
  let commonInterests = 0;
  for (const i of interestsA) {
    for (const j of interestsB) {
      if (i.includes(j) || j.includes(i) || i.split(' ').some(w => w.length > 4 && j.includes(w))) {
        commonInterests++;
      }
    }
  }

  let commonValues = 0;
  for (const v of valuesA) {
    for (const w of valuesB) {
      if (v.includes(w) || w.includes(v) || v.split(' ').some(word => word.length > 4 && w.includes(word))) {
        commonValues++;
      }
    }
  }

  score += Math.min(12, commonInterests * 4);
  score += Math.min(8, commonValues * 3);
  // Hash seed for stability
  const seed = (Number(pA.id) * 31 + Number(pB.id) * 17) % 7;
  score = Math.min(94, Math.max(68, score + seed - 3));

  return score;
}

function generateDialogue(pA, pB, score) {
  const intA1 = pA.interests?.[0] || 'technology and building things';
  const intA2 = pA.interests?.[1] || 'independent projects';
  const valA1 = pA.values?.[0] || 'freedom';
  const valA2 = pA.values?.[1] || 'honesty';
  const dealA = pA.dealbreakers?.[0] || 'lack of ambition';

  const intB1 = pB.interests?.[0] || 'creative expression';
  const intB2 = pB.interests?.[1] || 'entrepreneurship';
  const valB1 = pB.values?.[0] || 'authenticity';
  const valB2 = pB.values?.[1] || 'mutual support';
  const dealB = pB.dealbreakers?.[0] || 'superficiality';

  const conv = [
    {
      agent: 'A',
      name: pA.name,
      thought: `Introducing ${pA.name}'s lifestyle, daily focus on ${intA1}, and seeking an authentic opening without assumptions.`,
      message: cleanSentence(`Hi! I am here representing ${pA.name}. Most of their days revolve around ${intA1} and building things from scratch, but they genuinely value balance and meaningful company. How does your day usually unfold, and what gives you the most energy right now?`)
    },
    {
      agent: 'B',
      name: pB.name,
      thought: `Responding with warmth on behalf of ${pB.name}, highlighting their focus on ${intB1} while exploring chemistry.`,
      message: cleanSentence(`Hello! On ${pB.name}'s side, life is centered on ${intB1} and ${intB2}. They love working with intention, but unwinding with genuine conversations and laughter is just as vital. When you step away from work, what kind of conversations or experiences do you gravitate toward?`)
    },
    {
      agent: 'A',
      name: pA.name,
      thought: `Probing core values—testing whether ${pB.name} respects ${valA1} and handles life with ${valA2}.`,
      message: cleanSentence(`For ${pA.name}, everything comes down to ${valA1} and ${valA2}. They thrive when both partners cheer each other on while having complete trust to pursue their own growth. In long-term connections, what values do you treat as non-negotiable?`)
    },
    {
      agent: 'B',
      name: pB.name,
      thought: `Affirming alignment on ${valB1} and addressing daily routines and emotional presence.`,
      message: cleanSentence(`That deeply aligns with ${pB.name}'s outlook. Their foundation rests on ${valB1} and ${valB2}. Having a partner who understands intense focus without feeling neglected makes all the difference. How do you protect quality time when life gets busy?`)
    },
    {
      agent: 'A',
      name: pA.name,
      thought: `Discussing dealbreakers like ${dealA} and direct conflict resolution.`,
      message: cleanSentence(`A clear dealbreaker for ${pA.name} is ${dealA.toLowerCase()}. If there is disagreement, they believe in addressing things with calm, direct honesty rather than letting friction linger. How does your person navigate tough conversations?`)
    },
    {
      agent: 'B',
      name: pB.name,
      thought: `Synthesizing mutual fit based on ${valB1}, addressing ${dealB}, and delivering positive verdict.`,
      message: cleanSentence(`With complete openness and care—life is too short for passive aggression, and ${dealB.toLowerCase()} is something ${pB.name} avoids completely. Based on what we have shared, there is a natural rhythm and mutual respect here that would be truly exciting to explore in person.`)
    }
  ];

  const valScore = Math.min(96, score + 2);
  const intScore = Math.min(94, score - 3);
  const lifeScore = Math.min(95, score + 1);
  const needScore = Math.min(92, score - 1);

  return {
    personA: pA.name,
    personB: pB.name,
    compatibilityScore: score,
    matchReason: cleanSentence(`${pA.name} and ${pB.name} demonstrate strong mutual resonance around ${valA1.toLowerCase()} and ${valB1.toLowerCase()}, with complementary creative rhythms and clear communication.`),
    breakdown: {
      values: { score: valScore, label: `Strong alignment on ${valA1}` },
      interests: { score: intScore, label: `Shared curiosity in ${intA1}` },
      lifestyle: { score: lifeScore, label: 'Balanced daily schedules' },
      needs: { score: needScore, label: 'Mutually supportive dynamic' }
    },
    sparks: [
      cleanSentence(`Shared dedication to ${valA1} and personal independence`),
      cleanSentence(`Mutual excitement for ${intA1} and creative projects`),
      cleanSentence(`Direct, transparent communication with zero tolerance for pretense`)
    ],
    tensions: [
      cleanSentence(`Both maintain demanding schedules requiring intentional quality time`),
      cleanSentence(`High individual focus requires clear communication around calendar commitments`)
    ],
    conversation: conv,
    isOppositeGender: true
  };
}

const matches = {};

// Initialize all profiles
profiles.forEach(p => {
  matches[String(p.id)] = {};
});

let pairCount = 0;

for (const m of men) {
  for (const w of women) {
    const score = calculateScore(m, w);

    // Forward direction: Man = A, Woman = B
    const matchForward = generateDialogue(m, w, score);
    matches[String(m.id)][String(w.id)] = matchForward;

    // Reverse direction: Woman = A, Man = B
    const matchReverse = generateDialogue(w, m, score);
    matches[String(w.id)][String(m.id)] = matchReverse;

    pairCount++;
  }
}

console.log(`Generated ${pairCount} unique pairs (${pairCount * 2} bidirectional matches).`);

const outPath1 = path.join(__dirname, '..', 'public', 'data', 'matches.json');
const outPath2 = path.join(__dirname, '..', '..', 'data', 'matches.json');

fs.writeFileSync(outPath1, JSON.stringify(matches, null, 2), 'utf8');
console.log(`Saved to ${outPath1}`);

if (fs.existsSync(path.dirname(outPath2))) {
  fs.writeFileSync(outPath2, JSON.stringify(matches, null, 2), 'utf8');
  console.log(`Saved to ${outPath2}`);
}

console.log('Regeneration complete!');
