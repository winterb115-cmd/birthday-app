import { AGENCIES } from './agencies';
import { CHARACTERS } from './characters';
import { Agency, Character, Unit } from './types';
import { UNITS } from './units';

// Re-export types for convenience
export type { Agency, Character, Unit };

/**
 * Returns all 61 characters (read-only).
 */
export function getCharacters(): readonly Character[] {
  return CHARACTERS;
}

/**
 * Returns all 18 units (read-only).
 */
export function getUnits(): readonly Unit[] {
  return UNITS;
}

/**
 * Returns all 5 agencies (read-only).
 */
export function getAgencies(): readonly Agency[] {
  return AGENCIES;
}

/**
 * Returns characters belonging to a specific unit.
 * Returns a new array (not a reference to the original).
 */
export function getCharactersByUnit(unitId: string): Character[] {
  return CHARACTERS.filter((c) => c.unitId === unitId);
}

/**
 * Returns characters whose birthday is in the given month (1-12).
 * Returns a new array (not a reference to the original).
 */
export function getCharactersByMonth(month: number): Character[] {
  return CHARACTERS.filter((c) => c.birthday.month === month);
}
