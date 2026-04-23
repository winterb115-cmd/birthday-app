import { getCharacters } from '../data/embeddedData';
import { CharacterNotificationSettings } from '../services/NotificationSettingsManager';
import { applyUnitToggle, computeUnitStageState } from './syncLogic';

/**
 * Helper: 모든 캐릭터에 대해 기본 CharacterNotificationSettings 생성
 * (dday=true, 나머지=false)
 */
function makeDefaultCharNotifications(): CharacterNotificationSettings {
  const settings: CharacterNotificationSettings = {};
  for (const char of getCharacters()) {
    settings[char.id] = { '7days': false, '3days': false, '1day': false, 'dday': true };
  }
  return settings;
}

describe('applyUnitToggle', () => {
  // UN001 (fine): CH001, CH002, CH003, CH004

  it('sets all characters in the unit to true for the specified stage', () => {
    const settings = makeDefaultCharNotifications();
    const result = applyUnitToggle(settings, 'UN001', '7days', true);

    for (const charId of ['CH001', 'CH002', 'CH003', 'CH004']) {
      expect(result[charId]['7days']).toBe(true);
    }
  });

  it('sets all characters in the unit to false for the specified stage', () => {
    const settings = makeDefaultCharNotifications();
    const result = applyUnitToggle(settings, 'UN001', 'dday', false);

    for (const charId of ['CH001', 'CH002', 'CH003', 'CH004']) {
      expect(result[charId]['dday']).toBe(false);
    }
  });

  it('does not change other stages of characters in the unit', () => {
    const settings = makeDefaultCharNotifications();
    const result = applyUnitToggle(settings, 'UN001', '7days', true);

    for (const charId of ['CH001', 'CH002', 'CH003', 'CH004']) {
      expect(result[charId]['3days']).toBe(false);
      expect(result[charId]['1day']).toBe(false);
      expect(result[charId]['dday']).toBe(true);
    }
  });

  it('does not change characters in other units', () => {
    const settings = makeDefaultCharNotifications();
    const result = applyUnitToggle(settings, 'UN001', '7days', true);

    // CH005 belongs to UN002
    expect(result['CH005']['7days']).toBe(false);
    // CH018 belongs to UN005
    expect(result['CH018']['7days']).toBe(false);
  });

  it('returns a new object (immutable)', () => {
    const settings = makeDefaultCharNotifications();
    const result = applyUnitToggle(settings, 'UN001', '7days', true);

    expect(result).not.toBe(settings);
    expect(result['CH001']).not.toBe(settings['CH001']);
    // Original should be unchanged
    expect(settings['CH001']['7days']).toBe(false);
  });

  it('works with a single-member unit (UN018: CH061)', () => {
    const settings = makeDefaultCharNotifications();
    const result = applyUnitToggle(settings, 'UN018', '3days', true);

    expect(result['CH061']['3days']).toBe(true);
    expect(result['CH061']['dday']).toBe(true); // unchanged
  });

  it('works with a unit that has no characters in settings (empty settings)', () => {
    const empty: CharacterNotificationSettings = {};
    const result = applyUnitToggle(empty, 'UN001', '7days', true);

    for (const charId of ['CH001', 'CH002', 'CH003', 'CH004']) {
      expect(result[charId]['7days']).toBe(true);
    }
  });
});

describe('computeUnitStageState', () => {
  // UN001 (fine): CH001, CH002, CH003, CH004

  it('returns true when all characters have the stage set to true', () => {
    const settings = makeDefaultCharNotifications();
    // dday is true for all by default
    expect(computeUnitStageState(settings, 'UN001', 'dday')).toBe(true);
  });

  it('returns false when all characters have the stage set to false', () => {
    const settings = makeDefaultCharNotifications();
    // 7days is false for all by default
    expect(computeUnitStageState(settings, 'UN001', '7days')).toBe(false);
  });

  it('returns false when one character differs', () => {
    const settings = makeDefaultCharNotifications();
    // Turn off dday for CH001 only
    settings['CH001'] = { ...settings['CH001'], 'dday': false };

    expect(computeUnitStageState(settings, 'UN001', 'dday')).toBe(false);
  });

  it('returns true after applyUnitToggle sets all to true', () => {
    const settings = makeDefaultCharNotifications();
    const updated = applyUnitToggle(settings, 'UN001', '3days', true);

    expect(computeUnitStageState(updated, 'UN001', '3days')).toBe(true);
  });

  it('returns false when a character is missing from settings', () => {
    const settings = makeDefaultCharNotifications();
    delete settings['CH001'];

    expect(computeUnitStageState(settings, 'UN001', 'dday')).toBe(false);
  });

  it('works with a single-member unit (UN018: CH061)', () => {
    const settings = makeDefaultCharNotifications();
    expect(computeUnitStageState(settings, 'UN018', 'dday')).toBe(true);
    expect(computeUnitStageState(settings, 'UN018', '7days')).toBe(false);
  });
});
