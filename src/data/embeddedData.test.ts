import {
    getAgencies,
    getCharacters,
    getCharactersByMonth,
    getCharactersByUnit,
    getUnits,
} from './embeddedData';

describe('EmbeddedData module', () => {
  describe('getCharacters', () => {
    it('returns all 61 characters', () => {
      const characters = getCharacters();
      expect(characters).toHaveLength(61);
    });

    it('returns the same reference each time (shared read-only data)', () => {
      const a = getCharacters();
      const b = getCharacters();
      expect(a).toBe(b);
    });
  });

  describe('getUnits', () => {
    it('returns all 18 units', () => {
      const units = getUnits();
      expect(units).toHaveLength(18);
    });
  });

  describe('getAgencies', () => {
    it('returns all 5 agencies', () => {
      const agencies = getAgencies();
      expect(agencies).toHaveLength(5);
    });
  });

  describe('getCharactersByUnit', () => {
    it('returns characters for a valid unit', () => {
      const chars = getCharactersByUnit('UN001');
      expect(chars).toHaveLength(4);
      chars.forEach((c) => expect(c.unitId).toBe('UN001'));
    });

    it('returns empty array for non-existent unit', () => {
      const chars = getCharactersByUnit('INVALID');
      expect(chars).toHaveLength(0);
    });

    it('returns a new array (not a reference to the original)', () => {
      const a = getCharactersByUnit('UN001');
      const b = getCharactersByUnit('UN001');
      expect(a).not.toBe(b);
      expect(a).toEqual(b);
    });
  });

  describe('getCharactersByMonth', () => {
    it('returns characters born in January', () => {
      const chars = getCharactersByMonth(1);
      expect(chars.length).toBeGreaterThan(0);
      chars.forEach((c) => expect(c.birthday.month).toBe(1));
    });

    it('returns a new array (not a reference to the original)', () => {
      const a = getCharactersByMonth(3);
      const b = getCharactersByMonth(3);
      expect(a).not.toBe(b);
      expect(a).toEqual(b);
    });

    it('covers all characters across all months', () => {
      let total = 0;
      for (let m = 1; m <= 12; m++) {
        total += getCharactersByMonth(m).length;
      }
      expect(total).toBe(61);
    });
  });
});
