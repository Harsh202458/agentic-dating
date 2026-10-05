const fs = require('fs');
const path = require('path');

function normalizePreference(pref, gender) {
  if (!pref) return gender === 'female' ? 'men' : 'women';
  const lower = String(pref).toLowerCase().trim();
  if (lower === 'everyone' || lower === 'all') return 'everyone';
  if (lower === 'women' || lower === 'female' || lower === 'woman') return 'women';
  if (lower === 'men' || lower === 'male' || lower === 'man') return 'men';
  return gender === 'female' ? 'men' : 'women';
}

function isEligiblePair(personA, personB) {
  if (!personA || !personB) return false;
  if (String(personA.id) === String(personB.id)) return false;
  if (!personA.gender || !personB.gender) return false;

  const prefA = personA.looking_for || personA.lookingFor || personA.seeking;
  const prefB = personB.looking_for || personB.lookingFor || personB.seeking;
  if (!prefA || !prefB) return false;

  const genderA = personA.gender.toLowerCase().trim();
  const genderB = personB.gender.toLowerCase().trim();

  const normPrefA = normalizePreference(prefA, genderA);
  const normPrefB = normalizePreference(prefB, genderB);

  const aAcceptsB = normPrefA === 'everyone' ||
    (normPrefA === 'women' && genderB === 'female') ||
    (normPrefA === 'men' && genderB === 'male');

  const bAcceptsA = normPrefB === 'everyone' ||
    (normPrefB === 'women' && genderA === 'female') ||
    (normPrefB === 'men' && genderA === 'male');

  return aAcceptsB && bAcceptsA;
}

console.log('--- TEST 1: isEligiblePair function behavior ---');
// Missing data checks
if (isEligiblePair(null, { id: 1, gender: 'male', looking_for: 'women' }) !== false) throw new Error('Failed: null personA must be false');
if (isEligiblePair({ id: 1, gender: 'male' }, { id: 2, gender: 'female', looking_for: 'men' }) !== false) throw new Error('Failed: missing looking_for must be false');
if (isEligiblePair({ id: 1, looking_for: 'women' }, { id: 2, gender: 'female', looking_for: 'men' }) !== false) throw new Error('Failed: missing gender must be false');
if (isEligiblePair({ id: 1, gender: 'male', looking_for: 'women' }, { id: 1, gender: 'male', looking_for: 'women' }) !== false) throw new Error('Failed: same id must be false');

// Valid opposite gender
if (isEligiblePair({ id: 1, gender: 'male', looking_for: 'women' }, { id: 14, gender: 'female', looking_for: 'men' }) !== true) throw new Error('Failed: valid male-female must be true');

// Ineligible same-gender
if (isEligiblePair({ id: 1, gender: 'male', looking_for: 'women' }, { id: 2, gender: 'male', looking_for: 'women' }) !== false) throw new Error('Failed: male-male must be false');
if (isEligiblePair({ id: 14, gender: 'female', looking_for: 'men' }, { id: 15, gender: 'female', looking_for: 'men' }) !== false) throw new Error('Failed: female-female must be false');

console.log('✓ TEST 1 PASSED: isEligiblePair handles all boundary conditions correctly.');

console.log('--- TEST 2: Automatic Matches in matches.json ---');
const profiles = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'data', 'profiles_analyzed.json'), 'utf8'));
const profMap = new Map(profiles.map(p => [String(p.id), p]));
const matches = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'data', 'matches.json'), 'utf8'));

let matchChecked = 0;
for (const [id1, targets] of Object.entries(matches)) {
  const p1 = profMap.get(id1);
  if (!p1) continue;
  for (const [id2, m] of Object.entries(targets)) {
    const p2 = profMap.get(id2);
    if (!p2) continue;
    if (!isEligiblePair(p1, p2)) {
      throw new Error(`Ineligible automatic match in matches.json: ${p1.name} (${p1.gender}) <-> ${p2.name} (${p2.gender})`);
    }
    matchChecked++;
  }
}
console.log(`✓ TEST 2 PASSED: All ${matchChecked} automatic matches in matches.json are 100% eligible.`);

console.log('--- TEST 3: Automatic Rankings in rankings.json ---');
const rankings = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'data', 'rankings.json'), 'utf8'));
let rankChecked = 0;
for (const [id1, item] of Object.entries(rankings)) {
  const p1 = profMap.get(id1);
  if (!p1) continue;
  for (const r of item.ranked) {
    const p2 = profMap.get(String(r.id));
    if (!p2) continue;
    if (!isEligiblePair(p1, p2)) {
      throw new Error(`Ineligible ranking in rankings.json: ${p1.name} (${p1.gender}) ranked with ${p2.name} (${p2.gender})`);
    }
    rankChecked++;
  }
}
console.log(`✓ TEST 3 PASSED: All ${rankChecked} automatic rankings in rankings.json are 100% eligible.`);
console.log('ALL ELIGIBILITY TESTS PASSED SUCCESSFULLY!');
