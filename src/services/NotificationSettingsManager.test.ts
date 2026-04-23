import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCharacters } from '../data/embeddedData';
import {
    DEFAULT_NOTIFICATION_TIME,
    getUnitStageState,
    initializeDefaultSettings,
    loadSettings,
    NOTIFICATION_STAGES,
    NotificationStage,
    saveSettings,
    setNotificationTime,
    STORAGE_KEY,
    toggleCharacterStage,
    toggleUnitStage
} from './NotificationSettingsManager';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  const store: Record<string, string> = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key: string) => store[key] ?? null),
      setItem: jest.fn(async (key: string, value: string) => { store[key] = value; }),
      _store: store,
    },
  };
});

function getStore(): Record<string, string> {
  return (AsyncStorage as any)._store;
}

function clearStore() {
  const store = getStore();
  Object.keys(store).forEach((key) => delete store[key]);
}

describe('NotificationSettingsManager', () => {
  describe('constants', () => {
    it('NOTIFICATION_STAGES contains all 4 stages', () => {
      expect(NOTIFICATION_STAGES).toEqual(['7days', '3days', '1day', 'dday']);
    });

    it('DEFAULT_NOTIFICATION_TIME is 09:00', () => {
      expect(DEFAULT_NOTIFICATION_TIME).toEqual({ hour: 9, minute: 0 });
    });
  });

  describe('initializeDefaultSettings', () => {
    const settings = initializeDefaultSettings();
    const allCharacters = getCharacters();

    it('returns isInitialized as true', () => {
      expect(settings.isInitialized).toBe(true);
    });

    it('sets notificationTime to 09:00', () => {
      expect(settings.notificationTime).toEqual({ hour: 9, minute: 0 });
    });

    it('creates entries for all 61 characters', () => {
      const settingsIds = Object.keys(settings.characterNotifications);
      expect(settingsIds).toHaveLength(allCharacters.length);
      for (const char of allCharacters) {
        expect(settings.characterNotifications[char.id]).toBeDefined();
      }
    });

    it('sets dday=true and 7days/3days/1day=false for each character', () => {
      for (const char of allCharacters) {
        const charSettings = settings.characterNotifications[char.id];
        expect(charSettings['dday']).toBe(true);
        expect(charSettings['7days']).toBe(false);
        expect(charSettings['3days']).toBe(false);
        expect(charSettings['1day']).toBe(false);
      }
    });

    it('each character has exactly 4 notification stages', () => {
      for (const char of allCharacters) {
        const stages = Object.keys(settings.characterNotifications[char.id]) as NotificationStage[];
        expect(stages).toHaveLength(4);
        expect(stages.sort()).toEqual([...NOTIFICATION_STAGES].sort());
      }
    });
  });

  describe('loadSettings', () => {
    beforeEach(() => {
      clearStore();
      jest.clearAllMocks();
      // Restore default getItem implementation
      (AsyncStorage.getItem as jest.Mock).mockImplementation(
        async (key: string) => getStore()[key] ?? null
      );
    });

    it('returns default settings when no data in storage', async () => {
      const result = await loadSettings();
      const defaults = initializeDefaultSettings();
      expect(result).toEqual(defaults);
    });

    it('loads valid persisted settings', async () => {
      const defaults = initializeDefaultSettings();
      const persisted = {
        version: 1,
        characterNotifications: defaults.characterNotifications,
        notificationTime: { hour: 14, minute: 30 },
        isInitialized: true,
      };
      getStore()[STORAGE_KEY] = JSON.stringify(persisted);

      const result = await loadSettings();
      expect(result.notificationTime).toEqual({ hour: 14, minute: 30 });
      expect(result.isInitialized).toBe(true);
      expect(result.characterNotifications).toEqual(defaults.characterNotifications);
    });

    it('returns default settings for corrupted JSON', async () => {
      getStore()[STORAGE_KEY] = '{not valid json!!!';
      const result = await loadSettings();
      const defaults = initializeDefaultSettings();
      expect(result).toEqual(defaults);
    });

    it('returns default settings for wrong version', async () => {
      const persisted = {
        version: 999,
        characterNotifications: {},
        notificationTime: { hour: 9, minute: 0 },
        isInitialized: true,
      };
      getStore()[STORAGE_KEY] = JSON.stringify(persisted);

      const result = await loadSettings();
      const defaults = initializeDefaultSettings();
      expect(result).toEqual(defaults);
    });

    it('returns default settings when missing fields', async () => {
      getStore()[STORAGE_KEY] = JSON.stringify({ version: 1 });
      const result = await loadSettings();
      const defaults = initializeDefaultSettings();
      expect(result).toEqual(defaults);
    });

    it('returns default settings when AsyncStorage throws', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('read error'));
      const result = await loadSettings();
      const defaults = initializeDefaultSettings();
      expect(result).toEqual(defaults);
    });
  });

  describe('saveSettings', () => {
    beforeEach(() => {
      clearStore();
      jest.clearAllMocks();
      // Restore default setItem implementation
      (AsyncStorage.setItem as jest.Mock).mockImplementation(
        async (key: string, value: string) => { getStore()[key] = value; }
      );
    });

    it('saves settings with version field', async () => {
      const settings = initializeDefaultSettings();
      await saveSettings(settings);

      const stored = JSON.parse(getStore()[STORAGE_KEY]);
      expect(stored.version).toBe(1);
      expect(stored.isInitialized).toBe(true);
      expect(stored.notificationTime).toEqual(settings.notificationTime);
    });

    it('retries on failure and succeeds', async () => {
      const settings = initializeDefaultSettings();
      (AsyncStorage.setItem as jest.Mock)
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockImplementationOnce(async (key: string, value: string) => {
          getStore()[key] = value;
        });

      await saveSettings(settings);
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
      expect(getStore()[STORAGE_KEY]).toBeDefined();
    });

    it('throws after all retries exhausted', async () => {
      const settings = initializeDefaultSettings();
      (AsyncStorage.setItem as jest.Mock)
        .mockRejectedValue(new Error('persistent failure'));

      await expect(saveSettings(settings)).rejects.toThrow('설정 저장에 실패했습니다');
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
    });
  });

  describe('toggleCharacterStage', () => {
    it('flips a character stage from false to true', () => {
      const settings = initializeDefaultSettings();
      // By default '7days' is false
      const updated = toggleCharacterStage(settings, 'CH001', '7days');
      expect(updated.characterNotifications['CH001']['7days']).toBe(true);
    });

    it('flips a character stage from true to false', () => {
      const settings = initializeDefaultSettings();
      // By default 'dday' is true
      const updated = toggleCharacterStage(settings, 'CH001', 'dday');
      expect(updated.characterNotifications['CH001']['dday']).toBe(false);
    });

    it('returns a new object (immutable)', () => {
      const settings = initializeDefaultSettings();
      const updated = toggleCharacterStage(settings, 'CH001', '7days');
      expect(updated).not.toBe(settings);
      expect(updated.characterNotifications).not.toBe(settings.characterNotifications);
      expect(updated.characterNotifications['CH001']).not.toBe(settings.characterNotifications['CH001']);
    });

    it('does not change other characters', () => {
      const settings = initializeDefaultSettings();
      const updated = toggleCharacterStage(settings, 'CH001', '7days');
      expect(updated.characterNotifications['CH002']).toEqual(settings.characterNotifications['CH002']);
    });

    it('does not change other stages of the same character', () => {
      const settings = initializeDefaultSettings();
      const updated = toggleCharacterStage(settings, 'CH001', '7days');
      expect(updated.characterNotifications['CH001']['3days']).toBe(false);
      expect(updated.characterNotifications['CH001']['1day']).toBe(false);
      expect(updated.characterNotifications['CH001']['dday']).toBe(true);
    });
  });

  describe('toggleUnitStage', () => {
    // UN001 (fine) has characters: CH001, CH002, CH003, CH004
    it('sets all characters in unit to true', () => {
      const settings = initializeDefaultSettings();
      const updated = toggleUnitStage(settings, 'UN001', '7days', true);
      expect(updated.characterNotifications['CH001']['7days']).toBe(true);
      expect(updated.characterNotifications['CH002']['7days']).toBe(true);
      expect(updated.characterNotifications['CH003']['7days']).toBe(true);
      expect(updated.characterNotifications['CH004']['7days']).toBe(true);
    });

    it('sets all characters in unit to false', () => {
      const settings = initializeDefaultSettings();
      const updated = toggleUnitStage(settings, 'UN001', 'dday', false);
      expect(updated.characterNotifications['CH001']['dday']).toBe(false);
      expect(updated.characterNotifications['CH002']['dday']).toBe(false);
      expect(updated.characterNotifications['CH003']['dday']).toBe(false);
      expect(updated.characterNotifications['CH004']['dday']).toBe(false);
    });

    it('returns a new object (immutable)', () => {
      const settings = initializeDefaultSettings();
      const updated = toggleUnitStage(settings, 'UN001', '7days', true);
      expect(updated).not.toBe(settings);
    });

    it('does not change characters in other units', () => {
      const settings = initializeDefaultSettings();
      // CH005 belongs to UN002
      const updated = toggleUnitStage(settings, 'UN001', '7days', true);
      expect(updated.characterNotifications['CH005']['7days']).toBe(false);
    });
  });

  describe('getUnitStageState', () => {
    it('returns false when not all characters have stage on (default: 7days is false)', () => {
      const settings = initializeDefaultSettings();
      expect(getUnitStageState(settings, 'UN001', '7days')).toBe(false);
    });

    it('returns true when all characters have stage on (default: dday is true)', () => {
      const settings = initializeDefaultSettings();
      expect(getUnitStageState(settings, 'UN001', 'dday')).toBe(true);
    });

    it('returns false when one character differs', () => {
      const settings = initializeDefaultSettings();
      // Turn off dday for one character in UN001
      const updated = toggleCharacterStage(settings, 'CH001', 'dday');
      expect(getUnitStageState(updated, 'UN001', 'dday')).toBe(false);
    });

    it('returns true after setting all via toggleUnitStage', () => {
      const settings = initializeDefaultSettings();
      const updated = toggleUnitStage(settings, 'UN001', '3days', true);
      expect(getUnitStageState(updated, 'UN001', '3days')).toBe(true);
    });
  });

  describe('setNotificationTime', () => {
    it('updates notification time', () => {
      const settings = initializeDefaultSettings();
      const updated = setNotificationTime(settings, 14, 30);
      expect(updated.notificationTime).toEqual({ hour: 14, minute: 30 });
    });

    it('returns a new object (immutable)', () => {
      const settings = initializeDefaultSettings();
      const updated = setNotificationTime(settings, 14, 30);
      expect(updated).not.toBe(settings);
      expect(updated.notificationTime).not.toBe(settings.notificationTime);
    });

    it('does not change other fields', () => {
      const settings = initializeDefaultSettings();
      const updated = setNotificationTime(settings, 20, 0);
      expect(updated.characterNotifications).toEqual(settings.characterNotifications);
      expect(updated.isInitialized).toBe(settings.isInitialized);
    });
  });
});
