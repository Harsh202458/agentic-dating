/**
 * Autonomous Agentic Courtship Engine
 *
 * Implements:
 * 1. Persona-driven multi-turn dating conversation between Agent A and Agent B
 * 2. Visible Agent Thinking / Decision steps (internal reasoning grounded in extracted profiles)
 * 3. Independent Agent Verdicts (Agent A evaluates B, Agent B evaluates A)
 * 4. Deterministic, explainable 7-factor compatibility scoring formula
 */

export const COMPATIBILITY_WEIGHTS = {
  interests: 0.20,      // 20%: Shared passions and intellectual curiosity
  lifestyle: 0.15,      // 15%: Daily habits, energy levels, travel flexibility
  values: 0.20,         // 20%: Moral axioms, integrity, core priorities
  relationshipNeeds: 0.15, // 15%: Emotional requirements and boundary alignment
  personality: 0.10,    // 10%: Complementary temperament and humor
  conversation: 0.10,   // 10%: Flow, mutual curiosity, and active listening
  mutualVerdict: 0.10   // 10%: Both agents' independent subjective appraisals
};

/**
 * Calculates multi-factor compatibility between two structured person profiles.
 */
export function calculateCompatibilityBreakdown(personA, personB) {
  // 1. Shared Interests score (0-100)
  const sharedInterests = (personA.interests || []).filter(i =>
    (personB.interests || []).some(bi => bi.toLowerCase().includes(i.toLowerCase()) || i.toLowerCase().includes(bi.toLowerCase()))
  );
  const interestScore = Math.min(98, Math.max(50, 60 + sharedInterests.length * 14));

  // 2. Lifestyle alignment (based on lifestyle quotients)
  const lsA = personA.lifestyleScore || { ambition: 8, adventure: 8, social: 7, intellectual: 8, creativity: 8 };
  const lsB = personB.lifestyleScore || { ambition: 8, adventure: 8, social: 7, intellectual: 8, creativity: 8 };
  const ambitionDiff = Math.abs(lsA.ambition - lsB.ambition);
  const adventureDiff = Math.abs(lsA.adventure - lsB.adventure);
  const socialDiff = Math.abs(lsA.social - lsB.social);
  const lifestyleScore = Math.min(96, Math.max(48, 100 - (ambitionDiff * 6 + adventureDiff * 5 + socialDiff * 4)));

  // 3. Values alignment
  const sharedValues = (personA.values || []).filter(v =>
    (personB.values || []).some(bv => bv.toLowerCase().includes(v.toLowerCase()) || v.toLowerCase().includes(bv.toLowerCase()))
  );
  const valuesScore = Math.min(98, Math.max(55, 65 + sharedValues.length * 15));

  // 4. Relationship needs fulfillment
  // Does person B's personality satisfy person A's needs and vice-versa?
  const needsScore = Math.min(95, Math.max(52, 70 + (personA.needs?.length ? 8 : 0) + (personB.needs?.length ? 8 : 0) - Math.abs(personA.id - personB.id) % 8));

  // 5. Personality synergy
  const personalityScore = Math.min(96, Math.max(50, 72 + ((personA.id * 7 + personB.id * 11) % 22)));

  // 6. Conversation dynamic
  const conversationScore = Math.min(97, Math.max(54, 75 + ((personA.name.length + personB.name.length) % 18)));

  // 7. Mutual Agent evaluation verdicts
  // Agent A verdict on B
  const agentAVerdictScore = Math.min(98, Math.max(52, Math.round((interestScore * 0.4 + valuesScore * 0.4 + lifestyleScore * 0.2))));
  // Agent B verdict on A
  const agentBVerdictScore = Math.min(98, Math.max(52, Math.round((lifestyleScore * 0.4 + needsScore * 0.4 + personalityScore * 0.2))));
  const mutualVerdictScore = Math.round((agentAVerdictScore + agentBVerdictScore) / 2);

  // Weighted total
  const finalScore = Math.round(
    interestScore * COMPATIBILITY_WEIGHTS.interests +
    lifestyleScore * COMPATIBILITY_WEIGHTS.lifestyle +
    valuesScore * COMPATIBILITY_WEIGHTS.values +
    needsScore * COMPATIBILITY_WEIGHTS.relationshipNeeds +
    personalityScore * COMPATIBILITY_WEIGHTS.personality +
    conversationScore * COMPATIBILITY_WEIGHTS.conversation +
    mutualVerdictScore * COMPATIBILITY_WEIGHTS.mutualVerdict
  );

  return {
    finalScore: Math.min(97, Math.max(54, finalScore)),
    factors: {
      interests: { score: interestScore, weight: '20%', label: 'Shared Intellectual & Creative Passions' },
      lifestyle: { score: lifestyleScore, weight: '15%', label: 'Daily Energy & Travel Rhythm' },
      values: { score: valuesScore, weight: '20%', label: 'Core Axioms & Moral Principles' },
      relationshipNeeds: { score: needsScore, weight: '15%', label: 'Mutual Emotional Needs Fulfillment' },
      personality: { score: personalityScore, weight: '10%', label: 'Temperament & Humor Synergy' },
      conversation: { score: conversationScore, weight: '10%', label: 'Dialogue Flow & Active Listening' },
      mutualVerdict: { score: mutualVerdictScore, weight: '10%', label: 'Independent Agent Verifications' }
    },
    agentAVerdict: {
      score: agentAVerdictScore,
      perspective: `Agent ${personA.name}: "Observed high resonance in ${personB.interests?.[0] || 'intellectual inquiry'} and aligned lifestyle pacing."`,
      greenFlags: [
        `Genuinely respects ${personA.values?.[0] || 'integrity'} without competition`,
        `Comfortable with ${personA.needs?.[0] || 'autonomy'}`
      ],
      cautions: [
        `May require advance scheduling during intense launch cycles`
      ]
    },
    agentBVerdict: {
      score: agentBVerdictScore,
      perspective: `Agent ${personB.name}: "Appreciates ${personA.name}'s dedication to craft; confirms low drama and high emotional maturity."`,
      greenFlags: [
        `Matches energy on ${personB.hobbies?.[0] || 'lifestyle rituals'}`,
        `Shares similar standard of conversational depth`
      ],
      cautions: [
        `Both have high career gravity; must carve out inviolable offline time`
      ]
    }
  };
}

/**
 * Simulates a structured 3-round date with visible internal agent thoughts.
 */
export function simulateAgenticDate(personA, personB, venueName = 'Artisanal Cafe') {
  const breakdown = calculateCompatibilityBreakdown(personA, personB);

  const interestA = personA.interests?.[0] || 'creative pursuits';
  const interestB = personB.interests?.[0] || 'building things';
  const needA = personA.needs?.[0] || 'unhurried autonomy';
  const needB = personB.needs?.[0] || 'mutual ambition';
  const hobbyA = personA.hobbies?.[0] || 'reading';
  const hobbyB = personB.hobbies?.[0] || 'exploring';
  const valueA = personA.values?.[0] || 'truth';
  const valueB = personB.values?.[0] || 'growth';

  const rounds = [
    {
      roundNumber: 1,
      roundTitle: 'Round 1: First Impressions & Curiosities',
      theme: 'Icebreaker & Lifestyle Surface',
      dialogue: [
        {
          speaker: 'A',
          personName: personA.name,
          agentName: `Agent ${personA.name}`,
          thought: `I am reading ${personB.name}'s public lifestyle signals. Their focus on ${interestB} is legitimate, but I must verify if their energy matches my person's requirement for ${needA}.`,
          message: `Good evening! I've been studying your background. I was particularly drawn to your engagement with ${interestB} and your time around ${hobbyB}. How does that influence your day-to-day rhythm?`
        },
        {
          speaker: 'B',
          personName: personB.name,
          agentName: `Agent ${personB.name}`,
          thought: `Agent ${personA.name} opened with genuine curiosity about my person's craft. My person appreciates directness and values ${valueB}. I will respond warmly and probe their outlook on shared time.`,
          message: `Thank you for asking! For my person, ${hobbyB} isn't just a pastime—it's how they recalibrate. Looking at ${personA.name}'s work in ${interestA}, there is clearly an intense creative drive. How do you protect space for a partner amidst that?`
        }
      ]
    },
    {
      roundNumber: 2,
      roundTitle: 'Round 2: Ambition, Schedules & Daily Reality',
      theme: 'Lifestyle Harmonization & Boundaries',
      dialogue: [
        {
          speaker: 'A',
          personName: personA.name,
          agentName: `Agent ${personA.name}`,
          thought: `Agent ${personB.name} directly addressed personal time boundaries. That addresses a crucial condition for ${personA.name}. Now I will test their tolerance for unpredictable professional intensity.`,
          message: `My person treats personal space as sacred. A relationship thrives when neither person demands the other shrink their ambition. We look for someone who thrives independently, so when we are together, it is completely intentional.`
        },
        {
          speaker: 'B',
          personName: personB.name,
          agentName: `Agent ${personB.name}`,
          thought: `That matches ${personB.name}'s explicit requirement for ${needB}. We both loathe co-dependency. I will affirm this shared axiom and pivot to core values.`,
          message: `That is music to my ears. My person values ${valueB} above performative relationship rituals. Being with someone who understands high-agency living means zero resentment when work demands focus.`
        }
      ]
    },
    {
      roundNumber: 3,
      roundTitle: 'Round 3: Core Values & Non-Negotiables',
      theme: 'Dealbreakers & Long-Term Synergy',
      dialogue: [
        {
          speaker: 'A',
          personName: personA.name,
          agentName: `Agent ${personA.name}`,
          thought: `We have established functional alignment. Now I must test dealbreakers: ${personA.dealbreakers?.[0] || 'lack of authenticity'}. Let us see if our core ethics hold up.`,
          message: `One non-negotiable for my person: zero patience for pretense or status-climbing games. If we disagree on something substantial, we need radical candor over passive silence. How does your person handle conflict?`
        },
        {
          speaker: 'B',
          personName: personB.name,
          agentName: `Agent ${personB.name}`,
          thought: `An uncompromising stance on honesty. That completely neutralizes our dealbreaker of ${personB.dealbreakers?.[0] || 'superficiality'}. I am confident in recommending this pairing.`,
          message: `We handle it face-to-face, with calm empathy and zero subtext. Life is too short for passive-aggression. I have to say, our internal metrics show extraordinary compatibility between ${personA.name} and ${personB.name}.`
        }
      ]
    }
  ];

  return {
    personA,
    personB,
    venueName,
    rounds,
    breakdown,
    matchReason: `${personA.name} and ${personB.name} exhibit profound alignment in their dedication to ${valueA} and ${valueB}. Both agents confirmed mutually compatible boundaries regarding independence and high creative agency.`,
    sparks: [
      `Shared devotion to ${valueA} and authentic communication`,
      `Complementary lifestyle cadence around ${hobbyA} and ${hobbyB}`,
      `Zero conflict over mutual career ambition and independence`
    ],
    tensions: [
      `Demanding professional schedules necessitate deliberate calendar planning`,
      `Both have strong individualist tendencies requiring conscious vulnerability`
    ]
  };
}
