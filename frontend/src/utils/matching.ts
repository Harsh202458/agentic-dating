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
/**
 * Canonical isEligiblePair function.
 * Missing data strictly means 'not eligible'.
 * Returns true ONLY if both candidates exist, have non-missing gender & looking_for data,
 * and mutually satisfy each other's gender & preference requirements.
 */
export function isEligiblePair(personA?: Candidate | null, personB?: Candidate | null): boolean {
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

  // A accepts B
  const aAcceptsB = normPrefA === 'everyone' ||
    (normPrefA === 'women' && genderB === 'female') ||
    (normPrefA === 'men' && genderB === 'male');

  // B accepts A
  const bAcceptsA = normPrefB === 'everyone' ||
    (normPrefB === 'women' && genderA === 'female') ||
    (normPrefB === 'men' && genderA === 'male');

  return aAcceptsB && bAcceptsA;
}

// Retain alias for backward compatibility
export const isPairEligible = isEligiblePair;

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
