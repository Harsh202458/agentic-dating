const fs = require('fs');
const path = require('path');

const profilesPath = path.join(__dirname, '..', 'public', 'data', 'profiles_analyzed.json');
const matchesPath = path.join(__dirname, '..', 'public', 'data', 'matches.json');

const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
const matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));

const rankings = {};

profiles.forEach(p => {
  const pId = String(p.id);
  const eligibleMatches = [];
  const targetMap = matches[pId] || {};

  for (const [targetId, match] of Object.entries(targetMap)) {
    const targetProf = profiles.find(x => String(x.id) === targetId);
    if (!targetProf) continue;
    // Strictly eligible: male <-> female
    if (p.gender === targetProf.gender) continue;

    eligibleMatches.push({
      id: Number(targetId),
      name: targetProf.name,
      gender: targetProf.gender,
      score: match.compatibilityScore || 80,
      reason: match.matchReason || `${p.name} and ${targetProf.name} share authentic curiosity and complementary lifestyles.`,
      breakdown: {
        values: {
          score: match.breakdown?.values?.score || 82,
          label: match.breakdown?.values?.label || 'Core Values & Principles',
          weight: '30%'
        },
        interests: {
          score: match.breakdown?.interests?.score || 78,
          label: match.breakdown?.interests?.label || 'Interests & Craft Synergy',
          weight: '25%'
        },
        lifestyle: {
          score: match.breakdown?.lifestyle?.score || 85,
          label: match.breakdown?.lifestyle?.label || 'Daily Rhythm & Habits',
          weight: '25%'
        },
        needs: {
          score: match.breakdown?.needs?.score || 80,
          label: match.breakdown?.needs?.label || 'Emotional Support & Alignment',
          weight: '20%'
        }
      }
    });
  }

  // Sort descending by score
  eligibleMatches.sort((a, b) => b.score - a.score);

  rankings[pId] = {
    id: Number(p.id),
    name: p.name,
    gender: p.gender,
    looking_for: p.looking_for || (p.gender === 'male' ? 'women' : 'men'),
    seeking: p.looking_for || (p.gender === 'male' ? 'women' : 'men'),
    ranked: eligibleMatches
  };
});

const outPath1 = path.join(__dirname, '..', 'public', 'data', 'rankings.json');
const outPath2 = path.join(__dirname, '..', '..', 'data', 'rankings.json');

fs.writeFileSync(outPath1, JSON.stringify(rankings, null, 2), 'utf8');
console.log(`Saved rankings to ${outPath1}`);

if (fs.existsSync(path.dirname(outPath2))) {
  fs.writeFileSync(outPath2, JSON.stringify(rankings, null, 2), 'utf8');
  console.log(`Saved rankings to ${outPath2}`);
}

console.log('Rankings regenerated successfully!');
