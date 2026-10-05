/**
 * Matching & Compatibility Utilities
 * Provides canonical, strictly enforced eligibility and opposite-gender/preference pairing logic.
 */

export interface Candidate {
  id: number | string;
  name: string;
  gender?: 'male' | 'female' | 'other' | string;
  looking_for?: 'men' | 'women' | 'everyone' | string;
  seeking?: 'men' | 'women' | 'everyone' | 'male' | 'female' | string;
  [key: string]: any;
}

/**
 * Normalizes preference string into 'men' | 'women' | 'everyone'
 */
export function normalizePreference(pref?: string, gender?: string): 'men' | 'women' | 'everyone' {
  if (!pref) {
    return gender === 'female' ? 'men' : 'women';
  }
  const lower = pref.toLowerCase().trim();
  if (lower === 'everyone' || lower === 'all') return 'everyone';
  if (lower === 'women' || lower === 'female' || lower === 'woman') return 'women';
  if (lower === 'men' || lower === 'male' || lower === 'man') return 'men';
  return gender === 'female' ? 'men' : 'women';
}

/**
 * Returns true ONLY if both candidates mutually satisfy each other's gender & preference requirements.
 * Default for heterosexual cohorts: Men date Women, Women date Men.
 */
export function isPairEligible(personA?: Candidate | null, personB?: Candidate | null): boolean {
  if (!personA || !personB) return false;
  if (String(personA.id) === String(personB.id)) return false;

  const genderA = (personA.gender || 'male').toLowerCase();
  const genderB = (personB.gender || 'female').toLowerCase();

  const prefA = normalizePreference(personA.looking_for || personA.seeking, genderA);
  const prefB = normalizePreference(personB.looking_for || personB.seeking, genderB);

  // A accepts B
  const aAcceptsB = prefA === 'everyone' ||
    (prefA === 'women' && genderB === 'female') ||
    (prefA === 'men' && genderB === 'male');

  // B accepts A
  const bAcceptsA = prefB === 'everyone' ||
    (prefB === 'women' && genderA === 'female') ||
    (prefB === 'men' && genderA === 'male');

  return aAcceptsB && bAcceptsA;
}

/**
 * Returns all candidates in `pool` that are eligible matches for `person`.
 */
export function getEligiblePartners(person: Candidate, pool: Candidate[]): Candidate[] {
  if (!person || !pool) return [];
  return pool.filter(p => isPairEligible(person, p));
}

/**
 * Returns the best default sample partner for a given candidate (always an eligible match).
 */
export function getSamplePartner(person: Candidate, pool: Candidate[]): Candidate | null {
  const eligible = getEligiblePartners(person, pool);
  if (eligible.length > 0) return eligible[0];
  // If pool is completely one-sided, return null
  return null;
}
